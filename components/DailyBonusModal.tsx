import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface DailyBonusModalProps {
  streak: number;
  onClaim: (amount: number) => void;
  onClose: () => void;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({ streak, onClaim, onClose }) => {
  const [miningState, setMiningState] = useState<'IDLE' | 'MINING' | 'SUCCESS' | 'CLAIMED'>('IDLE');
  const [hashRate, setHashRate] = useState<string>('0000000000000000');
  const [nonce, setNonce] = useState(0);

  // Randomize Reward: Base 50-100 + Streak Multiplier
  const [reward] = useState(() => {
      const base = 50;
      const variance = Math.floor(Math.random() * 51); // 0 to 50
      return base + variance + (streak * 10);
  });

  useEffect(() => {
    let interval: any;
    if (miningState === 'MINING') {
      interval = setInterval(() => {
        setNonce(prev => prev + 1);
        setHashRate(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
      }, 50);

      // Simulate finding a block after 2 seconds
      setTimeout(() => {
        setMiningState('SUCCESS');
        clearInterval(interval);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [miningState]);

  const handleMine = () => {
    setMiningState('MINING');
  };

  const handleClaim = () => {
    setMiningState('CLAIMED');
    setTimeout(() => {
        onClaim(reward);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
        <div className="bg-surface-dark border border-white/10 p-1 rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden group">
             
             {/* Background Effects */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
             
             <div className="bg-[#0D0F12] rounded-[22px] p-6 relative z-10 overflow-hidden">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-3 py-1 mb-4">
                        <span className="material-symbols-outlined text-sm text-warning fill-1">local_fire_department</span>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{streak} Day Streak</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-display mb-1">Daily Consensus</h2>
                    <p className="text-sm text-text-muted">Mine a new block to verify your activity.</p>
                </div>

                {/* Interactive Area */}
                <div className="aspect-square w-full max-w-[200px] mx-auto mb-8 relative flex items-center justify-center">
                    {/* Ring Animation */}
                    <div className={`absolute inset-0 border-4 border-dashed rounded-full transition-all duration-1000 ${
                        miningState === 'MINING' ? 'border-primary animate-spin' : 
                        miningState === 'SUCCESS' ? 'border-success scale-110' : 'border-white/10'
                    }`}></div>
                    
                    {/* Center Icon */}
                    <div className={`size-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                        miningState === 'SUCCESS' ? 'bg-success/20 text-success' : 'bg-surface-highlight text-primary'
                    }`}>
                        {miningState === 'MINING' ? (
                            <div className="font-mono text-xs text-primary text-center leading-none opacity-50 break-all p-4">
                                {hashRate}<br/>Nonce: {nonce}
                            </div>
                        ) : miningState === 'SUCCESS' ? (
                            <span className="material-symbols-outlined text-6xl animate-in zoom-in spin-in-180">check</span>
                        ) : (
                            <span className="material-symbols-outlined text-6xl">grid_view</span>
                        )}
                    </div>
                </div>

                {/* Status Text */}
                <div className="text-center mb-8 h-8">
                     {miningState === 'IDLE' && <p className="text-sm font-bold text-white">Ready to mine block #{840000 + streak}</p>}
                     {miningState === 'MINING' && <p className="text-sm font-mono text-primary animate-pulse">Hashing...</p>}
                     {miningState === 'SUCCESS' && (
                         <div className="animate-in slide-in-from-bottom-2">
                             <p className="text-lg font-bold text-white">Block Found!</p>
                             <p className="text-xs text-success font-mono">Reward: +{reward} XP</p>
                         </div>
                     )}
                </div>

                {/* Action Button */}
                <div className="space-y-3">
                    {miningState === 'IDLE' && (
                        <Button variant="primary" fullWidth size="lg" onClick={handleMine} icon="build">
                            Start Hashing
                        </Button>
                    )}
                    
                    {miningState === 'MINING' && (
                        <Button variant="secondary" fullWidth size="lg" disabled className="opacity-80">
                            Mining...
                        </Button>
                    )}

                    {miningState === 'SUCCESS' && (
                        <Button variant="primary" fullWidth size="lg" onClick={handleClaim} className="bg-success hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                            Claim {reward} XP
                        </Button>
                    )}

                    <button onClick={onClose} className="w-full text-center text-xs text-text-muted hover:text-white py-2 font-bold uppercase tracking-wider">
                        Skip for now
                    </button>
                </div>

             </div>
        </div>
    </div>
  );
};