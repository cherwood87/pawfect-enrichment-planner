
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
      
      console.log('🔄 Loading activities from Supabase for dog:', currentDog.name);

      // Scheduled Activities with improved error handling
      try {
        const supabaseScheduledActivities = await ActivityService.getScheduledActivities(dogId);
        console.log('📅 Loaded scheduled activities from Supabase:', supabaseScheduledActivities.length);
        
        if (supabaseScheduledActivities.length > 0) {
          setScheduledActivities(supabaseScheduledActivities);
        } else {
          console.log('📅 No scheduled activities in Supabase, migrating from localStorage...');
          await loadAndMigrateScheduledActivities();
        }
      } catch (error) {
        console.error('❌ Error loading scheduled activities from Supabase:', error);
        console.log('📅 Falling back to localStorage migration...');
        await loadAndMigrateScheduledActivities();
      }

      // User Activities with improved error handling
      try {
        const supabaseUserActivities = await ActivityService.getUserActivities(dogId);
        console.log('👤 Loaded user activities from Supabase:', supabaseUserActivities.length);
        
        if (supabaseUserActivities.length > 0) {
          setUserActivities(supabaseUserActivities);
        } else {
          console.log('👤 No user activities in Supabase, migrating from localStorage...');
          await loadAndMigrateUserActivities();
        }
      } catch (error) {
        console.error('❌ Error loading user activities from Supabase:', error);
        console.log('👤 Falling back to localStorage migration...');
        await loadAndMigrateUserActivities();
      }

      // Discovered Activities (MIGRATION: localStorage to Supabase)
      try {
        const savedDiscovered = getDiscoveredActivities(dogId);
        if (savedDiscovered && savedDiscovered.length > 0) {
          console.log('🔍 Found discovered activities in localStorage, migrating...');
          await migrateDiscoveredActivitiesToSupabase(savedDiscovered, dogId);
          setDiscoveredActivities(savedDiscovered);
        } else {
          // Try to load from Supabase
          const supabaseDiscovered = await ContentDiscoveryService.getDiscoveredActivities(dogId);
          setDiscoveredActivities(supabaseDiscovered ?? []);
        }
      } catch (error) {
        console.error('❌ Error handling discovered activities:', error);
        setDiscoveredActivities([]);
      }

      // Discovery Config (MIGRATION: localStorage to Supabase)
      try {
        const savedConfig = localStorage.getItem(`discoveryConfig-${dogId}`);
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          console.log('⚙️ Found discovery config in localStorage, migrating...');
          await migrateDiscoveryConfigToSupabase(config, dogId);
          setDiscoveryConfig(config);
        } else {
          const supabaseConfig = await ContentDiscoveryService.getDiscoveryConfig(dogId);
          if (supabaseConfig) setDiscoveryConfig(supabaseConfig);
        }
      } catch (error) {
        console.error('❌ Error handling discovery config:', error);
        // Continue with default config
      }

      console.log('✅ Successfully completed activity loading for dog:', currentDog.name);

    } catch (error) {
      console.error('❌ Critical error during activity loading:', error);
      // Fallback to localStorage
      console.log('🔄 Falling back to pure localStorage loading...');
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
    
    const savedScheduled = localStorage.getItem(`scheduledActivities-${dog.id}`);
    const savedUser = localStorage.getItem(`userActivities-${dog.id}`);
    const savedDiscovered = getDiscoveredActivities(dog.id);

    if (savedScheduled) {
      const parsedActivities = JSON.parse(savedScheduled);
      const migratedActivities = parsedActivities.map(migrateScheduledActivity);
      console.log('📅 Loaded scheduled activities from localStorage:', migratedActivities.length);
      setScheduledActivities(migratedActivities);
    } else {
      setScheduledActivities([]);
    }

    if (savedUser) {
      const userActivities = JSON.parse(savedUser);
      console.log('👤 Loaded user activities from localStorage:', userActivities.length);
      setUserActivities(userActivities);
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
