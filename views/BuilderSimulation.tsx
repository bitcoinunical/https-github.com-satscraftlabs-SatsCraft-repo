import React, { useState } from 'react';
import { IDE } from '../components/IDE';
import { Button } from '../components/ui/Button';
import { BuilderContent } from '../types';

interface BuilderSimulationProps {
  content: BuilderContent;
  onComplete: () => void;
  onExit: () => void;
}

export const BuilderSimulation: React.FC<BuilderSimulationProps> = ({ content, onComplete, onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [output, setOutput] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isStepSuccess, setIsStepSuccess] = useState(false);

  const step = content.steps[currentStepIndex];
  const isLastStep = currentStepIndex === content.steps.length - 1;

  const handleRunCode = (code: string) => {
    setOutput({ type: 'info', message: 'Compiling/Parsing...' });
    
    setTimeout(() => {
        let result = { passed: false, error: 'Unknown Error' };
        
        if (step.validationFunction) {
            result = step.validationFunction(code);
        } else if (step.validationPattern) {
            // Fallback regex check
            const passed = new RegExp(step.validationPattern).test(code);
            result = { passed, error: passed ? undefined : 'Validation Pattern Mismatch' };
        }

        if (result.passed) {
            setOutput({ type: 'success', message: step.successMessage });
            setIsStepSuccess(true);
        } else {
            setOutput({ type: 'error', message: result.error || 'Syntax Error' });
            setIsStepSuccess(false);
        }
    }, 800);
  };

  const handleNext = () => {
    if (isLastStep) {
        onComplete();
    } else {
        setCurrentStepIndex(prev => prev + 1);
        setIsStepSuccess(false);
        setOutput(null);
    }
  };

  return (
    <div className="flex h-full bg-[#0D0F12]">
      {/* Left Panel: Instructions */}
      <div className="w-1/3 border-r border-white/5 bg-[#161A1E] flex flex-col z-10 shadow-2xl">
         <div className="p-6 border-b border-white/5 flex justify-between items-center">
             <button onClick={onExit} className="text-text-muted hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Exit Builder
            </button>
            <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                Dev Environment
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 md:p-8">
             <div className="mb-6">
                 <h2 className="text-2xl font-bold text-white font-display mb-2">{content.title}</h2>
                 <div className="flex gap-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     {content.steps.map((_, i) => (
                         <div key={i} className={`flex-1 transition-colors ${i <= currentStepIndex ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                     ))}
                 </div>
                 <p className="text-xs text-text-muted mt-2 font-mono uppercase">Task {currentStepIndex + 1} / {content.steps.length}</p>
             </div>

             <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
             <div className="prose prose-invert prose-sm text-text-muted leading-relaxed whitespace-pre-line">
                 {step.description}
             </div>

             <div className="mt-8 p-4 bg-blue-900/10 border-l-2 border-blue-500 rounded-r-lg">
                 <p className="text-xs text-blue-200 font-bold uppercase mb-1 flex items-center gap-2">
                     <span className="material-symbols-outlined text-sm">lightbulb</span> 
                     Hint
                 </p>
                 <p className="text-sm text-blue-100/80 italic">{step.hint}</p>
             </div>
         </div>

         <div className="p-6 border-t border-white/5 bg-[#0D0F12]">
             <Button 
                variant={isStepSuccess ? 'primary' : 'secondary'} 
                disabled={!isStepSuccess} 
                fullWidth 
                size="lg"
                onClick={handleNext}
                icon="arrow_forward"
             >
                 {isLastStep ? 'Commit Module' : 'Next Task'}
             </Button>
         </div>
      </div>

      {/* Right Panel: IDE */}
      <div className="flex-1 p-4 md:p-6 bg-[#0D0F12] overflow-hidden flex flex-col">
          <IDE 
            initialCode={step.initialCode} 
            language={step.language} 
            onRun={handleRunCode}
            output={output}
            isSuccess={isStepSuccess}
          />
      </div>
    </div>
  );
};