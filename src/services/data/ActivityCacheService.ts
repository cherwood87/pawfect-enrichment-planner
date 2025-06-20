import type { ActivityLibraryItem } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

interface CacheEntry<T> {
	data: T;
	timestamp: number;
	expiresAt: number;
	accessCount: number;
	lastAccessed: number;
}

export class ActivityCacheService {
	private static instance: ActivityCacheService;
	private cache: Map<string, CacheEntry<any>> = new Map();
	private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
	private readonly MAX_CACHE_SIZE = 100;
	private readonly CLEANUP_INTERVAL = 60 * 1000; // 1 minute

	private constructor() {
		this.startCleanupInterval();
	}

	static getInstance(): ActivityCacheService {
		if (!ActivityCacheService.instance) {
			ActivityCacheService.instance = new ActivityCacheService();
		}
		return ActivityCacheService.instance;
	}

	// Cache activity library data
	cacheActivities(
		key: string,
		activities: (ActivityLibraryItem | DiscoveredActivity)[],
	): void {
		this.set(key, activities);
	}

	// Get cached activities
	getCachedActivities(
		key: string,
	): (ActivityLibraryItem | DiscoveredActivity)[] | null {
		return this.get(key);
	}

	// Cache filtered results
	cacheFilteredResults(
		filterKey: string,
		results: (ActivityLibraryItem | DiscoveredActivity)[],
	): void {
		this.set(`filter:${filterKey}`, results);
	}

	// Get cached filtered results
	getCachedFilteredResults(
		filterKey: string,
	): (ActivityLibraryItem | DiscoveredActivity)[] | null {
		return this.get(`filter:${filterKey}`);
	}

	// Generic cache methods
	private set<T>(key: string, data: T): void {
		const now = Date.now();

		// Remove oldest entries if cache is full
		if (this.cache.size >= this.MAX_CACHE_SIZE) {
			this.evictOldest();
		}

		this.cache.set(key, {
			data,
			timestamp: now,
			expiresAt: now + this.CACHE_DURATION,
			accessCount: 1,
			lastAccessed: now,
		});
	}

	private get<T>(key: string): T | null {
		const entry = this.cache.get(key);

		if (!entry) return null;

		if (Date.now() > entry.expiresAt) {
			this.cache.delete(key);
			return null;
		}

		// Update access statistics
		entry.accessCount++;
		entry.lastAccessed = Date.now();

		return entry.data;
	}

	// Cache eviction strategies
	private evictOldest(): void {
		if (this.cache.size === 0) return;

		let oldestKey = "";
		let oldestTime = Date.now();

		for (const [key, entry] of this.cache) {
			if (entry.lastAccessed < oldestTime) {
				oldestTime = entry.lastAccessed;
				oldestKey = key;
			}
		}

		if (oldestKey) {
			this.cache.delete(oldestKey);
		}
	}

	private evictExpired(): void {
		const now = Date.now();
		const keysToDelete: string[] = [];

		for (const [key, entry] of this.cache) {
			if (now > entry.expiresAt) {
				keysToDelete.push(key);
			}
		}

		keysToDelete.forEach((key) => this.cache.delete(key));
	}

	private startCleanupInterval(): void {
		setInterval(() => {
			this.evictExpired();
		}, this.CLEANUP_INTERVAL);
	}

	// Cache statistics
	getStats(): {
		size: number;
		hitRate: number;
		averageAccessCount: number;
	} {
		const entries = Array.from(this.cache.values());
		const totalAccess = entries.reduce(
			(sum, entry) => sum + entry.accessCount,
			0,
		);

		return {
			size: this.cache.size,
			hitRate: entries.length > 0 ? totalAccess / entries.length : 0,
			averageAccessCount: entries.length > 0 ? totalAccess / entries.length : 0,
		};
	}

	// Clear cache
	clear(): void {
		this.cache.clear();
	}

	// Prefetch activities based on usage patterns
	prefetchPopularActivities(
		activities: (ActivityLibraryItem | DiscoveredActivity)[],
	): void {
		// Cache popular pillar combinations
		const pillars = [
			"mental",
			"physical",
			"social",
			"environmental",
			"instinctual",
		];

		pillars.forEach((pillar) => {
			const pillarActivities = activities.filter((a) => a.pillar === pillar);
			this.cacheFilteredResults(`all|${pillar}|all`, pillarActivities);
		});

		// Cache common difficulty filters
		const difficulties = ["Easy", "Medium", "Hard"];
		difficulties.forEach((difficulty) => {
			const difficultyActivities = activities.filter(
				(a) => a.difficulty === difficulty,
			);
			this.cacheFilteredResults(`all|all|${difficulty}`, difficultyActivities);
		});
	}
}
