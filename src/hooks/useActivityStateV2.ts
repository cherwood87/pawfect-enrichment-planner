import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ContentDiscoveryService } from "@/services/ContentDiscoveryService";
import type { ScheduledActivity, UserActivity } from "@/types/activity";
import type {
	ContentDiscoveryConfig,
	DiscoveredActivity,
} from "@/types/discovery";
import type { Dog } from "@/types/dog";
import { useActivityLoader } from "./useActivityLoader";
import { useActivityMigration } from "./useActivityMigration";
import { useActivityPersistence } from "./useActivityPersistence";

interface ActivityStateCache {
	scheduledActivities: ScheduledActivity[];
	userActivities: UserActivity[];
	discoveredActivities: DiscoveredActivity[];
	discoveryConfig: ContentDiscoveryConfig;
	dogId: string;
	timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const activityStateCache = new Map<string, ActivityStateCache>();

export const useActivityStateV2 = (currentDog: Dog | null) => {
	const [scheduledActivities, setScheduledActivities] = useState<
		ScheduledActivity[]
	>([]);
	const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
	const [discoveredActivities, setDiscoveredActivities] = useState<
		DiscoveredActivity[]
	>([]);
	const [discoveryConfig, setDiscoveryConfig] =
		useState<ContentDiscoveryConfig>(
			ContentDiscoveryService.getDefaultConfig(),
		);
	const [dataLoaded, setDataLoaded] = useState(false);
	const loadingRef = useRef(false);
	const lastDogIdRef = useRef<string | null>(null);

	const {
		isLoading,
		setIsLoading,
		loadActivitiesFromSupabase,
		migrateScheduledActivity,
	} = useActivityLoader(currentDog);

	const { loadAndMigrateScheduledActivities, loadAndMigrateUserActivities } =
		useActivityMigration(
			currentDog,
			setScheduledActivities,
			setUserActivities,
			migrateScheduledActivity,
		);

	// Use persistence hook with debouncing
	useActivityPersistence(
		currentDog,
		scheduledActivities,
		userActivities,
		discoveredActivities,
		isLoading,
	);

	// Optimized cache key generation
	const cacheKey = useMemo(
		() => (currentDog ? `dog-${currentDog.id}` : null),
		[currentDog?.id, currentDog],
	);

	// Check cache before loading data
	const getCachedData = useCallback(
		(key: string): ActivityStateCache | null => {
			const cached = activityStateCache.get(key);
			if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
				return cached;
			}
			return null;
		},
		[],
	);

	// Store data in cache
	const setCachedData = useCallback(
		(key: string, data: Omit<ActivityStateCache, "timestamp" | "dogId">) => {
			activityStateCache.set(key, {
				...data,
				dogId: currentDog?.id || "",
				timestamp: Date.now(),
			});
		},
		[currentDog?.id],
	);

	// Parallel data loading with caching
	const loadDataParallel = useCallback(async () => {
		if (!currentDog || !cacheKey || loadingRef.current) return;

		// Check cache first
		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			console.log("🎯 Using cached data for dog:", currentDog.name);
			setScheduledActivities(cachedData.scheduledActivities);
			setUserActivities(cachedData.userActivities);
			setDiscoveredActivities(cachedData.discoveredActivities);
			setDiscoveryConfig(cachedData.discoveryConfig);
			setDataLoaded(true);
			return;
		}

		loadingRef.current = true;
		console.log("🔄 Parallel loading activities for dog:", currentDog.name);
		setDataLoaded(false);

		try {
			// Start all async operations in parallel
			const promises = [
				loadActivitiesFromSupabase(
					setScheduledActivities,
					setUserActivities,
					setDiscoveredActivities,
					setDiscoveryConfig,
					loadAndMigrateScheduledActivities,
					loadAndMigrateUserActivities,
				),
			];

			// Wait for all to complete
			await Promise.all(promises);

			// Cache the loaded data
			setCachedData(cacheKey, {
				scheduledActivities,
				userActivities,
				discoveredActivities,
				discoveryConfig,
			});

			setDataLoaded(true);
			console.log(
				"✅ Parallel activities loaded successfully for dog:",
				currentDog.name,
			);
		} catch (error) {
			console.error("❌ Error in parallel loading:", error);
			setDataLoaded(true);
		} finally {
			loadingRef.current = false;
		}
	}, [
		currentDog,
		cacheKey,
		getCachedData,
		setCachedData,
		loadActivitiesFromSupabase,
		loadAndMigrateScheduledActivities,
		loadAndMigrateUserActivities,
		scheduledActivities,
		userActivities,
		discoveredActivities,
		discoveryConfig,
	]);

	// Optimized effect that prevents unnecessary loads
	useEffect(() => {
		if (!currentDog) {
			setScheduledActivities([]);
			setUserActivities([]);
			setDiscoveredActivities([]);
			setDataLoaded(false);
			lastDogIdRef.current = null;
			return;
		}

		// Skip if same dog and data already loaded
		if (lastDogIdRef.current === currentDog.id && dataLoaded) {
			return;
		}

		lastDogIdRef.current = currentDog.id;

		// Debounce to prevent rapid fire requests
		const timeoutId = setTimeout(loadDataParallel, 50);
		return () => clearTimeout(timeoutId);
	}, [currentDog?.id, dataLoaded, loadDataParallel, currentDog]);

	// Memoized setters to prevent unnecessary re-renders in consumers
	const memoizedSetters = useMemo(
		() => ({
			setScheduledActivities: (
				activities:
					| ScheduledActivity[]
					| ((prev: ScheduledActivity[]) => ScheduledActivity[]),
			) => {
				setScheduledActivities(activities);
				// Update cache
				if (cacheKey) {
					setTimeout(() => {
						const current = activityStateCache.get(cacheKey);
						if (current) {
							activityStateCache.set(cacheKey, {
								...current,
								scheduledActivities:
									typeof activities === "function"
										? activities(current.scheduledActivities)
										: activities,
								timestamp: Date.now(),
							});
						}
					}, 0);
				}
			},
			setUserActivities: (
				activities: UserActivity[] | ((prev: UserActivity[]) => UserActivity[]),
			) => {
				setUserActivities(activities);
				// Update cache
				if (cacheKey) {
					setTimeout(() => {
						const current = activityStateCache.get(cacheKey);
						if (current) {
							activityStateCache.set(cacheKey, {
								...current,
								userActivities:
									typeof activities === "function"
										? activities(current.userActivities)
										: activities,
								timestamp: Date.now(),
							});
						}
					}, 0);
				}
			},
			setDiscoveredActivities,
			setDiscoveryConfig,
		}),
		[cacheKey],
	);

	// Memoize return object to prevent unnecessary re-renders
	return useMemo(
		() => ({
			scheduledActivities,
			userActivities,
			discoveredActivities,
			discoveryConfig,
			...memoizedSetters,
			isLoading: isLoading || !dataLoaded,
		}),
		[
			scheduledActivities,
			userActivities,
			discoveredActivities,
			discoveryConfig,
			memoizedSetters,
			isLoading,
			dataLoaded,
		],
	);
};
