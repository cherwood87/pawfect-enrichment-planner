
import React, { createContext, useContext, useState } from 'react';
import { useDog } from '@/contexts/DogContext';
import { useActivityState } from './ActivityStateContext';
import { SyncService } from '@/services/core/SyncService';

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
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncToSupabase = async () => {
    if (!currentDog || isSyncing) return { success: false, error: 'No dog selected or sync in progress' };
    
    setIsSyncing(true);
    try {
      const result = await SyncService.performFullSync(
        discoveredActivities,
        userActivities,
        currentDog.id
      );
      
      if (result.success) {
        setLastSyncTime(new Date());
      }
      
      return result;
    } catch (error) {
      console.error('Sync failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        totalSynced: 0,
        details: {}
      };
    } finally {
      setIsSyncing(false);
    }
  };

  const value: SyncContextType = {
    isSyncing,
    lastSyncTime,
    syncToSupabase
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};
