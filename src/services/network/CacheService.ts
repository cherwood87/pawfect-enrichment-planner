
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
  version: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  version?: string;
  persistent?: boolean; // Whether to persist to localStorage
}

export class CacheService {
  private static memoryCache = new Map<string, CacheEntry<any>>();
  private static readonly STORAGE_PREFIX = 'cache_';
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static set<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): void {
    const {
      ttl = this.DEFAULT_TTL,
      version = '1.0',
      persistent = false
    } = options;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
      version
    };

    // Store in memory cache
    this.memoryCache.set(key, entry);

    // Store in localStorage if persistent
    if (persistent) {
      try {
        localStorage.setItem(
          this.STORAGE_PREFIX + key,
          JSON.stringify(entry)
        );
      } catch (error) {
        console.warn('Failed to persist cache entry:', error);
      }
    }
  }

  static get<T>(key: string, fallbackVersion?: string): T | null {
    // Try memory cache first
    let entry = this.memoryCache.get(key);
    
    // Fall back to localStorage
    if (!entry) {
      try {
        const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
        if (stored) {
          entry = JSON.parse(stored);
          // Restore to memory cache
          if (entry) {
            this.memoryCache.set(key, entry);
          }
        }
      } catch (error) {
        console.warn('Failed to read cache from localStorage:', error);
      }
    }

    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.delete(key);
      return null;
    }

    // Check version compatibility
    if (fallbackVersion && entry.version !== fallbackVersion) {
      console.warn(`Cache version mismatch for ${key}: ${entry.version} vs ${fallbackVersion}`);
      return null;
    }

    return entry.data;
  }

  static delete(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch (error) {
      console.warn('Failed to remove cache from localStorage:', error);
    }
  }

  static clear(): void {
    this.memoryCache.clear();
    
    // Clear localStorage cache entries
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  }

  static getCacheStats(): {
    memoryEntries: number;
    storageEntries: number;
    memoryKeys: string[];
  } {
    const storageEntries = Object.keys(localStorage)
      .filter(key => key.startsWith(this.STORAGE_PREFIX)).length;

    return {
      memoryEntries: this.memoryCache.size,
      storageEntries,
      memoryKeys: Array.from(this.memoryCache.keys())
    };
  }

  // Specialized cache methods for common data types
  static cacheDogs(userId: string, dogs: any[], ttl = 10 * 60 * 1000): void {
    this.set(`dogs_${userId}`, dogs, { ttl, persistent: true, version: '1.0' });
  }

  static getCachedDogs(userId: string): any[] | null {
    return this.get(`dogs_${userId}`, '1.0');
  }

  static cacheActivities(dogId: string, activities: any[], ttl = 15 * 60 * 1000): void {
    this.set(`activities_${dogId}`, activities, { ttl, persistent: true, version: '1.0' });
  }

  static getCachedActivities(dogId: string): any[] | null {
    return this.get(`activities_${dogId}`, '1.0');
  }
}
