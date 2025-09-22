/**
 * Enhanced Sync Hook
 * Integrates offline queue, conflict resolution, and sync coordination
 */

import { useState, useEffect, useCallback } from 'react';
import { OfflineOperationQueue, OperationQueueItem } from '@/services/core/OfflineOperationQueue';
import { ConflictResolution } from '@/services/core/ConflictResolution';
import { SyncCoordinator } from '@/services/core/SyncCoordinator';
import { useDog } from '@/contexts/DogContext';
import { useAuth } from '@/contexts/AuthContext';

interface SyncStatus {
  isSyncing: boolean;
  isOnline: boolean;
  hasConflicts: boolean;
  queuedOperations: number;
  lastSyncTime: Date | null;
  error?: string;
}

interface SyncOptions {
  autoSync?: boolean;
  conflictResolution?: 'merge' | 'client-wins' | 'server-wins';
  syncInterval?: number;
}

export const useEnhancedSync = (options: SyncOptions = {}) => {
  const { user } = useAuth();
  const { currentDog } = useDog();
  
  const {
    autoSync = true,
    conflictResolution = 'merge' as const,
    syncInterval = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [status, setStatus] = useState<SyncStatus>({
    isSyncing: false,
    isOnline: navigator.onLine,
    hasConflicts: false,
    queuedOperations: 0,
    lastSyncTime: null,
  });

  /**
   * Initialize enhanced sync system
   */
  useEffect(() => {
    // Initialize all sync systems
    SyncCoordinator.initialize();
    OfflineOperationQueue.initializeEventListeners();

    // Update online status
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Auto-sync setup
   */
  useEffect(() => {
    if (!autoSync || !user || !currentDog) return;

    const interval = setInterval(() => {
      if (navigator.onLine && !status.isSyncing) {
        performSync();
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [autoSync, user, currentDog, status.isSyncing, syncInterval]);

  /**
   * Update status from queue and conflicts
   */
  useEffect(() => {
    const updateStatus = () => {
      const queueStats = OfflineOperationQueue.getStats();
      const pendingConflicts = ConflictResolution.getPendingConflicts();
      
      setStatus(prev => ({
        ...prev,
        queuedOperations: queueStats.pendingItems,
        hasConflicts: pendingConflicts.length > 0,
      }));
    };

    // Update immediately and then every 30 seconds
    updateStatus();
    const interval = setInterval(updateStatus, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Perform coordinated sync
   */
  const performSync = useCallback(async () => {
    if (!user || !currentDog || status.isSyncing) return;

    const syncOperation = `full_sync_${user.id}_${currentDog.id}`;
    
    setStatus(prev => ({ ...prev, isSyncing: true, error: undefined }));

    try {
      const result = await SyncCoordinator.withLock(
        syncOperation,
        async () => {
          console.log('🔄 Starting enhanced sync...');
          
          // 1. Process queued operations first
          const queueResult = await OfflineOperationQueue.processQueue();
          console.log('📥 Queue processing result:', queueResult);

          // 2. Perform regular sync operations here
          // This would typically involve your existing sync logic
          // For now, we'll simulate it
          await new Promise(resolve => setTimeout(resolve, 1000));

          // 3. Handle any conflicts that arose during sync
          const conflicts = ConflictResolution.getPendingConflicts();
          for (const conflict of conflicts.slice(0, 5)) { // Process up to 5 conflicts
            try {
              const resolution = await ConflictResolution.resolveConflict(
                conflict,
                conflictResolution
              );
              
              if (resolution.resolved) {
                ConflictResolution.resolveManualConflict(conflict.id, resolution.data);
              }
            } catch (error) {
              console.error('Error resolving conflict:', error);
            }
          }

          return {
            queueProcessed: queueResult.processed,
            queueFailed: queueResult.failed,
            conflictsResolved: conflicts.length,
          };
        },
        5 * 60 * 1000, // 5 minute lock
        {
          userId: user.id,
          dogId: currentDog.id,
          type: 'enhanced_sync',
        }
      );

      if (result.success) {
        console.log('✅ Enhanced sync completed successfully:', result.result);
        setStatus(prev => ({
          ...prev,
          lastSyncTime: new Date(),
          error: undefined,
        }));
      } else {
        console.error('❌ Enhanced sync failed:', result.error);
        setStatus(prev => ({
          ...prev,
          error: result.error,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      console.error('💥 Enhanced sync error:', errorMessage);
      setStatus(prev => ({
        ...prev,
        error: errorMessage,
      }));
    } finally {
      setStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [user, currentDog, status.isSyncing, conflictResolution]);

  /**
   * Queue an operation for offline execution
   */
  const queueOperation = useCallback((
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    table: string,
    data: any,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ) => {
    if (!user || !currentDog) return null;

    return OfflineOperationQueue.enqueue({
      type,
      table,
      data,
      priority,
      maxRetries: 5,
      metadata: {
        userId: user.id,
        dogId: currentDog.id,
        conflictResolution,
      },
    });
  }, [user, currentDog, conflictResolution]);

  /**
   * Force sync execution
   */
  const forceSync = useCallback(async () => {
    if (status.isSyncing) return false;
    
    await performSync();
    return true;
  }, [status.isSyncing, performSync]);

  /**
   * Get detailed sync statistics
   */
  const getSyncStats = useCallback(() => {
    const queueStats = OfflineOperationQueue.getStats();
    const coordinatorStats = SyncCoordinator.getStats();
    const conflicts = ConflictResolution.getPendingConflicts();
    const failedOps = OfflineOperationQueue.getFailedOperations();

    return {
      queue: queueStats,
      coordinator: coordinatorStats,
      conflicts: {
        pending: conflicts.length,
        oldest: conflicts.length > 0 ? Math.min(...conflicts.map(c => c.storedAt)) : null,
      },
      failures: {
        count: failedOps.length,
        recent: failedOps.slice(-5),
      },
    };
  }, []);

  /**
   * Clear all sync data (use with caution)
   */
  const clearSyncData = useCallback(() => {
    OfflineOperationQueue.clearQueue();
    SyncCoordinator.releaseAllLocks();
    console.log('🧹 Cleared all sync data');
  }, []);

  return {
    status,
    performSync,
    forceSync,
    queueOperation,
    getSyncStats,
    clearSyncData,
    
    // Direct access to services for advanced usage
    queue: OfflineOperationQueue,
    conflicts: ConflictResolution,
    coordinator: SyncCoordinator,
  };
};