import { createContext, useContext, type ReactNode } from 'react';
import { useAppState, type AppStateHook } from '@/hooks/useAppState';

const AppContext = createContext<AppStateHook | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const value = useAppState();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppStateHook {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
