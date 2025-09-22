/**
 * Offline Operation Queue Service
 * Manages operations that need to be executed when online connectivity is restored
 */

export interface OperationQueueItem {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  priority: 'low' | 'normal' | 'high';
  metadata?: {
    dogId?: string;
    userId?: string;
    conflictResolution?: 'client-wins' | 'server-wins' | 'merge';
  };
}

interface QueueStats {
  totalItems: number;
  pendingItems: number;
  failedItems: number;
  lastProcessed: number | null;
}

export class OfflineOperationQueue {
  private static readonly STORAGE_KEY = 'offline_operation_queue';
  private static readonly MAX_QUEUE_SIZE = 1000;
  private static readonly RETRY_DELAYS = [1000, 2000, 5000, 10000, 30000]; // Progressive delays in ms

  private static isOnline(): boolean {
    return navigator.onLine;
  }

  private static generateId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add operation to queue
   */
  static enqueue(operation: Omit<OperationQueueItem, 'id' | 'timestamp' | 'retryCount'>): string {
    const queue = this.getQueue();
    
    // Enforce queue size limit
    if (queue.length >= this.MAX_QUEUE_SIZE) {
      // Remove oldest low priority items
      const filtered = queue
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            const priorityOrder = { high: 3, normal: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          return a.timestamp - b.timestamp;
        })
        .slice(0, this.MAX_QUEUE_SIZE - 1);
      
      this.saveQueue(filtered);
    }

    const item: OperationQueueItem = {
      ...operation,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: operation.maxRetries || 5,
    };

    const updatedQueue = [...this.getQueue(), item];
    this.saveQueue(updatedQueue);
    
    console.log(`📥 Queued ${operation.type} operation for ${operation.table}:`, item.id);
    
    // Try to process immediately if online
    if (this.isOnline()) {
      setTimeout(() => this.processQueue(), 100);
    }

