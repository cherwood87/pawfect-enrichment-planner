
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
      
      

      // Execute all data loading operations in parallel for better performance
      const [
        scheduledResult,
        userActivitiesResult,
        discoveredActivitiesResult,
        configResult
      ] = await Promise.allSettled([
        // Scheduled Activities
        ActivityService.getScheduledActivities(dogId).catch(() => null),
        // User Activities
        ActivityService.getUserActivities(dogId).catch(() => null),
        // Discovered Activities: fetch from Supabase and merge with any local items, then dedupe
        (async () => {
          try {
            const [supabaseDiscovered, localDiscovered] = await Promise.all([
              ContentDiscoveryService.getDiscoveredActivities(dogId),
              Promise.resolve(getDiscoveredActivities(dogId) || [])
            ]);
            // De-duplicate by id and normalized title (prefer Supabase order)
            const seenIds = new Set<string>();
            const seenTitles = new Set<string>();
            const combined = [...supabaseDiscovered, ...localDiscovered];
            const unique: DiscoveredActivity[] = [];
            for (const item of combined) {
              const idKey = String(item.id);
              const titleKey = item.title.trim().toLowerCase();
              if (seenIds.has(idKey) || seenTitles.has(titleKey)) continue;
              seenIds.add(idKey);
              seenTitles.add(titleKey);
              unique.push(item);
            }
            return unique;
          } catch (error) {
            
            return getDiscoveredActivities(dogId) || [];
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
            
            return null;
          }
        })()
      ]);

      // Handle scheduled activities
      if (scheduledResult.status === 'fulfilled' && scheduledResult.value && scheduledResult.value.length > 0) {
        setScheduledActivities(scheduledResult.value);
      } else {
        await loadAndMigrateScheduledActivities();
      }

      // Handle user activities
      if (userActivitiesResult.status === 'fulfilled' && userActivitiesResult.value && userActivitiesResult.value.length > 0) {
        setUserActivities(userActivitiesResult.value);
      } else {
        await loadAndMigrateUserActivities();
      }

      // Handle discovered activities
      if (discoveredActivitiesResult.status === 'fulfilled') {
        const discoveredActivities = discoveredActivitiesResult.value || [];
        setDiscoveredActivities(discoveredActivities);
      }

      // Handle discovery config
      if (configResult.status === 'fulfilled' && configResult.value) {
        setDiscoveryConfig(configResult.value);
      }

    } catch (error) {
      console.error('❌ Critical error during activity loading:', error);
      // Fallback to localStorage
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
        setUserActivities(userActivities);
      } catch (error) {
        console.error('Error parsing user activities from localStorage:', error);
        setUserActivities([]);
      }
    } else {
      setUserActivities([]);
    }

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
