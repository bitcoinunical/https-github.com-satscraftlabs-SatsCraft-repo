import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { ModuleContent, SimulationStep } from '../types';

interface StandardSimulationProps {
  content: ModuleContent;
  onComplete: () => void;
  onExit: () => void;
}

export const StandardSimulation: React.FC<StandardSimulationProps> = ({ content, onComplete, onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentStep = content.steps[currentStepIndex];
  const isLastStep = currentStepIndex === content.steps.length - 1;

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption) return; // Prevent multiple clicks

    setSelectedOption(optionId);
    const option = currentStep.options?.find(o => o.id === optionId);
    
    if (option) {
        setFeedback(option.feedback);
        if (!option.isCorrect) {
            setHasFailed(true);
        }
    }
  };

  const handleContinue = () => {
    if (hasFailed) {
        // Reset step to retry
        setHasFailed(false);
        setSelectedOption(null);
        setFeedback(null);
    } else {
        if (isLastStep) {
            onComplete();
        } else {
            setCurrentStepIndex(prev => prev + 1);
            setSelectedOption(null);
            setFeedback(null);
        }
    }
  };

  const renderVisual = (type: string) => {
    switch (type) {
        case 'TIMELINE':
            return (
                <div className="flex items-center justify-center h-48 md:h-64 gap-4 md:gap-8">
                     <div className="flex flex-col items-center opacity-50 transition-opacity hover:opacity-100">
                        <span className="material-symbols-outlined text-4xl md:text-5xl mb-3 p-4 bg-surface-dark rounded-full border border-white/10">savings</span>
                        <span className="text-xs uppercase font-bold tracking-widest">Gold</span>
                     </div>
                     <div className="h-0.5 w-8 md:w-16 bg-white/10"></div>
                     <div className="flex flex-col items-center opacity-50 transition-opacity hover:opacity-100">
                        <span className="material-symbols-outlined text-4xl md:text-5xl mb-3 p-4 bg-surface-dark rounded-full border border-white/10">account_balance</span>
                        <span className="text-xs uppercase font-bold tracking-widest">Banks</span>
                     </div>
                     <div className="h-0.5 w-8 md:w-16 bg-white/10"></div>
                     <div className="flex flex-col items-center text-primary">
                        <div className="relative">
                            <span className="material-symbols-outlined text-5xl md:text-6xl mb-3 p-4 bg-primary/20 rounded-full border border-primary shadow-[0_0_30px_-5px_rgba(247,147,26,0.5)] animate-pulse-slow">currency_bitcoin</span>
                            <div className="absolute -top-1 -right-1 size-4 bg-success rounded-full border-2 border-background-dark"></div>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Bitcoin</span>
                     </div>
                </div>
            );
        case 'BLOCKCHAIN':
            return (
                <div className="flex items-center justify-center h-48 md:h-64 gap-2 md:gap-4 overflow-x-auto px-4">
                     <div className="size-20 md:size-24 border-2 border-white/10 bg-surface-dark rounded-xl flex flex-col items-center justify-center gap-1 opacity-50">
                        <span className="material-symbols-outlined text-xl">lock</span>
                        <span className="font-mono text-[10px] text-text-muted">#800</span>
                     </div>
                     <div className="w-6 h-1 bg-white/10"></div>
                     <div className="size-20 md:size-24 border-2 border-white/10 bg-surface-dark rounded-xl flex flex-col items-center justify-center gap-1 opacity-75">
                        <span className="material-symbols-outlined text-xl">lock</span>
                        <span className="font-mono text-[10px] text-text-muted">#801</span>
                     </div>
                     <div className="w-6 h-1 bg-white/10"></div>
                     <div className="size-20 md:size-24 border-2 border-primary bg-primary/10 rounded-xl flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(247,147,26,0.3)] transform scale-110">
                        <span className="material-symbols-outlined text-primary text-2xl">pending</span>
                        <span className="font-mono text-[10px] font-bold text-white">#802</span>
                     </div>
                </div>
            );
        default: // CARDS or default
            return (
                <div className="flex items-center justify-center h-48 md:h-64">
                    <span className="material-symbols-outlined text-9xl text-primary/10">schema</span>
                </div>
            );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-background-dark">
      {/* Left Panel: Content (Context) */}
      <div className="w-full md:w-1/3 lg:w-[30%] border-b md:border-b-0 md:border-r border-white/5 flex flex-col bg-surface-dark/50 backdrop-blur-sm z-10 shrink-0 h-1/3 md:h-full">
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            <button onClick={onExit} className="text-text-muted hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-8 transition-colors">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Abort Simulation
            </button>
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
                <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                Context Loaded
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 font-display leading-tight">{currentStep.title}</h1>
            
            <div className="prose prose-invert prose-sm prose-p:text-text-muted prose-p:leading-7 prose-headings:text-white">
                {currentStep.explanation.split('\n').map((para, i) => (
                    <p key={i} className="mb-4">{para}</p>
                ))}
            </div>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-surface-dark/80 backdrop-blur">
            <div className="flex gap-1 mb-2">
                {content.steps.map((_, idx) => (
                    <div key={idx} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${idx <= currentStepIndex ? 'bg-primary' : 'bg-white/10'}`}></div>
                ))}
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-text-muted uppercase">
                <span>Sequence {currentStepIndex + 1}/{content.steps.length}</span>
                <span>ID: {content.id}</span>
            </div>
        </div>
      </div>

      {/* Center & Right: Interaction Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-dark/50 via-background-dark to-background-dark">
        {/* Interaction Stage */}
        <div className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center overflow-y-auto">
            <div className="w-full max-w-4xl animate-in zoom-in duration-500">
                {renderVisual(currentStep.visualType)}
                
                {/* NEW: Explicit Question Rendering */}
                {currentStep.question && (
                    <div className="mt-8 md:mt-12 text-center">
                        <h2 className="text-xl md:text-2xl font-bold text-white font-display leading-snug">
                            {currentStep.question}
                        </h2>
                    </div>
                )}
                
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 w-full ${currentStep.question ? 'mt-8' : 'mt-16'}`}>
                    {currentStep.options?.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionSelect(opt.id)}
                            disabled={!!selectedOption}
                            className={`p-6 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden flex flex-col gap-2
                                ${selectedOption === opt.id 
                                    ? (opt.isCorrect 
                                        ? 'bg-success/10 border-success text-white shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)] scale-[1.02]' 
                                        : 'bg-error/10 border-error text-white shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)] scale-[1.02]')
                                    : 'bg-surface-dark border-white/10 hover:border-primary/50 text-text-main hover:bg-surface-highlight hover:-translate-y-1'
                            } ${!!selectedOption && selectedOption !== opt.id ? 'opacity-40 grayscale' : ''}`}
                        >
                            <span className="material-symbols-outlined text-3xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                {opt.isCorrect && selectedOption === opt.id ? 'check_circle' : 
                                 !opt.isCorrect && selectedOption === opt.id ? 'cancel' : 'radio_button_unchecked'}
                            </span>
                            <h3 className="font-bold text-lg relative z-10">{opt.label}</h3>
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Bottom Feedback Panel - Slides up */}
        <div className={`border-t border-white/10 backdrop-blur-xl transition-all duration-500 ease-out transform
            ${selectedOption ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
            ${hasFailed ? 'bg-error/10 border-error/20' : 'bg-success/10 border-success/20'}
        `}>
            {selectedOption && (
                <div className="max-w-5xl mx-auto p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4 w-full md:w-auto">
                        <div className={`size-12 rounded-full flex items-center justify-center shrink-0 border-2 ${hasFailed ? 'bg-error/20 text-error border-error' : 'bg-success/20 text-success border-success'}`}>
                            <span className="material-symbols-outlined text-2xl">{hasFailed ? 'priority_high' : 'done_all'}</span>
                        </div>
                        <div>
                            <h4 className={`text-lg font-bold font-display ${hasFailed ? 'text-error' : 'text-success'}`}>
                                {hasFailed ? 'Simulation Logic Failed' : 'Consensus Reached'}
                            </h4>
                            <p className="text-sm md:text-base text-white mt-1 leading-relaxed max-w-2xl">{feedback}</p>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-auto shrink-0">
                        <Button 
                            onClick={handleContinue}
                            variant={hasFailed ? 'secondary' : 'primary'}
                            size="lg"
                            fullWidth
                            icon={hasFailed ? 'refresh' : 'arrow_forward'}
                            className="shadow-xl"
                        >
                            {hasFailed ? 'Retry Sequence' : (isLastStep ? 'Complete Module' : 'Next Sequence')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};