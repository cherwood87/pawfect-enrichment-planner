import { useState } from 'react';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { getDiscoveredActivities } from '@/data/activityLibrary';
import { ContentDiscoveryService } from '@/services/ContentDiscoveryService';
import { ActivityService } from '@/services/activityService';
import { Dog } from '@/types/dog';

export const useActivityLoader = (currentDog: Dog | null) => {
  const [isLoading, setIsLoading] = useState(false);

  // Helper for migration: save discovered activities and config to Supabase
  const migrateDiscoveredActivitiesToSupabase = async (
    discoveredActivities: DiscoveredActivity[],
    dogId: string
  ) => {
    if (!discoveredActivities?.length) return;
    // Assumes ContentDiscoveryService.createDiscoveredActivities supports bulk insert
    try {
      await ContentDiscoveryService.createDiscoveredActivities(discoveredActivities, dogId);
    } catch (error) {
      console.error('Failed to migrate discovered activities to Supabase:', error);
    }
  };

  // Helper for migration: save config to Supabase
  const migrateDiscoveryConfigToSupabase = async (
    config: ContentDiscoveryConfig,
    dogId: string
  ) => {
    if (!config) return;
    try {
      await ContentDiscoveryService.saveDiscoveryConfig(config, dogId);
    } catch (error) {
      console.error('Failed to migrate discovery config to Supabase:', error);
    }
  };

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

      // Scheduled Activities
      const supabaseScheduledActivities = await ActivityService.getScheduledActivities(dogId);
      if (supabaseScheduledActivities.length > 0) {
        setScheduledActivities(supabaseScheduledActivities);
      } else {
        await loadAndMigrateScheduledActivities();
      }

      // User Activities
      const supabaseUserActivities = await ActivityService.getUserActivities(dogId);
      if (supabaseUserActivities.length > 0) {
        setUserActivities(supabaseUserActivities);
      } else {
        await loadAndMigrateUserActivities();
      }

      // Discovered Activities (MIGRATION: localStorage to Supabase)
      const savedDiscovered = getDiscoveredActivities(dogId);
      if (savedDiscovered && savedDiscovered.length > 0) {
        // Save to Supabase if not already there
        // For simplicity, always try migrate (idempotent)
        await migrateDiscoveredActivitiesToSupabase(savedDiscovered, dogId);
        setDiscoveredActivities(savedDiscovered);
      } else {
        // Try to load from Supabase
        const supabaseDiscovered = await ContentDiscoveryService.getDiscoveredActivities(dogId);
        setDiscoveredActivities(supabaseDiscovered ?? []);
      }

      // Discovery Config (MIGRATION: localStorage to Supabase)
      const savedConfig = localStorage.getItem(`discoveryConfig-${dogId}`);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        await migrateDiscoveryConfigToSupabase(config, dogId);
        setDiscoveryConfig(config);
      } else {
        const supabaseConfig = await ContentDiscoveryService.getDiscoveryConfig(dogId);
        if (supabaseConfig) setDiscoveryConfig(supabaseConfig);
      }

    } catch (error) {
      console.error('Error loading activities/discovery from Supabase:', error);
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
    const savedScheduled = localStorage.getItem(`scheduledActivities-${dog.id}`);
    const savedUser = localStorage.getItem(`userActivities-${dog.id}`);
    const savedDiscovered = getDiscoveredActivities(dog.id);

    if (savedScheduled) {
      const parsedActivities = JSON.parse(savedScheduled);
      const migratedActivities = parsedActivities.map(migrateScheduledActivity);
      setScheduledActivities(migratedActivities);
    } else {
      setScheduledActivities([]);
    }

    if (savedUser) {
      setUserActivities(JSON.parse(savedUser));
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