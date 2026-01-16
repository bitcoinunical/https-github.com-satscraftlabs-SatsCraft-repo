import React from 'react';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background-dark overflow-y-auto custom-scrollbar animate-in fade-in duration-500 p-6 md:p-8">
      
      <div className="max-w-2xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <div className="size-16 rounded-full bg-surface-highlight border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-text-muted">settings</span>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white font-display">System Configuration</h1>
                <p className="text-text-muted">Manage your identity and simulator preferences.</p>
            </div>
        </div>

        {/* Identity Section */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">fingerprint</span>
                    Identity
                </h2>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Display Name</label>
                    <input 
                        type="text" 
                        value="Satoshi_Vz" 
                        disabled 
                        className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white font-mono opacity-60 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-text-muted mt-2">Identity is cryptographically bound to your progress. Cannot be changed.</p>
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Nostr Public Key (npub)</label>
                    <div className="flex gap-2">
                         <input 
                            type="text" 
                            value="npub1..." 
                            disabled 
                            className="flex-1 bg-background-dark border border-white/10 rounded-xl p-3 text-text-muted font-mono text-sm"
                        />
                        <Button variant="secondary" size="md" icon="key">Connect</Button>
                    </div>
                </div>
            </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
             <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400">tune</span>
                    Preferences
                </h2>
            </div>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold">Denomination</h3>
                        <p className="text-xs text-text-muted">Display values in Satoshis or BTC</p>
                    </div>
                    <div className="flex bg-background-dark p-1 rounded-lg border border-white/5">
                        <button className="px-3 py-1 bg-surface-highlight rounded text-xs font-bold text-white shadow-sm">BTC</button>
                        <button className="px-3 py-1 text-xs font-bold text-text-muted hover:text-white transition-colors">SATS</button>
                    </div>
                </div>
                 <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div>
                        <h3 className="text-white font-bold">Sound Effects</h3>
                        <p className="text-xs text-text-muted">UI feedback sounds</p>
                    </div>
                     <div className="w-10 h-6 bg-success rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Data Management */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
             <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-warning">database</span>
                    Data Management
                </h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold">Export Audit Logs</h3>
                        <p className="text-xs text-text-muted">Download signed JSON proof of all completed simulations.</p>
                    </div>
                    <Button variant="secondary" size="sm" icon="download">Export</Button>
                </div>
                <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                     <div>
                        <h3 className="text-error font-bold">Reset Progress</h3>
                        <p className="text-xs text-text-muted">Wipe all XP, ranks, and module history. Irreversible.</p>
                    </div>
                    <Button variant="danger" size="sm" icon="delete_forever">Reset</Button>
                </div>
            </div>
        </div>

        {/* Support Section */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
             <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-400">help</span>
                    Support & Feedback
                </h2>
            </div>
            <div className="p-6">
                <p className="text-sm text-text-muted mb-4">
                    Encountered a bug in the simulation or have a feature request?
                </p>
                <div className="flex items-center justify-between bg-background-dark p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                        <div>
                            <div className="text-xs text-text-muted uppercase font-bold">Engineering Team</div>
                            <a href="mailto:satscraftlabs@gmail.com" className="text-white font-mono font-bold hover:text-primary transition-colors">satscraftlabs@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="text-center pt-8 pb-4">
            <p className="text-xs text-text-muted font-mono">SatsCraft v0.8.2 (Beta)</p>
            <p className="text-[10px] text-text-muted opacity-50 mt-1">Build Hash: a1b2c3d4</p>
        </div>

      </div>
    </div>
  );
};