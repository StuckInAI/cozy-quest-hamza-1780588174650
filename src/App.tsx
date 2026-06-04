import { Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import AppShell from '@/components/layout/AppShell';
import Home from '@/pages/Home';
import Quests from '@/pages/Quests';
import Projects from '@/pages/Projects';
import Habits from '@/pages/Habits';
import World from '@/pages/World';
import Shop from '@/pages/Shop';
import Achievements from '@/pages/Achievements';
import Character from '@/pages/Character';
import Analytics from '@/pages/Analytics';
import RewardToast from '@/components/feedback/RewardToast';

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/world" element={<World />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/character" element={<Character />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </AppShell>
      <RewardToast />
    </AppProvider>
  );
}
