/**
 * Enhanced Cache Management Service
 * Provides centralized cache management with TTL, invalidation strategies, and optimistic updates
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  etag?: string;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
  optimistic?: boolean;
}

export class CacheManager {
  private static caches = new Map<string, Map<string, CacheEntry<any>>>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_CACHE_SIZE = 100;

  /**
   * Get cache for a specific namespace
   */
  private static getCache(namespace: string): Map<string, CacheEntry<any>> {
    if (!this.caches.has(namespace)) {
      this.caches.set(namespace, new Map());
    }
    return this.caches.get(namespace)!;
  }

  /**
   * Get cached data with TTL validation
   */
  static get<T>(namespace: string, key: string): T | null {
    const cache = this.getCache(namespace);
    const entry = cache.get(key);

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached data with optional TTL
   */
  static set<T>(
    namespace: string, 
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): void {
    const cache = this.getCache(namespace);
    const ttl = options.ttl ?? this.DEFAULT_TTL;

    // Enforce cache size limit
    if (cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      etag: this.generateETag(data)
    });
  }

  /**
   * Invalidate specific cache entry
   */
  static invalidate(namespace: string, key?: string): void {
    const cache = this.getCache(namespace);
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }

  /**
   * Invalidate all caches
   */
  static invalidateAll(): void {
    this.caches.clear();
  }

  /**
   * Get cache stats for debugging
   */
  static getStats(): Record<string, { size: number; keys: string[] }> {
    const stats: Record<string, { size: number; keys: string[] }> = {};
    
    for (const [namespace, cache] of this.caches) {
      stats[namespace] = {
        size: cache.size,
        keys: Array.from(cache.keys())
      };
    }
    
    return stats;
  }

  /**
   * Optimistic update - update cache immediately, rollback on failure
   */
  static async optimisticUpdate<T, R>(
    namespace: string,
    key: string,
    updateFn: (current: T) => T,
    persistFn: (updated: T) => Promise<R>,
    options: CacheOptions = {}
  ): Promise<R> {
    const current = this.get<T>(namespace, key);
    if (!current) {
      throw new Error('Cannot perform optimistic update on non-existent cache entry');
    }

    // Store original for rollback
    const original = JSON.parse(JSON.stringify(current));
    const updated = updateFn(current);

    // Immediately update cache
    this.set(namespace, key, updated, options);

    try {
      // Attempt to persist
      const result = await persistFn(updated);
      return result;
    } catch (error) {
      // Rollback on failure
      this.set(namespace, key, original, options);
      throw error;
    }
  }

  /**
   * Stale-while-revalidate pattern
   */
  static async staleWhileRevalidate<T>(
    namespace: string,
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = this.get<T>(namespace, key);
    
    if (cached) {
      // Return cached data immediately
      // Revalidate in background
      setTimeout(async () => {
        try {
          const fresh = await fetchFn();
          this.set(namespace, key, fresh, options);
        } catch (error) {
          console.warn('Background revalidation failed:', error);
        }
      }, 0);
      
      return cached;
    }

    // No cache, fetch fresh data
    const fresh = await fetchFn();
    this.set(namespace, key, fresh, options);
    return fresh;
  }

  /**
   * Generate ETag for cache validation
   */
  private static generateETag<T>(data: T): string {
    return btoa(JSON.stringify(data)).slice(0, 16);
  }

  /**
   * Batch invalidation by pattern
   */
  static invalidateByPattern(namespace: string, pattern: RegExp): void {
    const cache = this.getCache(namespace);
    for (const key of cache.keys()) {
      if (pattern.test(key)) {
        cache.delete(key);
      }
    }
  }

  /**
   * Preload cache with multiple entries
   */
  static preload<T>(
    namespace: string, 
    entries: Array<{ key: string; data: T; options?: CacheOptions }>
  ): void {
    for (const { key, data, options } of entries) {
      this.set(namespace, key, data, options);
    }
  }
}