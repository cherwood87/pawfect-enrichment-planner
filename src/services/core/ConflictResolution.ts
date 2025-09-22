/**
 * Conflict Resolution Service
 * Handles conflicts when the same data is edited simultaneously by multiple sources
 */

export interface ConflictData<T = any> {
  id: string;
  table: string;
  localVersion: T;
  serverVersion: T;
  baseVersion?: T; // Original version if available
  timestamp: number;
  userId?: string;
  dogId?: string;
}

export type ConflictResolutionStrategy = 
  | 'client-wins'     // Local changes take precedence
  | 'server-wins'     // Server changes take precedence  
  | 'merge'           // Attempt to merge changes
  | 'manual'          // Require manual resolution
  | 'newest-wins';    // Most recent timestamp wins

export interface ResolutionResult<T = any> {
  resolved: boolean;
  data?: T;
  strategy: ConflictResolutionStrategy;
  requiresManualReview: boolean;
  mergeConflicts?: Array<{
    field: string;
    localValue: any;
    serverValue: any;
    resolved: boolean;
  }>;
}

export class ConflictResolution {
  private static readonly CONFLICT_STORAGE_KEY = 'pending_conflicts';

  /**
   * Detect and resolve conflicts between local and server versions
   */
  static async resolveConflict<T extends Record<string, any>>(
    conflictData: ConflictData<T>,
    preferredStrategy: ConflictResolutionStrategy = 'merge'
  ): Promise<ResolutionResult<T>> {
    console.log(`🔄 Resolving conflict for ${conflictData.table}:${conflictData.id} using ${preferredStrategy} strategy`);

    const { localVersion, serverVersion, baseVersion } = conflictData;

    try {
      switch (preferredStrategy) {
        case 'client-wins':
          return {
            resolved: true,
            data: localVersion,
            strategy: 'client-wins',
            requiresManualReview: false,
          };

        case 'server-wins':
          return {
            resolved: true,
            data: serverVersion,
            strategy: 'server-wins',
            requiresManualReview: false,
          };

        case 'newest-wins':
          const localTimestamp = this.extractTimestamp(localVersion);
          const serverTimestamp = this.extractTimestamp(serverVersion);
          
          const newestData = (localTimestamp > serverTimestamp) ? localVersion : serverVersion;
          return {
            resolved: true,
            data: newestData,
            strategy: 'newest-wins',
            requiresManualReview: false,
          };

        case 'merge':
          return this.attemptMerge(conflictData);

        case 'manual':
          this.storeForManualResolution(conflictData);
          return {
            resolved: false,
            strategy: 'manual',
            requiresManualReview: true,
          };

        default:
          throw new Error(`Unknown resolution strategy: ${preferredStrategy}`);
      }
    } catch (error) {
      console.error(`❌ Error resolving conflict:`, error);
      
      // Fallback to manual resolution
      this.storeForManualResolution(conflictData);
      return {
        resolved: false,
        strategy: 'manual',
        requiresManualReview: true,
      };
    }
  }

  /**
   * Attempt to merge changes intelligently
   */
  private static attemptMerge<T extends Record<string, any>>(
    conflictData: ConflictData<T>
  ): ResolutionResult<T> {
    const { localVersion, serverVersion, baseVersion } = conflictData;
    
    // If we have a base version, do a three-way merge
    if (baseVersion) {
      return this.threeWayMerge(localVersion, serverVersion, baseVersion);
    }

    // Otherwise, do a two-way merge
    return this.twoWayMerge(localVersion, serverVersion);
  }

  /**
   * Three-way merge using base version as reference
   */
  private static threeWayMerge<T extends Record<string, any>>(
    local: T,
    server: T,
    base: T
  ): ResolutionResult<T> {
    const merged = { ...base } as T;
    const conflicts: ResolutionResult<T>['mergeConflicts'] = [];

    // Get all unique keys across all versions
    const allKeys = new Set([
      ...Object.keys(local),
      ...Object.keys(server),
      ...Object.keys(base)
    ]);

    for (const key of allKeys) {
      const localValue = local[key];
      const serverValue = server[key];
      const baseValue = base[key];

      // Skip metadata fields that shouldn't be merged
      if (this.isMetadataField(key)) {
        (merged as any)[key] = this.resolveMetadataField(key, localValue, serverValue, baseValue);
        continue;
      }

      const localChanged = !this.deepEqual(localValue, baseValue);
      const serverChanged = !this.deepEqual(serverValue, baseValue);

      if (!localChanged && !serverChanged) {
        // No changes - keep base value
        (merged as any)[key] = baseValue;
      } else if (localChanged && !serverChanged) {
        // Only local changed - use local value
        (merged as any)[key] = localValue;
      } else if (!localChanged && serverChanged) {
        // Only server changed - use server value
        (merged as any)[key] = serverValue;
      } else {
        // Both changed - conflict!
        if (this.deepEqual(localValue, serverValue)) {
          // Same change - use either value
          (merged as any)[key] = localValue;
        } else {
          // Different changes - conflict resolution needed
          conflicts.push({
            field: key,
            localValue,
            serverValue,
            resolved: false,
          });

          // Use newest timestamp if available, otherwise prefer server
          (merged as any)[key] = this.resolveConflictingField(key, localValue, serverValue);
        }
      }
    }

    const hasUnresolvedConflicts = conflicts.some(c => !c.resolved);

    return {
      resolved: !hasUnresolvedConflicts,
      data: merged,
      strategy: 'merge',
      requiresManualReview: hasUnresolvedConflicts,
      mergeConflicts: conflicts.length > 0 ? conflicts : undefined,
    };
  }

