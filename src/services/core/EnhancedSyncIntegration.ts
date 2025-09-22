/**
 * Enhanced Sync Integration Service
 * Safely integrates enhanced sync features without affecting existing functionality
 */

import { OfflineOperationQueue } from './OfflineOperationQueue';
import { ConflictResolution } from './ConflictResolution';
import { SyncCoordinator } from './SyncCoordinator';
import { SafeSubscriptionService } from './SafeSubscriptionService';

export class EnhancedSyncIntegration {
  private static initialized = false;
  
  /**
   * Initialize enhanced sync systems safely
   */
  static async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('🔄 Enhanced sync already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing Enhanced Sync Systems...');
      
      // Initialize offline operation queue
      OfflineOperationQueue.initializeEventListeners();
      
      // Initialize sync coordinator
      SyncCoordinator.initialize();
      
      // Safe subscription service is ready for use
      console.log('📧 Safe subscription service available');
      
      this.initialized = true;
      console.log('✅ Enhanced sync systems initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize enhanced sync:', error);
      throw error;
    }
  }

  /**
   * Check if enhanced sync is available
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get comprehensive sync status
   */
  static getStatus() {
    if (!this.initialized) {
      return {
        initialized: false,
        error: 'Enhanced sync not initialized'
      };
    }

    return {
      initialized: true,
      queue: OfflineOperationQueue.getStats(),
      coordinator: SyncCoordinator.getStats(),
      conflicts: {
        pending: ConflictResolution.getPendingConflicts().length
      },
      isOnline: navigator.onLine,
      hasSyncInProgress: SyncCoordinator.hasSyncInProgress()
    };
  }

  /**
   * Safe queue operation wrapper
   */
  static queueOperation(
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    table: string,
    data: any,
    options: {
      priority?: 'low' | 'normal' | 'high';
      conflictResolution?: 'client-wins' | 'server-wins' | 'merge';
      userId?: string;
      dogId?: string;
    } = {}
  ): string | null {
    if (!this.initialized) {
      console.warn('⚠️ Enhanced sync not initialized, skipping queue operation');
      return null;
    }

    const { priority = 'normal', ...metadata } = options;

    return OfflineOperationQueue.enqueue({
      type,
      table,
      data,
      priority,
      maxRetries: 5,
      metadata
    });
  }

  /**
   * Force process offline queue
   */
  static async processQueue() {
    if (!this.initialized) {
      console.warn('⚠️ Enhanced sync not initialized');
      return { processed: 0, failed: 0, remaining: 0 };
    }

    return await OfflineOperationQueue.processQueue();
  }

  /**
   * Cleanup resources
   */
  static cleanup(): void {
    if (this.initialized) {
      SyncCoordinator.releaseAllLocks();
      console.log('🧹 Enhanced sync cleanup completed');
    }
  }
}