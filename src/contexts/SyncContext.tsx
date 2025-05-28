
import React, { createContext, useContext, useEffect } from 'react';
import { useDog } from '@/contexts/DogContext';
import { useActivitySync } from '@/hooks/useActivitySync';
import { useActivityState } from './ActivityStateContext';

interface SyncContextType {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncToSupabase: () => Promise<any>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentDog } = useDog();
  const { discoveredActivities, userActivities } = useActivityState();
  const { isSyncing, lastSyncTime, performSync } = useActivitySync();

  // Auto-sync on app load and when activities change
  useEffect(() => {
    const performAutoSync = async () => {
      if (!currentDog) return;
      
      console.log('Performing auto-sync on app load...');
      await performSync(discoveredActivities, userActivities, currentDog.id);
    };

    // Debounce the auto-sync to avoid excessive calls
    const timeoutId = setTimeout(performAutoSync, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentDog?.id]); // Only run when current dog changes

  // Manual sync function
  const manualSync = async () => {
    if (!currentDog) return;
    console.log('Performing manual sync...');
    return await performSync(discoveredActivities, userActivities, currentDog.id);
  };

  const value: SyncContextType = {
    isSyncing,
    lastSyncTime,
    syncToSupabase: manualSync
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};
