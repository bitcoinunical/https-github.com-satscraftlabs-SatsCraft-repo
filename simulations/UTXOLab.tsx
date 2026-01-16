import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

interface UTXO {
  id: string;
  amount: number;
  selected: boolean;
}

export const UTXOLab: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [utxos, setUtxos] = useState<UTXO[]>([
    { id: '#101', amount: 0.50, selected: false },
    { id: '#102', amount: 1.20, selected: false },
    { id: '#103', amount: 0.05, selected: false },
    { id: '#104', amount: 0.10, selected: false },
  ]);
  const [feeRate, setFeeRate] = useState(12);
  const targetAmount = 1.25;

  const toggleUtxo = (id: string) => {
    setUtxos(prev => prev.map(u => u.id === id ? { ...u, selected: !u.selected } : u));
  };

  const selectedInputTotal = utxos.filter(u => u.selected).reduce((acc, curr) => acc + curr.amount, 0);
  const estimatedSize = 140 + (utxos.filter(u => u.selected).length * 68) + 32; // basic estimation
  const fee = (estimatedSize * feeRate) / 100000000; // convert sats to BTC
  const totalNeeded = targetAmount + fee;
  const change = selectedInputTotal - totalNeeded;
  const isFunded = selectedInputTotal >= totalNeeded;

  return (
    <div className="flex flex-col h-full bg-background-dark">
      {/* Simulation Header */}
      <div className="p-4 border-b border-white/5 bg-background-dark/95 backdrop-blur z-10 sticky top-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white">1.4 UTXO Model Lab</h2>
          <span className="text-xs font-mono text-text-muted">BLOCK 824,102</span>
        </div>
        <div className="bg-surface-highlight rounded-lg p-3 border border-white/5">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-text-muted">Payment Target</span>
            <span className="text-white font-mono font-bold">{targetAmount.toFixed(8)} BTC</span>
          </div>
          <div className="flex justify-between items-center text-sm">
             <span className="text-text-muted">Inputs Selected</span>
             <span className={`font-mono font-bold ${isFunded ? 'text-success' : 'text-error'}`}>
               {selectedInputTotal.toFixed(8)} BTC
             </span>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Workspace */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Available UTXOs</h3>
            <span className="text-xs text-primary font-mono">1.85 BTC Total</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {utxos.map(utxo => (
              <button
                key={utxo.id}
                onClick={() => toggleUtxo(utxo.id)}
                className={`relative p-4 rounded-xl text-left transition-all border ${
                  utxo.selected 
                    ? 'bg-primary border-primary text-background-dark shadow-[0_0_15px_-3px_rgba(247,147,26,0.5)]' 
                    : 'bg-surface-dark border-white/5 text-text-main hover:bg-surface-highlight'
                }`}
              >
                {utxo.selected && (
                  <span className="absolute top-2 right-2 material-symbols-outlined text-[18px]">check_circle</span>
                )}
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider block mb-1">
                  {utxo.id}
                </span>
                <span className="text-xl font-bold tracking-tight font-mono">
                  {utxo.amount.toFixed(2)}
                </span>
                <span className="text-xs font-medium ml-1 opacity-80">BTC</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Visualizer */}
        <div className={`rounded-2xl border-2 border-dashed p-6 transition-all duration-300 ${
          isFunded 
            ? 'border-success/30 bg-success/5' 
            : 'border-white/10 bg-surface-dark/30'
        }`}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
               <span className="text-xs text-text-muted uppercase">Miner Fee</span>
               <span className="text-xs font-mono text-warning">~{fee.toFixed(8)} BTC</span>
            </div>
            
            {isFunded && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-muted uppercase">Change Output</span>
                <span className="text-xs font-mono text-white">{change.toFixed(8)} BTC</span>
              </div>
            )}

            {!isFunded ? (
               <div className="flex flex-col items-center justify-center text-center py-4 text-text-muted">
                 <span className="material-symbols-outlined mb-2">input</span>
                 <p className="text-sm">Select UTXOs to fund transaction</p>
               </div>
            ) : (
               <div className="bg-background-dark/50 rounded-lg p-3 border border-white/5">
                 <p className="text-xs font-mono text-success text-center">VALID TRANSACTION CONSTRUCTED</p>
               </div>
            )}
          </div>
        </div>

        {/* Fee Slider */}
        <div className="bg-surface-dark rounded-xl p-4 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-text-muted">Fee Rate</label>
            <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-primary">{feeRate} sat/vB</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={feeRate} 
            onChange={(e) => setFeeRate(Number(e.target.value))}
            className="w-full h-2 bg-background-dark rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-2 text-[10px] text-text-muted font-bold uppercase">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </main>

      <div className="p-4 border-t border-white/10 bg-background-dark">
        <Button 
          variant="primary" 
          fullWidth 
          size="lg" 
          disabled={!isFunded}
          onClick={onComplete}
          icon="send"
        >
          Broadcast Transaction
        </Button>
      </div>
    </div>
  );
};