  /**
   * Two-way merge without base reference
   */
  private static twoWayMerge<T extends Record<string, any>>(
    local: T,
    server: T
  ): ResolutionResult<T> {
    const merged = { ...server } as T; // Start with server as base
    const conflicts: ResolutionResult<T>['mergeConflicts'] = [];

    // Override with local changes where appropriate
    for (const [key, localValue] of Object.entries(local)) {
      const serverValue = server[key];

      if (this.isMetadataField(key)) {
        (merged as any)[key] = this.resolveMetadataField(key, localValue, serverValue);
        continue;
      }

      if (!this.deepEqual(localValue, serverValue)) {
        conflicts.push({
          field: key,
          localValue,
          serverValue,
          resolved: false,
        });

        // Use resolution strategy for conflicting fields
        (merged as any)[key] = this.resolveConflictingField(key, localValue, serverValue);
      }
    }

    return {
      resolved: conflicts.length === 0,
      data: merged,
      strategy: 'merge',
      requiresManualReview: conflicts.length > 0,
      mergeConflicts: conflicts.length > 0 ? conflicts : undefined,
    };
  }

  /**
   * Resolve conflicting field values using field-specific logic
   */
  private static resolveConflictingField(field: string, localValue: any, serverValue: any): any {
    // Timestamp-based fields - prefer newer
    if (field.includes('updated_at') || field.includes('completed_at')) {
      return new Date(localValue) > new Date(serverValue) ? localValue : serverValue;
    }

    // Array fields - merge arrays
    if (Array.isArray(localValue) && Array.isArray(serverValue)) {
      return [...new Set([...serverValue, ...localValue])];
    }

    // String fields - prefer non-empty
    if (typeof localValue === 'string' && typeof serverValue === 'string') {
      return localValue.length > serverValue.length ? localValue : serverValue;
    }

    // Numeric fields - prefer higher value for most cases
    if (typeof localValue === 'number' && typeof serverValue === 'number') {
      return Math.max(localValue, serverValue);
    }

    // Boolean fields - prefer true
    if (typeof localValue === 'boolean' && typeof serverValue === 'boolean') {
      return localValue || serverValue;
    }

    // Default to server value for unknown types
    return serverValue;
  }

  /**
   * Check if field is metadata that has special resolution rules
   */
  private static isMetadataField(field: string): boolean {
    return [
      'id', 'created_at', 'updated_at', 'user_id', 'dog_id'
    ].includes(field);
  }

  /**
   * Resolve metadata fields with special logic
   */
  private static resolveMetadataField(field: string, localValue: any, serverValue: any, baseValue?: any): any {
    switch (field) {
      case 'id':
        return serverValue || localValue; // Prefer server ID
      case 'created_at':
        return baseValue || serverValue || localValue; // Prefer original creation time
      case 'updated_at':
        return new Date().toISOString(); // Set to current time
      case 'user_id':
      case 'dog_id':
        return serverValue || localValue; // These shouldn't normally conflict
      default:
        return serverValue;
    }
  }

  /**
   * Extract timestamp from object for comparison
   */
  private static extractTimestamp(obj: Record<string, any>): number {
    const timestamp = obj.updated_at || obj.created_at || obj.timestamp;
    return timestamp ? new Date(timestamp).getTime() : 0;
  }

  /**
   * Deep equality check
   */
  private static deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    
    if (a == null || b == null) return a === b;
    
    if (typeof a !== typeof b) return false;
    
    if (typeof a !== 'object') return false;
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!this.deepEqual(a[key], b[key])) return false;
    }
    
    return true;
  }

  /**
   * Store conflict for manual resolution
   */
  private static storeForManualResolution<T>(conflictData: ConflictData<T>): void {
    try {
      const stored = JSON.parse(localStorage.getItem(this.CONFLICT_STORAGE_KEY) || '[]');
      stored.push({
        ...conflictData,
        storedAt: Date.now(),
      });

      // Keep only last 20 conflicts
      const trimmed = stored.slice(-20);
      localStorage.setItem(this.CONFLICT_STORAGE_KEY, JSON.stringify(trimmed));
      
      console.log(`📋 Stored conflict for manual resolution:`, conflictData.id);
    } catch (error) {
      console.error('Error storing conflict for manual resolution:', error);
    }
  }

  /**
   * Get pending conflicts that require manual resolution
   */
  static getPendingConflicts(): Array<ConflictData & { storedAt: number }> {
    try {
      return JSON.parse(localStorage.getItem(this.CONFLICT_STORAGE_KEY) || '[]');
    } catch (error) {
      console.error('Error reading pending conflicts:', error);
      return [];
    }
  }

  /**
   * Resolve a manually reviewed conflict
   */
  static resolveManualConflict(conflictId: string, resolvedData: any): void {
    try {
      const conflicts = this.getPendingConflicts();
      const filtered = conflicts.filter(c => c.id !== conflictId);
      localStorage.setItem(this.CONFLICT_STORAGE_KEY, JSON.stringify(filtered));
      
      console.log(`✅ Manually resolved conflict:`, conflictId);
    } catch (error) {
      console.error('Error resolving manual conflict:', error);
    }
  }
}
