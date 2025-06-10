
import { useState, useEffect, useMemo } from 'react';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { getDiscoveredActivities } from '@/data/activityLibrary';
import { ContentDiscoveryService } from '@/services/ContentDiscoveryService';
import { Dog } from '@/types/dog';
import { useActivityLoader } from './useActivityLoader';
import { useActivityMigration } from './useActivityMigration';
import { useActivityPersistence } from './useActivityPersistence';

export const useActivityStateHook = (currentDog: Dog | null) => {
  const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [discoveredActivities, setDiscoveredActivities] = useState<DiscoveredActivity[]>([]);
  const [discoveryConfig, setDiscoveryConfig] = useState<ContentDiscoveryConfig>(
    ContentDiscoveryService.getDefaultConfig()
  );
  const [dataLoaded, setDataLoaded] = useState(false);

  const { isLoading, setIsLoading, loadActivitiesFromSupabase, migrateScheduledActivity } = useActivityLoader(currentDog);
  
  const { loadAndMigrateScheduledActivities, loadAndMigrateUserActivities } = useActivityMigration(
    currentDog,
    setScheduledActivities,
    setUserActivities,
    migrateScheduledActivity
  );

  // Use persistence hook with debouncing
  useActivityPersistence(currentDog, scheduledActivities, userActivities, discoveredActivities, isLoading);

  // Memoize expensive operations
  const memoizedActivities = useMemo(() => ({
    scheduled: scheduledActivities,
    user: userActivities,
    discovered: discoveredActivities
  }), [scheduledActivities, userActivities, discoveredActivities]);

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
    if (dataLoaded && scheduledActivities.length > 0 && scheduledActivities[0]?.dogId === currentDog.id) {
      return;
    }

    console.log('🔄 Loading activities for dog:', currentDog.name);
    setDataLoaded(false);

    const loadData = async () => {
      try {
        await loadActivitiesFromSupabase(
          setScheduledActivities,
          setUserActivities,
          setDiscoveredActivities,
          setDiscoveryConfig,
          loadAndMigrateScheduledActivities,
          loadAndMigrateUserActivities
        );
        setDataLoaded(true);
        console.log('✅ Activities loaded successfully for dog:', currentDog.name);
      } catch (error) {
        console.error('❌ Error loading activities:', error);
        setDataLoaded(true); // Set to true even on error to prevent infinite loading
      }
    };

    // Add a small delay to prevent race conditions
    const timeoutId = setTimeout(loadData, 100);
    return () => clearTimeout(timeoutId);
  }, [currentDog?.id]); // Only depend on dog ID to prevent unnecessary reloads

  return {
    ...memoizedActivities,
    discoveryConfig,
    setScheduledActivities,
    setUserActivities,
    setDiscoveredActivities,
    setDiscoveryConfig,
    isLoading: isLoading || !dataLoaded
  };
};
