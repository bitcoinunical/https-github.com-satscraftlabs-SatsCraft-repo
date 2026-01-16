import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

export const LightningSandbox: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [localBalance, setLocalBalance] = useState(340000);
  const remoteBalance = 500000 - localBalance;
  const [rebalanceAmount, setRebalanceAmount] = useState(50000);
  const targetPayment = 150000; // Requires remote balance > 150k to receive? Or local to send? 
  // Scenario: We need to receive 400k sats, but only have 160k remote inbound. We need to push funds to remote side?
  // Let's simpler scenario: Rebalance to get 50/50 ratio.

  const total = 500000;
  const localPct = (localBalance / total) * 100;

  const handleRebalance = () => {
    // Circular rebalance: Send to self via another route to shift balance from local to remote
    setLocalBalance(prev => Math.max(0, prev - rebalanceAmount));
  };

  const isBalanced = localPct >= 40 && localPct <= 60;

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <div className="p-4 border-b border-white/5 sticky top-0 bg-background-dark z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary text-sm">info</span>
          <p className="text-primary text-xs font-bold uppercase tracking-wider">Objective</p>
        </div>
        <p className="text-white text-lg font-bold leading-tight mb-1">Channel Rebalancing</p>
        <p className="text-text-muted text-sm leading-relaxed">
          Balance your channel to ~50% to optimize for routing both inbound and outbound payments.
        </p>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Channel Visualizer */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">Local (Outbound)</p>
              <p className="text-white text-2xl font-bold tracking-tight font-mono">{localBalance.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">Remote (Inbound)</p>
              <p className="text-white text-2xl font-bold tracking-tight font-mono">{remoteBalance.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="relative h-12 w-full rounded-xl bg-surface-highlight overflow-hidden flex ring-1 ring-white/10">
            <div 
              className="h-full bg-primary flex items-center justify-center text-[10px] font-bold text-background-dark transition-all duration-500" 
              style={{ width: `${localPct}%` }}
            >
              {Math.round(localPct)}%
            </div>
            <div className="h-full flex-1 flex items-center justify-center text-[10px] font-bold text-text-muted transition-all duration-500">
              {Math.round(100 - localPct)}%
            </div>
            
            {/* Target Zone Marker */}
            <div className="absolute top-0 bottom-0 left-[40%] right-[40%] border-x-2 border-dashed border-success/30 pointer-events-none bg-success/5 flex items-center justify-center">
                <span className="text-[9px] text-success font-bold opacity-50 uppercase tracking-widest -rotate-90">Target</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-surface-dark rounded-xl p-5 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <p className="text-white font-medium">Rebalance Amount</p>
            <span className="text-primary font-bold font-mono bg-primary/10 px-2 py-1 rounded">{rebalanceAmount.toLocaleString()} sats</span>
          </div>
          <input 
            type="range" 
            className="w-full h-2 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary mb-6"
            min="10000" 
            max="100000" 
            step="10000"
            value={rebalanceAmount}
            onChange={(e) => setRebalanceAmount(Number(e.target.value))}
          />
          
          <div className="grid grid-cols-2 gap-3">
             <Button variant="secondary" onClick={() => setLocalBalance(340000)} icon="restart_alt">Reset</Button>
             <Button variant="primary" onClick={handleRebalance} icon="sync_alt">Execute</Button>
          </div>
        </div>

        {/* Feedback Area */}
        <div className="bg-black/30 rounded-xl p-4 border border-white/5 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-text-muted">14:02:10</span>
                <span className="text-success">&gt; Channel state loaded</span>
            </div>
            {isBalanced ? (
                <div className="flex items-center gap-2">
                    <span className="text-text-muted">14:02:15</span>
                    <span className="text-success font-bold">&gt; CHANNEL BALANCED. ROUTING EFFICIENCY OPTIMIZED.</span>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-text-muted">14:02:11</span>
                    <span className="text-warning">&gt; Warning: Liquidity skewed local. Rebalance recommended.</span>
                </div>
            )}
        </div>
      </main>

      <div className="p-4 border-t border-white/10 bg-background-dark">
        <Button 
          variant="primary" 
          fullWidth 
          size="lg" 
          disabled={!isBalanced}
          onClick={onComplete}
        >
          Confirm Optimization
        </Button>
      </div>
    </div>
  );
};