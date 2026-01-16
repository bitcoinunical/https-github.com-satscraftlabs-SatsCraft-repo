import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { StressEvent, StressEventSeverity, PathId } from '../types';

interface StressTestProps {
  onComplete: (success: boolean, score: number) => void;
  onExit: () => void;
  pathId?: PathId;
}

const SCENARIOS: Record<string, Omit<StressEvent, 'id' | 'timestamp' | 'resolved'>[]> = {
    [PathId.LIGHTNING_OPERATOR]: [
        { type: 'CHANNEL_BREACH', title: 'HTLC Breach Attempt', symptom: 'WARN: Channel 24x789 state mismatch. Remote peer broadcasting old commitment.', rootCause: 'Malicious Peer / Watchtower Latency', severity: 'CRITICAL', decayRate: 1.5 },
        { type: 'FEE_SPIKE', title: 'Mempool Congestion', symptom: 'ERROR: 14 HTLCs pending. Commitment tx fee below relay threshold.', rootCause: 'Fee Market Volatility', severity: 'HIGH', decayRate: 0.8 },
        { type: 'DB_CORRUPTION', title: 'State DB Lock', symptom: 'FATAL: channel.db is locked by another process. RPC unresponsive.', rootCause: 'IO Wait / Disk Failure', severity: 'HIGH', decayRate: 1.2 },
        { type: 'PEER_DISCONNECT', title: 'Liquidity Partition', symptom: 'INFO: 80% of inbound liquidity offline. Routing failures increasing.', rootCause: 'Peer ISP Outage', severity: 'MEDIUM', decayRate: 0.4 },
        { type: 'GOSSIP_FLOOD', title: 'Gossip Storm', symptom: 'WARN: CPU load > 95%. Processing excessive channel updates.', rootCause: 'DDoS / Spam', severity: 'LOW', decayRate: 0.2 },
    ],
    [PathId.SOVEREIGN]: [
        { type: 'SYBIL_ATTACK', title: 'Sybil Attack Detected', symptom: 'WARN: 80% of peers returning invalid headers. Consensus divergent.', rootCause: 'Network Partition', severity: 'HIGH', decayRate: 1.2 },
        { type: 'DUST_STORM', title: 'Dust Attack', symptom: 'Mempool spiked to 300MB. Minimum relay fee increased to 20 sat/vB.', rootCause: 'Spam Attack', severity: 'MEDIUM', decayRate: 0.6 },
        { type: 'PRIVACY_LEAK', title: 'Address Reuse', symptom: 'ALERT: Change output correlated with KYC inputs. Privacy score dropping.', rootCause: 'Wallet Misconfiguration', severity: 'HIGH', decayRate: 0.9 },
    ],
    [PathId.WALLET_MASTERY]: [
        { type: 'KEY_LEAK', title: 'Entropy Failure', symptom: 'CRITICAL: PRNG weakness detected in signing module.', rootCause: 'Weak Randomness', severity: 'CRITICAL', decayRate: 1.8 },
        { type: 'PHISHING', title: 'Clipboard Hijack', symptom: 'WARN: Destination address mismatch detected during signing.', rootCause: 'Malware', severity: 'HIGH', decayRate: 1.0 },
        { type: 'BACKUP_ROT', title: 'Bit Rot', symptom: 'ERROR: Checksum failure on mnemonic shard #2.', rootCause: 'Data Corruption', severity: 'MEDIUM', decayRate: 0.5 },
    ]
};

const DEFAULT_SCENARIOS = SCENARIOS[PathId.LIGHTNING_OPERATOR];

