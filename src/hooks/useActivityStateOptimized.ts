import { useState, useEffect, useMemo, useCallback } from "react";
import { ScheduledActivity, UserActivity } from "@/types/activity";
import { DiscoveredActivity, ContentDiscoveryConfig } from "@/types/discovery";
import { getDiscoveredActivities } from "@/data/activityLibrary";
import { ContentDiscoveryService } from "@/services/ContentDiscoveryService";
import { Dog } from "@/types/dog";
import { useActivityLoader } from "./useActivityLoader";
import { useActivityMigration } from "./useActivityMigration";
import { useActivityPersistence } from "./useActivityPersistence";

export const useActivityStateOptimized = (currentDog: Dog | null) => {
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

  // Memoize the current dog ID to prevent unnecessary effects
  const currentDogId = useMemo(() => currentDog?.id, [currentDog?.id]);

  // Memoize the data loaded check
  const hasDataForCurrentDog = useMemo(() => {
    return (
      dataLoaded &&
      scheduledActivities.length > 0 &&
      scheduledActivities[0]?.dogId === currentDogId
    );
  }, [dataLoaded, scheduledActivities, currentDogId]);

  // Memoize the load data function
  const loadData = useCallback(async () => {
    if (!currentDog) return;

    console.log("🔄 Loading activities for dog:", currentDog.name);
    setDataLoaded(false);

    try {
      await loadActivitiesFromSupabase(
        setScheduledActivities,
        setUserActivities,
        setDiscoveredActivities,
        setDiscoveryConfig,
        loadAndMigrateScheduledActivities,
        loadAndMigrateUserActivities,
      );
      setDataLoaded(true);
      console.log(
        "✅ Activities loaded successfully for dog:",
        currentDog.name,
      );
    } catch (error) {
      console.error("❌ Error loading activities:", error);
      setDataLoaded(true);
    }
  }, [
    currentDog,
    loadActivitiesFromSupabase,
    loadAndMigrateScheduledActivities,
    loadAndMigrateUserActivities,
  ]);

  // Load dog-specific data from Supabase with localStorage fallback
  useEffect(() => {
    if (!currentDog) {
      setScheduledActivities([]);
      setUserActivities([]);
      setDiscoveredActivities([]);
      setDataLoaded(false);
      return;
    }

    // Skip loading if we already have data for this dog (optimization)
    if (hasDataForCurrentDog) {
      return;
    }

    // Add a small delay to prevent race conditions
    const timeoutId = setTimeout(loadData, 100);
    return () => clearTimeout(timeoutId);
  }, [currentDogId, hasDataForCurrentDog, loadData]);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      scheduledActivities,
      userActivities,
      discoveredActivities,
      discoveryConfig,
      setScheduledActivities,
      setUserActivities,
      setDiscoveredActivities,
      setDiscoveryConfig,
      isLoading: isLoading || !dataLoaded,
    }),
    [
      scheduledActivities,
      userActivities,
      discoveredActivities,
      discoveryConfig,
      isLoading,
      dataLoaded,
    ],
  );
};
