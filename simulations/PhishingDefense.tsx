import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

export const PhishingDefense: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alex (Support)', isBot: true, text: "Hey there, this is Alex from Lightning Node Support. We detected a critical bug in your channel state. 🚨", time: "9:41 AM" },
    { id: 2, sender: 'Alex (Support)', isBot: true, text: "You need to force close immediately or you'll lose the liquidity. Please sign this PSBT to sweep your funds to safety.", time: "9:41 AM", attachment: "emergency_sweep_v2.psbt" },
  ]);
  const [selectedAction, setSelectedAction] = useState<'verify' | 'sign' | 'ask' | null>(null);

  const handleAction = (action: 'verify' | 'sign' | 'ask') => {
    setSelectedAction(action);
    if (action === 'verify') {
        setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark relative">
      <div className="bg-surface-dark border-b border-white/10 px-6 py-4 flex justify-between items-center z-10 sticky top-0 shadow-md">
        <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">security</span>
                Challenge: The Urgent DM
            </h1>
            <p className="text-xs text-text-muted mt-1">Identify social engineering flags in real-time communication</p>
        </div>
        <div className="flex items-center gap-2 bg-error/10 px-3 py-1.5 rounded-full border border-error/20 animate-pulse-slow">
            <span className="material-symbols-outlined text-error text-[18px]">gpp_maybe</span>
            <span className="text-[10px] font-bold text-error uppercase tracking-wider">High Risk Scenario</span>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 pb-40">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            <div className="text-center py-4">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Today 9:41 AM</span>
            </div>

            {messages.map((msg) => (
                <div key={msg.id} className="flex items-end gap-3 animate-in slide-in-from-left duration-300">
                    <div className="size-10 rounded-full bg-surface-highlight border border-white/10 flex items-center justify-center text-xs font-bold text-text-muted shrink-0">
                        AS
                    </div>
                    <div className="flex flex-col items-start gap-1 max-w-[85%]">
                        <span className="text-[11px] font-medium text-text-muted ml-1 flex items-center gap-1">
                            {msg.sender}
                            {msg.isBot && <span className="bg-primary/20 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border border-primary/20">Bot</span>}
                        </span>
                        <div className="p-4 bg-surface-dark rounded-2xl rounded-tl-none border border-white/5 text-sm text-text-main leading-relaxed shadow-lg">
                            {msg.text}
                            {msg.attachment && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-background-dark border border-white/10 mt-3 hover:border-primary/30 transition-colors cursor-pointer group">
                                    <div className="size-10 rounded bg-error/10 flex items-center justify-center shrink-0 text-error group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">warning</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate text-white font-mono group-hover:text-primary transition-colors">{msg.attachment}</p>
                                        <p className="text-[10px] text-text-muted font-medium">1.2 MB • Click to Sign</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </main>

      {/* Action Area */}
      <div className="absolute bottom-0 w-full bg-surface-dark/95 backdrop-blur-xl border-t border-white/10 p-6 md:p-8 z-40">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                Decision Required
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                    onClick={() => handleAction('sign')}
                    className={`h-auto py-4 px-4 rounded-xl text-left flex flex-col justify-between group border transition-all hover:shadow-lg ${
                        selectedAction === 'sign' ? 'bg-error/20 border-error text-error' : 'bg-surface-dark hover:bg-surface-highlight border-white/10 hover:border-white/20'
                    }`}
                >
                    <span className="material-symbols-outlined text-2xl mb-2">send</span>
                    <span className="text-sm font-bold">Sign PSBT</span>
                    <span className="text-[10px] opacity-70">Immediate Execution</span>
                </button>

                <button 
                    onClick={() => handleAction('ask')}
                    className="h-auto py-4 px-4 rounded-xl text-left flex flex-col justify-between group border border-white/10 hover:border-white/20 hover:bg-surface-highlight transition-all hover:shadow-lg text-text-main"
                >
                    <span className="material-symbols-outlined text-2xl mb-2 text-text-muted">help</span>
                    <span className="text-sm font-bold">Request Info</span>
                    <span className="text-[10px] opacity-70">Clarify the bug</span>
                </button>

                <button 
                    onClick={() => handleAction('verify')}
                    className={`h-auto py-4 px-4 rounded-xl text-left flex flex-col justify-between shadow-lg transition-all active:scale-[0.98] ${
                        selectedAction === 'verify' ? 'bg-success text-white ring-2 ring-white/20' : 'bg-primary hover:bg-primary-dark text-background-dark font-bold'
                    }`}
                >
                    <span className="material-symbols-outlined text-2xl mb-2">verified_user</span>
                    <span className="text-sm font-bold">Verify Channel</span>
                    <span className="text-[10px] opacity-70">Check Official Sources</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};