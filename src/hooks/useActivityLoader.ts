
import { useState } from 'react';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { getDiscoveredActivities } from '@/data/activityLibrary';
import { ContentDiscoveryService } from '@/services/ContentDiscoveryService';
import { ActivityService } from '@/services/activityService';
import { Dog } from '@/types/dog';

export const useActivityLoader = (currentDog: Dog | null) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadActivitiesFromSupabase = async (
    setScheduledActivities: (activities: ScheduledActivity[]) => void,
    setUserActivities: (activities: UserActivity[]) => void,
    setDiscoveredActivities: (activities: DiscoveredActivity[]) => void,
    setDiscoveryConfig: (config: ContentDiscoveryConfig) => void,
    loadAndMigrateScheduledActivities: () => Promise<void>,
    loadAndMigrateUserActivities: () => Promise<void>
  ) => {
    if (!currentDog) return;

    try {
      setIsLoading(true);
      const dogId = currentDog.id;
      
      console.log('🔄 Loading activities from Supabase for dog:', currentDog.name);

      // Execute all data loading operations in parallel for better performance
      const [
        scheduledResult,
        userActivitiesResult,
        discoveredActivitiesResult,
        configResult
      ] = await Promise.allSettled([
        // Scheduled Activities
        ActivityService.getScheduledActivities(dogId).catch((error) => {
          console.warn('Scheduled activities failed, will try migration:', error);
          return null;
        }),
        // User Activities
        ActivityService.getUserActivities(dogId).catch((error) => {
          console.warn('User activities failed, will try migration:', error);
          return null;
        }),
        // Discovered Activities (try localStorage first)
        (async () => {
          const localDiscovered = getDiscoveredActivities(dogId);
          if (localDiscovered && localDiscovered.length > 0) {
            return localDiscovered;
          }
          try {
            return await ContentDiscoveryService.getDiscoveredActivities(dogId);
          } catch (error) {
            console.warn('Discovery activities failed:', error);
            return [];
          }
        })(),
        // Discovery Config (try localStorage first)
        (async () => {
          const localConfig = localStorage.getItem(`discoveryConfig-${dogId}`);
          if (localConfig) {
            return JSON.parse(localConfig);
          }
          try {
            return await ContentDiscoveryService.getDiscoveryConfig(dogId);
          } catch (error) {
            console.warn('Discovery config failed:', error);
            return null;
          }
        })()
      ]);

      // Handle scheduled activities
      if (scheduledResult.status === 'fulfilled' && scheduledResult.value && scheduledResult.value.length > 0) {
        console.log('📅 Loaded scheduled activities from Supabase:', scheduledResult.value.length);
        setScheduledActivities(scheduledResult.value);
      } else {
        console.log('📅 No scheduled activities in Supabase or failed, trying migration...');
        await loadAndMigrateScheduledActivities();
      }

      // Handle user activities
      if (userActivitiesResult.status === 'fulfilled' && userActivitiesResult.value && userActivitiesResult.value.length > 0) {
        console.log('👤 Loaded user activities from Supabase:', userActivitiesResult.value.length);
        setUserActivities(userActivitiesResult.value);
      } else {
        console.log('👤 No user activities in Supabase or failed, trying migration...');
        await loadAndMigrateUserActivities();
      }

      // Handle discovered activities
      if (discoveredActivitiesResult.status === 'fulfilled') {
        const discoveredActivities = discoveredActivitiesResult.value || [];
        console.log('🔍 Loaded discovered activities:', discoveredActivities.length);
        setDiscoveredActivities(discoveredActivities);
      }

      // Handle discovery config
      if (configResult.status === 'fulfilled' && configResult.value) {
        console.log('⚙️ Loaded discovery config');
        setDiscoveryConfig(configResult.value);
      }

      console.log('✅ Successfully completed parallel activity loading for dog:', currentDog.name);

    } catch (error) {
      console.error('❌ Critical error during activity loading:', error);
      // Fallback to localStorage
      console.log('🔄 Falling back to localStorage loading...');
      loadActivitiesFromLocalStorage(
        setScheduledActivities,
        setUserActivities,
        setDiscoveredActivities,
        currentDog
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadActivitiesFromLocalStorage = (
    setScheduledActivities: (activities: ScheduledActivity[]) => void,
    setUserActivities: (activities: UserActivity[]) => void,
    setDiscoveredActivities: (activities: DiscoveredActivity[]) => void,
    dog: Dog
  ) => {
    console.log('📂 Loading activities from localStorage for dog:', dog.name);
    
    // Load all localStorage data in parallel
    const [savedScheduled, savedUser, savedDiscovered] = [
      localStorage.getItem(`scheduledActivities-${dog.id}`),
      localStorage.getItem(`userActivities-${dog.id}`),
      getDiscoveredActivities(dog.id)
    ];

    if (savedScheduled) {
      try {
        const parsedActivities = JSON.parse(savedScheduled);
        const migratedActivities = parsedActivities.map(migrateScheduledActivity);
        console.log('📅 Loaded scheduled activities from localStorage:', migratedActivities.length);
        setScheduledActivities(migratedActivities);
      } catch (error) {
        console.error('Error parsing scheduled activities from localStorage:', error);
        setScheduledActivities([]);
      }
    } else {
      setScheduledActivities([]);
    }

    if (savedUser) {
      try {
        const userActivities = JSON.parse(savedUser);
        console.log('👤 Loaded user activities from localStorage:', userActivities.length);
        setUserActivities(userActivities);
      } catch (error) {
        console.error('Error parsing user activities from localStorage:', error);
        setUserActivities([]);
      }
    } else {
      setUserActivities([]);
    }

    console.log('🔍 Loaded discovered activities from localStorage:', savedDiscovered?.length || 0);
    setDiscoveredActivities(savedDiscovered || []);
  };

  // Migration helper function to ensure backward compatibility
  const migrateScheduledActivity = (activity: any): ScheduledActivity => {
    return {
      ...activity,
      userSelectedTime: activity.userSelectedTime || activity.scheduledTime,
      notes: activity.notes || '',
      completionNotes: activity.completionNotes || '',
      reminderEnabled: activity.reminderEnabled ?? false,
    };
  };

  return {
    isLoading,
    setIsLoading,
    loadActivitiesFromSupabase,
    loadActivitiesFromLocalStorage,
    migrateScheduledActivity,
  };
};
