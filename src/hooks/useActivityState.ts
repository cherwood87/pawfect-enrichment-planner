import { useState, useEffect } from 'react';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { getDiscoveredActivities } from '@/data/activityLibrary';
import { ContentDiscoveryService } from '@/services/ContentDiscoveryService';
import { ActivityService } from '@/services/activityService';
import { Dog } from '@/types/dog';

export const useActivityState = (currentDog: Dog | null) => {
  const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [discoveredActivities, setDiscoveredActivities] = useState<DiscoveredActivity[]>([]);
  const [discoveryConfig, setDiscoveryConfig] = useState<ContentDiscoveryConfig>(
    ContentDiscoveryService.getDefaultConfig()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load dog-specific data from Supabase with localStorage fallback
  useEffect(() => {
    if (!currentDog) {
      setScheduledActivities([]);
      setUserActivities([]);
      setDiscoveredActivities([]);
      return;
    }

    loadActivitiesFromSupabase();
  }, [currentDog]);

  const loadActivitiesFromSupabase = async () => {
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
      loadActivitiesFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadAndMigrateScheduledActivities = async () => {
    if (!currentDog) return;

    const savedScheduled = localStorage.getItem(`scheduledActivities-${currentDog.id}`);
    if (savedScheduled) {
      const parsedActivities = JSON.parse(savedScheduled);
      const migratedActivities = parsedActivities.map(migrateScheduledActivity);
      setScheduledActivities(migratedActivities);
      
      // Migrate to Supabase in background
      try {
        await ActivityService.migrateScheduledActivitiesFromLocalStorage(currentDog.id);
        console.log('Scheduled activities migrated to Supabase');
      } catch (error) {
        console.error('Failed to migrate scheduled activities:', error);
      }
    } else {
      // Initialize with default activities for new dogs
      const defaultActivities: ScheduledActivity[] = [
        {
          id: 'scheduled-1',
          dogId: currentDog.id,
          activityId: 'physical-morning-walk',
          scheduledTime: '8:00 AM',
          userSelectedTime: '8:00 AM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false,
          notes: '',
          completionNotes: '',
          reminderEnabled: false
        },
        {
          id: 'scheduled-2',
          dogId: currentDog.id,
          activityId: 'mental-puzzle-feeder',
          scheduledTime: '12:00 PM',
          userSelectedTime: '12:00 PM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false,
          notes: '',
          completionNotes: '',
          reminderEnabled: false
        },
        {
          id: 'scheduled-3',
          dogId: currentDog.id,
          activityId: 'environmental-new-route',
          scheduledTime: '3:00 PM',
          userSelectedTime: '3:00 PM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false,
          notes: '',
          completionNotes: '',
          reminderEnabled: false
        }
      ];
      setScheduledActivities(defaultActivities);
    }
  };

  const loadAndMigrateUserActivities = async () => {
    if (!currentDog) return;

    const savedUser = localStorage.getItem(`userActivities-${currentDog.id}`);
    if (savedUser) {
      const parsedActivities = JSON.parse(savedUser);
      setUserActivities(parsedActivities);
      
      // Migrate to Supabase in background
      try {
        await ActivityService.migrateUserActivitiesFromLocalStorage(currentDog.id);
        console.log('User activities migrated to Supabase');
      } catch (error) {
        console.error('Failed to migrate user activities:', error);
      }
    } else {
      setUserActivities([]);
    }
  };

  const loadActivitiesFromLocalStorage = () => {
    if (!currentDog) return;

    const savedScheduled = localStorage.getItem(`scheduledActivities-${currentDog.id}`);
    const savedUser = localStorage.getItem(`userActivities-${currentDog.id}`);
    const savedDiscovered = getDiscoveredActivities(currentDog.id);
    
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

  // Save to localStorage for backup (keeping existing behavior)
  useEffect(() => {
    if (currentDog && scheduledActivities.length >= 0 && !isLoading) {
      localStorage.setItem(`scheduledActivities-${currentDog.id}`, JSON.stringify(scheduledActivities));
    }
  }, [scheduledActivities, currentDog, isLoading]);

  useEffect(() => {
    if (currentDog && userActivities.length >= 0 && !isLoading) {
      localStorage.setItem(`userActivities-${currentDog.id}`, JSON.stringify(userActivities));
    }
  }, [userActivities, currentDog, isLoading]);

  useEffect(() => {
    if (currentDog && discoveredActivities.length >= 0) {
      localStorage.setItem(`discoveredActivities-${currentDog.id}`, JSON.stringify(discoveredActivities));
    }
  }, [discoveredActivities, currentDog]);

  return {
    scheduledActivities,
    userActivities,
    discoveredActivities,
    discoveryConfig,
    setScheduledActivities,
    setUserActivities,
    setDiscoveredActivities,
    setDiscoveryConfig,
    isLoading
  };
};
