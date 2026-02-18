import { useEffect, useState } from 'react';
import useClimberStore from './stores/useClimberStore';
import useSessionStore from './stores/useSessionStore';
import useAchievementStore from './stores/useAchievementStore';
import TavernBackground from './components/layout/TavernBackground';
import NavBar from './components/layout/NavBar';
import Dashboard from './components/Dashboard';

export default function App() {
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState('board');

  useEffect(() => {
    async function hydrate() {
      await useClimberStore.getState().hydrate();
      await useSessionStore.getState().loadSessions();
      await useAchievementStore.getState().hydrate();
      setReady(true);
    }
    hydrate();
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tavern-bg">
        <p className="font-pixel text-tavern-light text-sm animate-pulse">
          The innkeeper is preparing your table...
        </p>
      </div>
    );
  }

  return (
    <>
      <TavernBackground />
      <div className="relative min-h-screen pb-[72px]" style={{ zIndex: 1 }}>
        <Dashboard />
      </div>
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