export const AdversarialStressTest: React.FC<StressTestProps> = ({ onComplete, onExit, pathId = PathId.LIGHTNING_OPERATOR }) => {
  const [phase, setPhase] = useState<'BRIEFING' | 'RUNNING' | 'FAILED' | 'SUCCESS'>('BRIEFING');
  const [uptime, setUptime] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds survival
  const [events, setEvents] = useState<StressEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(['> System initialized. Monitoring daemon active...']);
  
  const tickRef = useRef<number | null>(null);
  const scenarios = SCENARIOS[pathId] || DEFAULT_SCENARIOS;

  // --- ENGINE LOGIC ---

  const addLog = (msg: string) => {
    setLogs(prev => [`> ${new Date().toLocaleTimeString().split(' ')[0]} ${msg}`, ...prev.slice(0, 19)]);
  };

  const spawnEvent = () => {
    // 30% chance to spawn event per tick if less than 4 active events
    const activeCount = events.filter(e => !e.resolved).length;
    if (activeCount < 4 && Math.random() > 0.7) {
      const template = scenarios[Math.floor(Math.random() * scenarios.length)];
      const newEvent: StressEvent = {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        resolved: false,
      };
      setEvents(prev => [newEvent, ...prev]);
      addLog(newEvent.symptom);
    }
  };

  const checkConditions = () => {
    if (uptime <= 0) {
      setPhase('FAILED');
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    if (timeLeft <= 0) {
      setPhase('SUCCESS');
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
  };

  const processDecay = () => {
    let decay = 0;
    events.forEach(e => {
      if (!e.resolved) decay += e.decayRate;
    });
    // Natural jitter
    if (Math.random() > 0.5) decay += 0.1;
    
    setUptime(prev => Math.max(0, prev - decay));
  };

  useEffect(() => {
    if (phase === 'RUNNING') {
      tickRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
        spawnEvent();
        processDecay();
        checkConditions();
      }, 1000);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [phase, uptime, timeLeft, events]);

  // --- ACTIONS ---

  const handleAction = (actionType: string) => {
    if (!selectedEventId) return;

    const event = events.find(e => e.id === selectedEventId);
    if (!event || event.resolved) return;

    // Simplified success logic for demo purposes
    // In a full implementation, this would match actionType vs event.type
    // Here we simulate competence by ensuring user clicks reasonable buttons
    
    // Always fail "WAIT" unless it's a specific low severity event
    if (actionType === 'WAIT' && event.severity !== 'LOW') {
        addLog(`FAILURE: Waiting is not an option for ${event.type}`);
        setUptime(prev => Math.max(0, prev - 10));
        return;
    }

    const success = Math.random() > 0.2; // 80% success rate for correct actions

    if (success) {
      setEvents(prev => prev.map(e => e.id === selectedEventId ? { ...e, resolved: true } : e));
      addLog(`SUCCESS: Threat mitigated.`);
      setUptime(prev => Math.min(100, prev + 5)); 
      setSelectedEventId(null);
    } else {
      addLog(`FAILURE: Action failed execution. Retry.`);
      setUptime(prev => Math.max(0, prev - 5)); 
    }
  };

  // --- RENDER HELPERS ---

  const getSeverityColor = (sev: StressEventSeverity) => {
    switch(sev) {
      case 'CRITICAL': return 'text-error animate-pulse';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-blue-400';
    }
  };

  const activeEvent = events.find(e => e.id === selectedEventId);

  // --- VIEWS ---

  if (phase === 'BRIEFING') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#050505] text-center p-8 animate-in zoom-in duration-300">
        <div className="max-w-2xl border border-red-900/50 bg-red-950/10 p-12 rounded-3xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(220,38,38,0.05)_10px,rgba(220,38,38,0.05)_20px)]"></div>
           <div className="relative z-10">
               <span className="material-symbols-outlined text-6xl text-error mb-6">warning</span>
               <h1 className="text-4xl font-bold text-white font-display uppercase tracking-widest mb-4">Adversarial Mode</h1>
               <p className="text-lg text-red-200/80 mb-8 leading-relaxed">
                   <strong>{pathId.replace('_', ' ')}: FINAL EXAM</strong>
                   <br/><br/>
                   This is not a drill. You are about to enter a high-stress simulation.
                   <br/><br/>
                   Maintain <strong>System Uptime > 0%</strong> for 60 seconds.
                   <br/>
                   Cascading failures are enabled. No hints.
               </p>
               <div className="flex gap-4 justify-center">
                   <Button variant="ghost" onClick={onExit}>Retreat</Button>
                   <Button variant="danger" size="lg" icon="emergency" onClick={() => setPhase('RUNNING')}>
                       Start Stress Test
                   </Button>
               </div>
           </div>
        </div>
      </div>
    );
  }

  if (phase === 'FAILED') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-center p-8">
            <h1 className="text-6xl font-bold text-error font-mono mb-4">SYSTEM OFFLINE</h1>
            <p className="text-text-muted mb-8">Uptime reached 0%. Competence unverified.</p>
            <div className="bg-surface-dark p-6 rounded-xl border border-white/10 w-full max-w-md text-left font-mono text-xs mb-8">
                 {events.filter(e => !e.resolved).map(e => (
                     <div key={e.id} className="text-error mb-2">
                         [FATAL] Unresolved: {e.title} ({e.rootCause})
                     </div>
                 ))}
            </div>
            <div className="flex gap-4">
                 <Button variant="secondary" onClick={onExit}>Exit</Button>
                 <Button variant="primary" onClick={() => { setUptime(100); setTimeLeft(60); setEvents([]); setPhase('BRIEFING'); }}>Retry Simulation</Button>
            </div>
        </div>
      );
  }

  if (phase === 'SUCCESS') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-[#0D0F12] text-center p-8">
             <div className="size-24 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mb-6">
                 <span className="material-symbols-outlined text-5xl text-success">verified</span>
             </div>
             <h1 className="text-4xl font-bold text-white font-display mb-2">Survival Confirmed</h1>
             <p className="text-text-muted mb-8">System stabilized under pressure. Mastery Verified.</p>
             <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                 <div className="bg-surface-dark p-4 rounded-xl border border-white/10">
                     <div className="text-xs text-text-muted uppercase">Final Uptime</div>
                     <div className="text-2xl font-bold text-white font-mono">{Math.round(uptime)}%</div>
                 </div>
                 <div className="bg-surface-dark p-4 rounded-xl border border-white/10">
                     <div className="text-xs text-text-muted uppercase">Threats Neutralized</div>
                     <div className="text-2xl font-bold text-success font-mono">{events.filter(e => e.resolved).length}</div>
                 </div>
             </div>
             <Button variant="primary" onClick={() => onComplete(true, uptime)}>Generate Proof</Button>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white font-mono overflow-hidden">
      
      {/* Top Bar: Metrics */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#050505]">
          <div className="flex items-center gap-4">
              <span className="text-error font-bold uppercase tracking-widest animate-pulse">Live Incident</span>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="text-sm text-text-muted">T-Minus: <span className="text-white font-bold">{timeLeft}s</span></div>
          </div>
          <div className="flex items-center gap-4">
              <span className="text-xs text-text-muted uppercase">Network Uptime</span>
              <div className="w-48 h-4 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className={`h-full transition-all duration-300 ${uptime > 60 ? 'bg-success' : uptime > 30 ? 'bg-warning' : 'bg-error'}`} 
                    style={{ width: `${uptime}%` }}
                  ></div>
              </div>
              <span className={`font-bold ${uptime < 30 ? 'text-error' : 'text-white'}`}>{Math.round(uptime)}%</span>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Active Threats */}
          <div className="w-1/3 border-r border-white/10 bg-[#0A0A0A] flex flex-col">
              <div className="p-3 border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-text-muted">
                  Active Signals ({events.filter(e => !e.resolved).length})
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {events.filter(e => !e.resolved).length === 0 && (
                      <div className="p-4 text-center text-text-muted text-xs italic opacity-50">
                          No active anomalies detected.
                      </div>
                  )}
                  {events.filter(e => !e.resolved).map(e => (
                      <div 
                        key={e.id}
                        onClick={() => setSelectedEventId(e.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedEventId === e.id 
                                ? 'bg-white/10 border-white/30' 
                                : 'bg-black border-white/10 hover:border-white/20'
                        }`}
                      >
                          <div className="flex justify-between items-start mb-1">
                              <span className={`text-[10px] font-bold border px-1.5 rounded ${getSeverityColor(e.severity)} border-current`}>
                                  {e.severity}
                              </span>
                              <span className="text-[10px] text-text-muted">{e.timestamp}</span>
                          </div>
                          <h4 className="font-bold text-sm mb-1">{e.title}</h4>
                          <p className="text-[10px] text-text-muted leading-tight">{e.symptom}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* Center Panel: Visualization */}
          <div className="flex-1 flex flex-col relative bg-black">
              {/* Fake Network Graph Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 border border-white/20 rounded-full flex items-center justify-center">
                      <div className="size-48 border border-white/20 rounded-full flex items-center justify-center">
                          <div className="size-32 border border-white/20 rounded-full"></div>
                      </div>
                  </div>
              </div>

              {/* Central Status Node */}
              <div className="flex-1 flex items-center justify-center z-10">
                   <div className={`size-32 rounded-full border-4 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 ${
                       activeEvent ? 'border-red-500 bg-red-900/20 shadow-red-900/40' : 'border-blue-500 bg-blue-900/10'
                   }`}>
                       <span className="material-symbols-outlined text-4xl mb-1 text-white">
                           {activeEvent ? 'warning' : 'dns'}
                       </span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                           {activeEvent ? 'ALERT' : 'ONLINE'}
                       </span>
                   </div>
              </div>

              {/* Logs */}
              <div className="h-1/3 border-t border-white/10 bg-[#050505] p-4 font-mono text-[10px] overflow-y-auto">
                  {logs.map((log, i) => (
                      <div key={i} className={`mb-1 ${log.includes('FATAL') || log.includes('ERROR') ? 'text-error' : log.includes('WARN') ? 'text-warning' : log.includes('SUCCESS') ? 'text-success' : 'text-text-muted'}`}>
                          {log}
                      </div>
                  ))}
              </div>
          </div>

      </div>

      {/* Bottom Panel: Actions */}
      <div className="h-20 bg-[#0D0F12] border-t border-white/10 p-2 flex items-center gap-2 overflow-x-auto">
          {!activeEvent ? (
              <div className="w-full text-center text-xs text-text-muted uppercase tracking-wider">
                  Select an active signal to view response protocols
              </div>
          ) : (
             <>
                <div className="h-full px-4 flex items-center justify-center bg-white/5 border-r border-white/5 mr-2 shrink-0">
                    <span className="text-xs font-bold text-white">{activeEvent.title}</span>
                </div>
                {/* Generic Action Buttons that map to different successes based on logic */}
                <Button size="sm" variant="secondary" onClick={() => handleAction('WAIT')}>Wait / Monitor</Button>
                <Button size="sm" variant="secondary" onClick={() => handleAction('RESTART_SERVICE')}>Restart Svc</Button>
                
                <div className="w-px h-8 bg-white/10 mx-2"></div>

                <Button size="sm" variant="primary" onClick={() => handleAction('BUMP_FEE')}>Bump Fee (CPFP)</Button>
                <Button size="sm" variant="primary" onClick={() => handleAction('LIMIT_GOSSIP')}>Filter Spam</Button>
                
                <div className="w-px h-8 bg-white/10 mx-2"></div>
                
                <Button size="sm" variant="danger" onClick={() => handleAction('FORCE_CLOSE')}>Force Close</Button>
                <Button size="sm" variant="danger" onClick={() => handleAction('JUSTICE_TX')}>Broadcast Justice</Button>
             </>
          )}
      </div>

    </div>
  );
};