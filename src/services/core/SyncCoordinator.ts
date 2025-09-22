/**
 * Distributed Sync Coordination Service
 * Prevents multiple sync processes from conflicting and provides coordination
 */

interface SyncLock {
  id: string;
  operation: string;
  holder: string;
  acquired: number;
  expires: number;
  metadata?: Record<string, any>;
}

interface SyncOperation {
  id: string;
  type: 'sync' | 'migration' | 'cleanup';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  progress?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export class SyncCoordinator {
  private static readonly LOCK_PREFIX = 'sync_lock_';
  private static readonly OPERATION_PREFIX = 'sync_op_';
  private static readonly DEFAULT_LOCK_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly HEARTBEAT_INTERVAL = 30 * 1000; // 30 seconds
  
  private static sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  private static activeLocks = new Set<string>();
  private static heartbeatInterval?: number;

  /**
   * Initialize sync coordinator with heartbeat
   */
  static initialize(): void {
    this.startHeartbeat();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.releaseAllLocks();
      this.stopHeartbeat();
    });

    // Cleanup expired locks periodically
    setInterval(() => {
      this.cleanupExpiredLocks();
    }, 60 * 1000); // Every minute
  }

  /**
   * Acquire a distributed lock for sync operations
   */
  static async acquireLock(
    operation: string, 
    ttl: number = this.DEFAULT_LOCK_TTL,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const lockKey = `${this.LOCK_PREFIX}${operation}`;
    
    try {
      // Check if lock already exists and is valid
      const existingLock = this.getLock(lockKey);
      if (existingLock && existingLock.expires > Date.now()) {
        if (existingLock.holder === this.sessionId) {
          // We already hold this lock - extend it
          this.extendLock(operation, ttl);
          return true;
        } else {
          console.log(`🔒 Lock held by another session: ${operation}`);
          return false;
        }
      }

      // Acquire new lock
      const lock: SyncLock = {
        id: `${operation}_${Date.now()}`,
        operation,
        holder: this.sessionId,
        acquired: Date.now(),
        expires: Date.now() + ttl,
        metadata,
      };

      localStorage.setItem(lockKey, JSON.stringify(lock));
      this.activeLocks.add(operation);
      
      console.log(`🔐 Acquired sync lock: ${operation}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to acquire lock for ${operation}:`, error);
      return false;
    }
  }

  /**
   * Release a sync lock
   */
  static releaseLock(operation: string): void {
    const lockKey = `${this.LOCK_PREFIX}${operation}`;
    
    try {
      const lock = this.getLock(lockKey);
      if (lock && lock.holder === this.sessionId) {
        localStorage.removeItem(lockKey);
        this.activeLocks.delete(operation);
        console.log(`🔓 Released sync lock: ${operation}`);
      }
    } catch (error) {
      console.error(`❌ Failed to release lock for ${operation}:`, error);
    }
  }

  /**
   * Extend lock expiration
   */
  static extendLock(operation: string, additionalTtl: number = this.DEFAULT_LOCK_TTL): boolean {
    const lockKey = `${this.LOCK_PREFIX}${operation}`;
    
    try {
      const lock = this.getLock(lockKey);
      if (lock && lock.holder === this.sessionId) {
        lock.expires = Math.max(lock.expires, Date.now()) + additionalTtl;
        localStorage.setItem(lockKey, JSON.stringify(lock));
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to extend lock for ${operation}:`, error);
      return false;
    }
  }

  /**
   * Check if operation is locked by another session
   */
  static isLocked(operation: string): boolean {
    const lockKey = `${this.LOCK_PREFIX}${operation}`;
    const lock = this.getLock(lockKey);
    
    return lock ? 
      (lock.expires > Date.now() && lock.holder !== this.sessionId) : 
      false;
  }

  /**
   * Get lock information
   */
  private static getLock(lockKey: string): SyncLock | null {
    try {
      const stored = localStorage.getItem(lockKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Execute operation with automatic lock management
   */
  static async withLock<T>(
    operation: string,
    fn: () => Promise<T>,
    ttl?: number,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; result?: T; error?: string }> {
    const acquired = await this.acquireLock(operation, ttl, metadata);
    
    if (!acquired) {
      return {
        success: false,
        error: `Could not acquire lock for operation: ${operation}`,
      };
    }

    const operationId = this.registerOperation(operation, 'sync', metadata);
    
    try {
      this.updateOperationStatus(operationId, 'running');
      const result = await fn();
      
      this.updateOperationStatus(operationId, 'completed');
      this.releaseLock(operation);
      
      return { success: true, result };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.updateOperationStatus(operationId, 'failed', errorMessage);
      this.releaseLock(operation);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Register a sync operation
   */
  static registerOperation(
    type: string,
    operationType: SyncOperation['type'],
    metadata?: Record<string, any>
  ): string {
    const operation: SyncOperation = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: operationType,
      status: 'pending',
      startTime: Date.now(),
      metadata,
    };

    const operationKey = `${this.OPERATION_PREFIX}${operation.id}`;
    localStorage.setItem(operationKey, JSON.stringify(operation));
    
    return operation.id;
  }

  /**
   * Update operation status
   */
  static updateOperationStatus(
    operationId: string,
    status: SyncOperation['status'],
    error?: string,
    progress?: number
  ): void {
    const operationKey = `${this.OPERATION_PREFIX}${operationId}`;
    
    try {
      const stored = localStorage.getItem(operationKey);
      if (stored) {
        const operation: SyncOperation = JSON.parse(stored);
        operation.status = status;
        operation.progress = progress;
        
        if (status === 'completed' || status === 'failed') {
          operation.endTime = Date.now();
        }
        
        if (error) {
          operation.error = error;
        }
        
        localStorage.setItem(operationKey, JSON.stringify(operation));
      }
    } catch (err) {
      console.error('Error updating operation status:', err);
    }
  }

  /**
   * Get all active operations
   */
  static getActiveOperations(): SyncOperation[] {
    const operations: SyncOperation[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.OPERATION_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const operation: SyncOperation = JSON.parse(stored);
            if (operation.status === 'running' || operation.status === 'pending') {
              operations.push(operation);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error getting active operations:', error);
    }
    
    return operations;
  }

  /**
   * Check if any sync operations are currently running
   */
  static hasSyncInProgress(): boolean {
    return this.getActiveOperations().length > 0;
  }

  /**
   * Wait for all active operations to complete
   */
  static async waitForSyncCompletion(timeoutMs: number = 30000): Promise<boolean> {
    const startTime = Date.now();
    
    while (this.hasSyncInProgress() && (Date.now() - startTime) < timeoutMs) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return !this.hasSyncInProgress();
  }

  /**
   * Start heartbeat to keep locks alive
   */
  private static startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      for (const operation of this.activeLocks) {
        this.extendLock(operation, this.HEARTBEAT_INTERVAL * 2);
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  /**
   * Stop heartbeat
   */
  private static stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  /**
   * Release all locks held by this session
   */
  static releaseAllLocks(): void {
    const locksToRelease = Array.from(this.activeLocks);
    for (const operation of locksToRelease) {
      this.releaseLock(operation);
    }
  }

  /**
   * Cleanup expired locks from other sessions
   */
  private static cleanupExpiredLocks(): void {
    try {
      const now = Date.now();
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.LOCK_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const lock: SyncLock = JSON.parse(stored);
            if (lock.expires < now) {
              keysToRemove.push(key);
            }
          }
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🧹 Cleaned up expired lock: ${key}`);
      });
      
    } catch (error) {
      console.error('Error cleaning up expired locks:', error);
    }
  }

  /**
   * Get sync coordination statistics
   */
  static getStats() {
    const now = Date.now();
    let activeLockCount = 0;
    let expiredLockCount = 0;
    const lockHolders = new Set<string>();
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.LOCK_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const lock: SyncLock = JSON.parse(stored);
            lockHolders.add(lock.holder);
            
            if (lock.expires > now) {
              activeLockCount++;
            } else {
              expiredLockCount++;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error getting sync stats:', error);
    }
    
    return {
      sessionId: this.sessionId,
      activeLocks: activeLockCount,
      expiredLocks: expiredLockCount,
      uniqueHolders: lockHolders.size,
      activeOperations: this.getActiveOperations().length,
      myLocks: this.activeLocks.size,
    };
  }
}