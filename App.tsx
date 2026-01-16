import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { Labs } from './views/Labs';
import { Rank } from './views/Rank';
import { UTXOLab } from './simulations/UTXOLab';
import { LightningSandbox } from './simulations/LightningSandbox';
import { PhishingDefense } from './simulations/PhishingDefense';
import { AdversarialStressTest } from './simulations/AdversarialStressTest';
import { StandardSimulation } from './views/StandardSimulation';
import { BuilderSimulation } from './views/BuilderSimulation'; // New import
import { Audit } from './views/Audit';
import { Profile } from './views/Profile';
import { DailyBonusModal } from './components/DailyBonusModal';
import { View, PathId, UserState } from './types';
import { INITIAL_USER_STATE, PATHS } from './constants';
import { MODULE_CONTENT } from './data/moduleContent';
import { BUILDER_CONTENT } from './data/builderContent'; // New import

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.ONBOARDING);
  const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  
  // Daily Bonus State
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [hasClaimedDaily, setHasClaimedDaily] = useState(false);

  // Trigger daily bonus when entering dashboard for the first time
  useEffect(() => {
    if (view === View.DASHBOARD && !hasClaimedDaily && !showDailyBonus) {
        // Small delay for better UX
        const timer = setTimeout(() => {
            setShowDailyBonus(true);
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [view, hasClaimedDaily, showDailyBonus]);

  const handleOnboardingComplete = (path: PathId) => {
    setUserState(prev => ({ ...prev, currentPath: path }));
    setView(View.DASHBOARD);
  };

  const handlePathChange = (path: PathId) => {
    setUserState(prev => ({ ...prev, currentPath: path }));
  };

  const handleModuleSelect = (moduleId: string) => {
    setActiveSimulation(moduleId);
    
    // Check if this module has a Builder content definition
    if (BUILDER_CONTENT[moduleId]) {
        setView(View.BUILDER);
    } else {
        setView(View.SIMULATION);
    }
  };

  const handleSimulationComplete = () => {
    if (!activeSimulation) return;

    // Mark complete
    const updatedCompleted = [...userState.completedModules];
    if (!updatedCompleted.includes(activeSimulation)) {
        updatedCompleted.push(activeSimulation);
    }
    
    setUserState(prev => ({ ...prev, completedModules: updatedCompleted }));

    // Check Path Completion Logic
    const currentPathData = PATHS.find(p => p.id === userState.currentPath);
    if (currentPathData) {
        const allModulesIds = currentPathData.modules.map(m => m.id);
        const isPathComplete = allModulesIds.every(id => updatedCompleted.includes(id));
        const wasAlreadyComplete = allModulesIds.every(id => userState.completedModules.includes(id));
        
        if (isPathComplete && !wasAlreadyComplete) {
            setView(View.STRESS_TEST);
            return;
        }
    }

    setView(View.AUDIT);
  };

  const handleClaimDaily = (amount: number) => {
      setUserState(prev => ({
          ...prev,
          reputation: prev.reputation + amount,
          streak: prev.streak + 1
      }));
      setHasClaimedDaily(true);
      setShowDailyBonus(false);
  };

  const renderSimulation = () => {
    if (!activeSimulation) return null;

    // Custom Simulators
    if (activeSimulation === '1.4' && userState.currentPath === PathId.SOVEREIGN) return <StandardSimulation content={MODULE_CONTENT['1.4']} onComplete={handleSimulationComplete} onExit={() => setView(View.DASHBOARD)} />;
    if (activeSimulation === '4.3') return <LightningSandbox onComplete={handleSimulationComplete} />;
    if (activeSimulation === '6.3') return <PhishingDefense onComplete={handleSimulationComplete} />;

    // Standard Engine
    const content = MODULE_CONTENT[activeSimulation];
    if (content) {
        return <StandardSimulation content={content} onComplete={handleSimulationComplete} onExit={() => setView(View.DASHBOARD)} />;
    }

    // Fallback
    return (
        <div className="flex flex-col items-center justify-center h-full bg-background-dark p-6 text-center">
            <span className="material-symbols-outlined text-6xl text-text-muted mb-4">construction</span>
            <h2 className="text-xl font-bold text-white mb-2">Under Construction</h2>
            <p className="text-text-muted mb-6">This simulation module is being engineered. Check back in the next block.</p>
            <div className="flex gap-4">
                <button onClick={() => setView(View.DASHBOARD)} className="text-text-muted font-bold hover:text-white">Return</button>
                <button onClick={handleSimulationComplete} className="text-primary font-bold hover:underline">[DEBUG] Complete Module</button>
            </div>
        </div>
    );
  };

  return (
    <Layout currentView={view} onNavigate={setView}>
      {view === View.ONBOARDING && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      {view === View.DASHBOARD && (
        <Dashboard 
          currentPath={userState.currentPath || PathId.SOVEREIGN} 
          onSelectModule={handleModuleSelect} 
          onViewProfile={() => setView(View.PROFILE)}
          onEnterStressTest={() => setView(View.STRESS_TEST)}
          onPathChange={handlePathChange}
          completedModules={userState.completedModules}
        />
      )}

      {view === View.LABS && (
        <Labs onSelectModule={handleModuleSelect} />
      )}

      {view === View.RANK && (
        <Rank />
      )}

      {view === View.SIMULATION && renderSimulation()}

      {view === View.BUILDER && activeSimulation && BUILDER_CONTENT[activeSimulation] && (
        <BuilderSimulation 
            content={BUILDER_CONTENT[activeSimulation]} 
            onComplete={handleSimulationComplete} 
            onExit={() => setView(View.DASHBOARD)} 
        />
      )}

      {view === View.STRESS_TEST && (
        <AdversarialStressTest 
            pathId={userState.currentPath || PathId.SOVEREIGN}
            onComplete={(success, score) => {
                setView(View.AUDIT);
            }} 
            onExit={() => setView(View.DASHBOARD)} 
        />
      )}

      {view === View.AUDIT && (
        <Audit onReturn={() => setView(View.DASHBOARD)} />
      )}

      {view === View.PROFILE && (
        <Profile />
      )}

      {showDailyBonus && (
          <DailyBonusModal 
            streak={userState.streak} 
            onClaim={handleClaimDaily} 
            onClose={() => setShowDailyBonus(false)} 
          />
      )}
    </Layout>
  );
};

export default App;