    return item.id;
  }

  /**
   * Process all queued operations
   */
  static async processQueue(): Promise<{ processed: number; failed: number; remaining: number }> {
    if (!this.isOnline()) {
      console.log('📵 Offline - skipping queue processing');
      return { processed: 0, failed: 0, remaining: this.getQueue().length };
    }

    const queue = this.getQueue();
    if (queue.length === 0) {
      return { processed: 0, failed: 0, remaining: 0 };
    }

    console.log(`🔄 Processing ${queue.length} queued operations...`);
    
    let processed = 0;
    let failed = 0;
    const remaining: OperationQueueItem[] = [];

    // Sort by priority and timestamp
    const sortedQueue = queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.timestamp - b.timestamp;
    });

    for (const item of sortedQueue) {
      try {
        const success = await this.executeOperation(item);
        
        if (success) {
          processed++;
          console.log(`✅ Processed queued operation:`, item.id);
        } else {
          // Increment retry count
          item.retryCount++;
          
          if (item.retryCount >= item.maxRetries) {
            failed++;
            console.error(`❌ Failed queued operation after ${item.retryCount} attempts:`, item.id);
            
            // Store failed operations for manual review
            this.addToFailedOperations(item);
          } else {
            // Schedule for retry
            const delay = this.RETRY_DELAYS[Math.min(item.retryCount - 1, this.RETRY_DELAYS.length - 1)];
            console.log(`⏳ Retrying operation ${item.id} in ${delay}ms (attempt ${item.retryCount})`);
            
            setTimeout(() => {
              remaining.push(item);
            }, delay);
          }
        }
      } catch (error) {
        console.error(`💥 Error processing queued operation ${item.id}:`, error);
        item.retryCount++;
        
        if (item.retryCount < item.maxRetries) {
          remaining.push(item);
        } else {
          failed++;
          this.addToFailedOperations(item);
        }
      }
    }

    // Update queue with remaining items
    this.saveQueue(remaining);
    
    const result = { processed, failed, remaining: remaining.length };
    console.log(`📊 Queue processing complete:`, result);
    
    return result;
  }

  /**
   * Execute a single operation
   */
  private static async executeOperation(item: OperationQueueItem): Promise<boolean> {
    try {
      // Import SupabaseAdapter dynamically to avoid circular dependencies
      const { SupabaseAdapter } = await import('@/services/integration/SupabaseAdapter');
      
      switch (item.type) {
        case 'CREATE':
          if (item.table === 'scheduled_activities') {
            await SupabaseAdapter.createScheduledActivity(item.data);
          } else if (item.table === 'user_activities') {
            await SupabaseAdapter.createUserActivity(item.data);
          } else if (item.table === 'favourites') {
            // Handle favourites directly with supabase client for now
            const { supabase } = await import('@/integrations/supabase/client');
            const { error } = await supabase
              .from('favourites')
              .insert(item.data);
            if (error) throw error;
          }
          break;
          
        case 'UPDATE':
          if (item.table === 'scheduled_activities') {
            await SupabaseAdapter.updateScheduledActivity(item.data);
          } else if (item.table === 'user_activities') {
            // Handle user activity updates directly with supabase client
            const { supabase } = await import('@/integrations/supabase/client');
            const { error } = await supabase
              .from('user_activities')
              .update(item.data)
              .eq('id', item.data.id);
            if (error) throw error;
          }
          break;
          
        case 'DELETE':
          if (item.table === 'scheduled_activities') {
            await SupabaseAdapter.deleteScheduledActivity(item.data.id);
          } else if (item.table === 'user_activities') {
            // Handle user activity deletion directly with supabase client
            const { supabase } = await import('@/integrations/supabase/client');
            const { error } = await supabase
              .from('user_activities')
              .delete()
              .eq('id', item.data.id);
            if (error) throw error;
          } else if (item.table === 'favourites') {
            // Handle favourites deletion directly with supabase client
            const { supabase } = await import('@/integrations/supabase/client');
            const { error } = await supabase
              .from('favourites')
              .delete()
              .eq('id', item.data.id);
            if (error) throw error;
          }
          break;
          
        default:
          console.warn(`Unknown operation type: ${item.type}`);
          return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to execute operation ${item.id}:`, error);
      return false;
    }
  }

  /**
   * Get current queue
   */
  private static getQueue(): OperationQueueItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading operation queue:', error);
      return [];
    }
  }

  /**
   * Save queue to storage
   */
  private static saveQueue(queue: OperationQueueItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error saving operation queue:', error);
    }
  }

  /**
   * Add failed operation to separate storage for review
   */
  private static addToFailedOperations(item: OperationQueueItem): void {
    try {
      const failed = JSON.parse(localStorage.getItem('failed_operations') || '[]');
      failed.push({ ...item, failedAt: Date.now() });
      
      // Keep only last 50 failed operations
      const trimmed = failed.slice(-50);
      localStorage.setItem('failed_operations', JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error storing failed operation:', error);
    }
  }

  /**
   * Get queue statistics
   */
  static getStats(): QueueStats {
    const queue = this.getQueue();
    const failed = JSON.parse(localStorage.getItem('failed_operations') || '[]');
    
    return {
      totalItems: queue.length + failed.length,
      pendingItems: queue.length,
      failedItems: failed.length,
      lastProcessed: queue.length > 0 ? Math.max(...queue.map(q => q.timestamp)) : null,
    };
  }

  /**
   * Clear all queued operations (use with caution)
   */
  static clearQueue(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🧹 Operation queue cleared');
  }

  /**
   * Get failed operations for manual review
   */
  static getFailedOperations(): OperationQueueItem[] {
    try {
      return JSON.parse(localStorage.getItem('failed_operations') || '[]');
    } catch (error) {
      console.error('Error reading failed operations:', error);
      return [];
    }
  }

  /**
   * Initialize online/offline event listeners
   */
  static initializeEventListeners(): void {
    window.addEventListener('online', () => {
      console.log('🌐 Connection restored - processing queued operations');
      setTimeout(() => this.processQueue(), 1000);
    });

    window.addEventListener('offline', () => {
      console.log('📵 Connection lost - operations will be queued');
    });

    // Process queue every 5 minutes if online
    setInterval(() => {
      if (this.isOnline() && this.getQueue().length > 0) {
        this.processQueue();
      }
    }, 5 * 60 * 1000);
  }
}
