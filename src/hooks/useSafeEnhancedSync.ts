/**
 * Safe Enhanced Sync Hook
 * Provides enhanced sync features with fallbacks to existing functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { EnhancedSyncIntegration } from '@/services/core/EnhancedSyncIntegration';
import { useDog } from '@/contexts/DogContext';
import { useAuth } from '@/contexts/AuthContext';

interface SafeSyncStatus {
  enhanced: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  queuedOperations: number;
  hasConflicts: boolean;
  lastSyncTime: Date | null;
  error?: string;
}

export const useSafeEnhancedSync = () => {
  const { user } = useAuth();
  const { currentDog } = useDog();
  
  const [status, setStatus] = useState<SafeSyncStatus>({
    enhanced: false,
    isOnline: navigator.onLine,
    isSyncing: false,
    queuedOperations: 0,
    hasConflicts: false,
    lastSyncTime: null,
  });

  /**
   * Initialize enhanced sync if available
   */
  useEffect(() => {
    const initializeSync = async () => {
      try {
        await EnhancedSyncIntegration.initialize();
        setStatus(prev => ({ ...prev, enhanced: true }));
      } catch (error) {
        console.warn('Enhanced sync initialization failed, using fallback:', error);
        setStatus(prev => ({ ...prev, enhanced: false }));
      }
    };

    initializeSync();

    // Update online status
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      EnhancedSyncIntegration.cleanup();
    };
  }, []);

  /**
   * Update status periodically if enhanced sync is available
   */
  useEffect(() => {
    if (!status.enhanced) return;

    const updateStatus = () => {
      const syncStatus = EnhancedSyncIntegration.getStatus();
      
      if (syncStatus.initialized) {
        setStatus(prev => ({
          ...prev,
          queuedOperations: syncStatus.queue?.pendingItems || 0,
          hasConflicts: (syncStatus.conflicts?.pending || 0) > 0,
          isSyncing: syncStatus.hasSyncInProgress || false,
        }));
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [status.enhanced]);

  /**
   * Queue operation safely
   */
  const queueOperation = useCallback((
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    table: string,
    data: any,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ) => {
    if (!status.enhanced) {
      console.log('Enhanced sync not available, operation will proceed normally');
      return null;
    }

    return EnhancedSyncIntegration.queueOperation(type, table, data, {
      priority,
      userId: user?.id,
      dogId: currentDog?.id,
      conflictResolution: 'merge'
    });
  }, [status.enhanced, user?.id, currentDog?.id]);

  /**
   * Force sync if available
   */
  const forceSync = useCallback(async () => {
    if (!status.enhanced || status.isSyncing) return { success: false };

    setStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      const result = await EnhancedSyncIntegration.processQueue();
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        error: undefined,
      }));
      
      return { success: true, result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync error';
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: errorMessage,
      }));
      
      return { success: false, error: errorMessage };
    }
  }, [status.enhanced, status.isSyncing]);

  /**
   * Get sync statistics
   */
  const getSyncStats = useCallback(() => {
    if (!status.enhanced) {
      return { enhanced: false };
    }

    return EnhancedSyncIntegration.getStatus();
  }, [status.enhanced]);

  return {
    status,
    queueOperation,
    forceSync,
    getSyncStats,
    isEnhanced: status.enhanced,
  };
};