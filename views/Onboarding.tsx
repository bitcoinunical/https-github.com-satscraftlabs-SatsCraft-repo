import React, { useState } from 'react';
import { PATHS } from '../constants';
import { Button } from '../components/ui/Button';
import { View, PathId } from '../types';

interface OnboardingProps {
  onComplete: (selectedPath: PathId) => void;
}

const SLIDES = [
  {
    id: 1,
    title: "Proof of Skill, Not Certs",
    description: "Your reputation is built through simulation. Generate verifiable skill reports and professional performance audits.",
    icon: "verified_user",
    color: "text-primary",
    bgColor: "bg-primary"
  },
  {
    id: 2,
    title: "Simulation First",
    description: "No passive lectures. You will run nodes, manage keys, and rescue funds in realistic, high-stakes environments.",
    icon: "terminal",
    color: "text-success",
    bgColor: "bg-success"
  },
  {
    id: 3,
    title: "Failure Is Mandatory",
    description: "You will make mistakes here so you don't make them on mainnet. The system forces correction before progression.",
    icon: "warning",
    color: "text-warning",
    bgColor: "bg-warning"
  },
  {
    id: 4,
    title: "Verify, Don't Trust",
    description: "Build a cryptographically signed portfolio of your competence. Prove your work to the network.",
    icon: "fingerprint",
    color: "text-blue-400",
    bgColor: "bg-blue-400"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPath, setSelectedPath] = useState<PathId | null>(null);
  const [showPathSelection, setShowPathSelection] = useState(false);

  const handleNext = () => {
    if (currentSlide === SLIDES.length - 1) {
        setShowPathSelection(true);
    } else {
        setCurrentSlide(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setShowPathSelection(true);
  };

  const renderSlides = () => {
    const slide = SLIDES[currentSlide];

    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in fade-in duration-500 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-dark via-background-dark to-background-dark relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <div 
                className="h-full bg-primary transition-all duration-300 ease-out" 
                style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
            ></div>
        </div>
        
        <div className="relative mb-12 group">
          <div className={`absolute inset-0 ${slide.bgColor}/20 blur-[100px] rounded-full transition-colors duration-500`}></div>
          <div className="relative z-10 bg-surface-dark border border-white/10 p-8 rounded-3xl shadow-2xl ring-1 ring-white/5">
            <span className={`material-symbols-outlined text-[80px] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors duration-500 ${slide.color}`}>
              {slide.icon}
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white mb-6 font-display max-w-3xl animate-in slide-in-from-bottom-4 duration-500" key={`title-${currentSlide}`}>
          {slide.title}
        </h1>
        <p className="text-text-muted text-lg md:text-xl leading-relaxed font-medium max-w-xl mx-auto mb-12 animate-in slide-in-from-bottom-2 duration-500 delay-100" key={`desc-${currentSlide}`}>
          {slide.description}
        </p>

        <div className="w-full max-w-xs flex flex-col gap-4">
          <Button variant="primary" fullWidth size="lg" onClick={handleNext}>
            {currentSlide === SLIDES.length - 1 ? "Choose Your Path" : "Next Sequence"}
          </Button>
          {currentSlide < SLIDES.length - 1 && (
             <button onClick={handleSkip} className="text-text-muted text-sm font-bold uppercase tracking-wider hover:text-white transition-colors p-2">
                Skip Intro
             </button>
          )}
        </div>
        
        {/* Slide Indicators */}
        <div className="flex gap-2 mt-12">
            {SLIDES.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-primary' : 'w-1.5 bg-white/10'}`}
                ></div>
            ))}
        </div>
      </div>
    );
  };

  const renderPathSelection = () => (
    <div className="flex flex-col h-full bg-background-dark animate-in slide-in-from-right duration-500">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
          {/* Header */}
          <div className="px-6 md:px-8 pt-8 pb-6 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-text-main mb-2 font-display">Choose Your Path</h2>
                <p className="text-text-muted max-w-xl">Select a specialized track to begin your simulation sequence. All paths lead to sovereign competence.</p>
            </div>
            {/* Desktop Action Button */}
            <div className="hidden md:block">
                 <Button 
                  variant="primary" 
                  size="lg" 
                  disabled={!selectedPath}
                  onClick={() => selectedPath && onComplete(selectedPath)}
                  icon="arrow_forward"
                  className="min-w-[240px] shadow-lg shadow-primary/20"
                >
                  Initialize Simulation
                </Button>
            </div>
          </div>
          
          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24 md:pb-0">
                {PATHS.map((path) => (
                  <div 
                    key={path.id}
                    onClick={() => setSelectedPath(path.id)}
                    className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 flex flex-col h-full
                      ${selectedPath === path.id 
                        ? 'bg-surface-dark border-primary ring-1 ring-primary shadow-[0_0_30px_-10px_rgba(247,147,26,0.3)] scale-[1.02] z-10' 
                        : 'bg-surface-dark/40 border-white/5 hover:border-primary/50 hover:bg-surface-highlight'
                      }`}
                  >
                    {selectedPath === path.id && (
                      <div className="absolute right-3 top-3 text-primary animate-in zoom-in duration-300">
                        <span className="material-symbols-outlined fill-1">check_circle</span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl flex items-center justify-center transition-colors
                            ${selectedPath === path.id ? 'bg-primary/20 text-primary' : 'bg-white/5 text-text-main group-hover:text-primary'}`}>
                            <span className="material-symbols-outlined text-[28px]">{path.icon}</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-2 font-display ${selectedPath === path.id ? 'text-primary' : 'text-text-main'}`}>
                        {path.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-text-muted mb-4">
                        {path.description}
                        </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedPath === path.id ? 'bg-primary' : 'bg-text-muted'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${selectedPath === path.id ? 'bg-primary' : 'bg-text-muted'}`}></span>
                            </span>
                            <span className={`text-[10px] font-bold tracking-wide ${selectedPath === path.id ? 'text-primary' : 'text-text-muted'}`}>{path.activeLearners} ACTIVE</span>
                        </div>
                        <span className="text-[10px] font-mono text-text-muted bg-white/5 px-2 py-1 rounded">{path.modules.length} MODS</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Mobile Action Button */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-20">
            <Button 
              variant="primary" 
              fullWidth 
              size="lg" 
              disabled={!selectedPath}
              onClick={() => selectedPath && onComplete(selectedPath)}
              icon="arrow_forward"
              className="shadow-xl"
            >
              Initialize Simulation
            </Button>
          </div>
      </div>
    </div>
  );

  return showPathSelection ? renderPathSelection() : renderSlides();
};