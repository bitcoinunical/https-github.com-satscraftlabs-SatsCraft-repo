import React from 'react';
import { Button } from '../components/ui/Button';

export const Audit: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark p-6 animate-in zoom-in duration-300">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="relative">
            <div className="absolute inset-0 bg-success/20 blur-[40px] rounded-full"></div>
            <div className="relative size-32 rounded-full bg-success/10 border-2 border-success flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-success">check_circle</span>
            </div>
        </div>
        
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Simulation Passed</h1>
            <p className="text-text-muted">Audit Report ID: #882-X9</p>
        </div>

        <div className="w-full max-w-sm grid grid-cols-3 gap-3">
            <div className="bg-surface-dark p-3 rounded-xl border border-white/5 text-center">
                <span className="block text-2xl font-bold text-white">98%</span>
                <span className="text-[10px] text-text-muted uppercase font-bold">Accuracy</span>
            </div>
            <div className="bg-surface-dark p-3 rounded-xl border border-white/5 text-center">
                <span className="block text-2xl font-bold text-white">A+</span>
                <span className="text-[10px] text-text-muted uppercase font-bold">Grade</span>
            </div>
            <div className="bg-surface-dark p-3 rounded-xl border border-white/5 text-center">
                <span className="block text-2xl font-bold text-primary">+450</span>
                <span className="text-[10px] text-text-muted uppercase font-bold">XP</span>
            </div>
        </div>

        <div className="w-full max-w-sm bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs h-32 overflow-y-auto">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <span className="text-text-muted">00:00:01</span>
                    <span className="text-white">Initializing core systems...</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-text-muted">00:01:23</span>
                    <span className="text-white">Validated Block Header #9921</span>
                    <span className="text-success">[OK]</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-text-muted">00:02:15</span>
                    <span className="text-white">Inputs Selected Correctly</span>
                    <span className="text-success">[OK]</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-text-muted">00:03:42</span>
                    <span className="text-white">Fee Calculation Optimal</span>
                    <span className="text-success">[OK]</span>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="primary" fullWidth size="lg" onClick={onReturn} icon="dashboard">
            Return to Dashboard
        </Button>
        <Button variant="ghost" fullWidth size="sm">
            Download Verifiable Report
        </Button>
      </div>
    </div>
  );
};