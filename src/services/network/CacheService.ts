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
	private static readonly STORAGE_PREFIX = "cache_";
	private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

	static set<T>(key: string, data: T, options: CacheOptions = {}): void {
		const {
			ttl = CacheService.DEFAULT_TTL,
			version = "1.0",
			persistent = false,
		} = options;

		const entry: CacheEntry<T> = {
			data,
			timestamp: Date.now(),
			expiry: Date.now() + ttl,
			version,
		};

		// Store in memory cache
		CacheService.memoryCache.set(key, entry);

		// Store in localStorage if persistent
		if (persistent) {
			try {
				localStorage.setItem(
					CacheService.STORAGE_PREFIX + key,
					JSON.stringify(entry),
				);
			} catch (error) {
				console.warn("Failed to persist cache entry:", error);
			}
		}
	}

	static get<T>(key: string, fallbackVersion?: string): T | null {
		// Try memory cache first
		let entry = CacheService.memoryCache.get(key);

		// Fall back to localStorage
		if (!entry) {
			try {
				const stored = localStorage.getItem(CacheService.STORAGE_PREFIX + key);
				if (stored) {
					entry = JSON.parse(stored);
					// Restore to memory cache
					if (entry) {
						CacheService.memoryCache.set(key, entry);
					}
				}
			} catch (error) {
				console.warn("Failed to read cache from localStorage:", error);
			}
		}

		if (!entry) return null;

		// Check if expired
		if (Date.now() > entry.expiry) {
			CacheService.delete(key);
			return null;
		}

		// Check version compatibility
		if (fallbackVersion && entry.version !== fallbackVersion) {
			console.warn(
				`Cache version mismatch for ${key}: ${entry.version} vs ${fallbackVersion}`,
			);
			return null;
		}

		return entry.data;
	}

	static delete(key: string): void {
		CacheService.memoryCache.delete(key);
		try {
			localStorage.removeItem(CacheService.STORAGE_PREFIX + key);
		} catch (error) {
			console.warn("Failed to remove cache from localStorage:", error);
		}
	}

	static clear(): void {
		CacheService.memoryCache.clear();

		// Clear localStorage cache entries
		try {
			Object.keys(localStorage).forEach((key) => {
				if (key.startsWith(CacheService.STORAGE_PREFIX)) {
					localStorage.removeItem(key);
				}
			});
		} catch (error) {
			console.warn("Failed to clear localStorage cache:", error);
		}
	}

	static getCacheStats(): {
		memoryEntries: number;
		storageEntries: number;
		memoryKeys: string[];
	} {
		const storageEntries = Object.keys(localStorage).filter((key) =>
			key.startsWith(CacheService.STORAGE_PREFIX),
		).length;

		return {
			memoryEntries: CacheService.memoryCache.size,
			storageEntries,
			memoryKeys: Array.from(CacheService.memoryCache.keys()),
		};
	}

	// Specialized cache methods for common data types
	static cacheDogs(userId: string, dogs: any[], ttl = 10 * 60 * 1000): void {
		CacheService.set(`dogs_${userId}`, dogs, {
			ttl,
			persistent: true,
			version: "1.0",
		});
	}

	static getCachedDogs(userId: string): any[] | null {
		return CacheService.get(`dogs_${userId}`, "1.0");
	}

	static cacheActivities(
		dogId: string,
		activities: any[],
		ttl = 15 * 60 * 1000,
	): void {
		CacheService.set(`activities_${dogId}`, activities, {
			ttl,
			persistent: true,
			version: "1.0",
		});
	}

	static getCachedActivities(dogId: string): any[] | null {
		return CacheService.get(`activities_${dogId}`, "1.0");
	}
}
