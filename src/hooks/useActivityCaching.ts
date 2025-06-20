import { useCallback, useEffect, useState } from "react";
import type { ActivityLibraryItem } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

interface CacheEntry<T> {
	data: T;
	timestamp: number;
	expiresAt: number;
}

interface ActivityCache {
	activities: CacheEntry<(ActivityLibraryItem | DiscoveredActivity)[]> | null;
	filteredResults: Map<
		string,
		CacheEntry<(ActivityLibraryItem | DiscoveredActivity)[]>
	>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_FILTER_CACHE_SIZE = 50;

export const useActivityCaching = () => {
	const [cache, setCache] = useState<ActivityCache>({
		activities: null,
		filteredResults: new Map(),
	});

	// Generate cache key for filter combinations
	const generateFilterKey = useCallback(
		(searchQuery: string, pillar: string, difficulty: string): string => {
			return `${searchQuery}|${pillar}|${difficulty}`;
		},
		[],
	);

	// Check if cache entry is valid
	const isCacheValid = useCallback((entry: CacheEntry<any> | null): boolean => {
		if (!entry) return false;
		return Date.now() < entry.expiresAt;
	}, []);

	// Cache activities data
	const cacheActivities = useCallback(
		(activities: (ActivityLibraryItem | DiscoveredActivity)[]) => {
			const now = Date.now();
			setCache((prev) => ({
				...prev,
				activities: {
					data: activities,
					timestamp: now,
					expiresAt: now + CACHE_DURATION,
				},
			}));
		},
		[],
	);

	// Get cached activities
	const getCachedActivities = useCallback(():
		| (ActivityLibraryItem | DiscoveredActivity)[]
		| null => {
		if (isCacheValid(cache.activities)) {
			return cache.activities?.data;
		}
		return null;
	}, [cache.activities, isCacheValid]);

	// Cache filtered results
	const cacheFilteredResults = useCallback(
		(
			searchQuery: string,
			pillar: string,
			difficulty: string,
			results: (ActivityLibraryItem | DiscoveredActivity)[],
		) => {
			const key = generateFilterKey(searchQuery, pillar, difficulty);
			const now = Date.now();

			setCache((prev) => {
				const newFilteredResults = new Map(prev.filteredResults);

				// Remove oldest entries if cache is full
				if (newFilteredResults.size >= MAX_FILTER_CACHE_SIZE) {
					const oldestKey = Array.from(newFilteredResults.entries()).sort(
						([, a], [, b]) => a.timestamp - b.timestamp,
					)[0][0];
					newFilteredResults.delete(oldestKey);
				}

				newFilteredResults.set(key, {
					data: results,
					timestamp: now,
					expiresAt: now + CACHE_DURATION,
				});

				return {
					...prev,
					filteredResults: newFilteredResults,
				};
			});
		},
		[generateFilterKey],
	);

	// Get cached filtered results
	const getCachedFilteredResults = useCallback(
		(
			searchQuery: string,
			pillar: string,
			difficulty: string,
		): (ActivityLibraryItem | DiscoveredActivity)[] | null => {
			const key = generateFilterKey(searchQuery, pillar, difficulty);
			const entry = cache.filteredResults.get(key);

			if (isCacheValid(entry)) {
				return entry?.data;
			}
			return null;
		},
		[cache.filteredResults, generateFilterKey, isCacheValid],
	);

	// Clear expired cache entries periodically
	useEffect(() => {
		const cleanupInterval = setInterval(() => {
			const now = Date.now();

			setCache((prev) => {
				const newFilteredResults = new Map();

				// Keep only valid entries
				for (const [key, entry] of prev.filteredResults) {
					if (now < entry.expiresAt) {
						newFilteredResults.set(key, entry);
					}
				}

				return {
					activities:
						prev.activities && now < prev.activities.expiresAt
							? prev.activities
							: null,
					filteredResults: newFilteredResults,
				};
			});
		}, 60000); // Clean up every minute

		return () => clearInterval(cleanupInterval);
	}, []);

	// Clear all cache
	const clearCache = useCallback(() => {
		setCache({
			activities: null,
			filteredResults: new Map(),
		});
	}, []);

	return {
		cacheActivities,
		getCachedActivities,
		cacheFilteredResults,
		getCachedFilteredResults,
		clearCache,
	};
};
