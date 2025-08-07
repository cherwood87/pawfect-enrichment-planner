
import { useState, useEffect } from 'react';
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

  // Use persistence hook
  useActivityPersistence(currentDog, scheduledActivities, userActivities, discoveredActivities, isLoading);

  // Load dog-specific data from Supabase with localStorage fallback
  useEffect(() => {
    if (!currentDog) {
      setScheduledActivities([]);
      setUserActivities([]);
      setDiscoveredActivities([]);
      setDataLoaded(false);
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

    loadData();
  }, [currentDog]);

  return {
    scheduledActivities,
    userActivities,
    discoveredActivities,
    discoveryConfig,
    setScheduledActivities,
    setUserActivities,
    setDiscoveredActivities,
    setDiscoveryConfig,
    isLoading: isLoading || !dataLoaded
  };
};
