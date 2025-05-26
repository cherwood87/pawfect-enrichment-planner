
import { useState, useEffect } from 'react';
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
      
      // Load scheduled activities from Supabase
      const supabaseScheduledActivities = await ActivityService.getScheduledActivities(currentDog.id);
      if (supabaseScheduledActivities.length > 0) {
        setScheduledActivities(supabaseScheduledActivities);
      } else {
        // Fallback to localStorage and migrate if needed
        await loadAndMigrateScheduledActivities();
      }

      // Load user activities from Supabase
      const supabaseUserActivities = await ActivityService.getUserActivities(currentDog.id);
      if (supabaseUserActivities.length > 0) {
        setUserActivities(supabaseUserActivities);
      } else {
        // Fallback to localStorage and migrate if needed
        await loadAndMigrateUserActivities();
      }

      // Load discovered activities (still from localStorage for now)
      const savedDiscovered = getDiscoveredActivities(currentDog.id);
      setDiscoveredActivities(savedDiscovered || []);

      // Load discovery config
      const savedConfig = localStorage.getItem(`discoveryConfig-${currentDog.id}`);
      if (savedConfig) {
        setDiscoveryConfig(JSON.parse(savedConfig));
      }

    } catch (error) {
      console.error('Error loading activities from Supabase:', error);
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
      reminderEnabled: activity.reminderEnabled ?? false
    };
  };

  return {
    isLoading,
    setIsLoading,
    loadActivitiesFromSupabase,
    loadActivitiesFromLocalStorage,
    migrateScheduledActivity
  };
};
