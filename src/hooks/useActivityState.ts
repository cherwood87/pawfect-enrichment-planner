
import { useState, useEffect } from 'react';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { getDiscoveredActivities } from '@/data/activityLibrary';
import { ContentDiscoveryService } from '@/services/ContentDiscoveryService';
import { Dog } from '@/types/dog';

export const useActivityState = (currentDog: Dog | null) => {
  const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [discoveredActivities, setDiscoveredActivities] = useState<DiscoveredActivity[]>([]);
  const [discoveryConfig, setDiscoveryConfig] = useState<ContentDiscoveryConfig>(
    ContentDiscoveryService.getDefaultConfig()
  );

  // Migration helper function to ensure backward compatibility
  const migrateScheduledActivity = (activity: any): ScheduledActivity => {
    return {
      ...activity,
      // Ensure new fields have default values if they don't exist
      userSelectedTime: activity.userSelectedTime || activity.scheduledTime,
      notes: activity.notes || '',
      completionNotes: activity.completionNotes || '',
      reminderEnabled: activity.reminderEnabled ?? false
    };
  };

  // Load dog-specific data from localStorage with migration
  useEffect(() => {
    if (!currentDog) {
      setScheduledActivities([]);
      setUserActivities([]);
      setDiscoveredActivities([]);
      return;
    }

    const savedScheduled = localStorage.getItem(`scheduledActivities-${currentDog.id}`);
    const savedUser = localStorage.getItem(`userActivities-${currentDog.id}`);
    const savedDiscovered = getDiscoveredActivities(currentDog.id);
    
    if (savedScheduled) {
      const parsedActivities = JSON.parse(savedScheduled);
      // Migrate existing data to include new fields
      const migratedActivities = parsedActivities.map(migrateScheduledActivity);
      setScheduledActivities(migratedActivities);
    } else {
      // Initialize with some default activities for new dogs
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
    
    if (savedUser) {
      setUserActivities(JSON.parse(savedUser));
    } else {
      setUserActivities([]);
    }
    
    if (savedDiscovered) {
      setDiscoveredActivities(savedDiscovered);
    } else {
      setDiscoveredActivities([]);
    }
  }, [currentDog]);

  // Load discovered activities for current dog
  useEffect(() => {
    if (!currentDog) {
      setDiscoveredActivities([]);
      return;
    }

    const discovered = getDiscoveredActivities(currentDog.id);
    setDiscoveredActivities(discovered);

    // Load discovery config
    const savedConfig = localStorage.getItem(`discoveryConfig-${currentDog.id}`);
    if (savedConfig) {
      setDiscoveryConfig(JSON.parse(savedConfig));
    }
  }, [currentDog]);

  // Save dog-specific data to localStorage
  useEffect(() => {
    if (currentDog && scheduledActivities.length >= 0) {
      localStorage.setItem(`scheduledActivities-${currentDog.id}`, JSON.stringify(scheduledActivities));
    }
  }, [scheduledActivities, currentDog]);

  useEffect(() => {
    if (currentDog && userActivities.length >= 0) {
      localStorage.setItem(`userActivities-${currentDog.id}`, JSON.stringify(userActivities));
    }
  }, [userActivities, currentDog]);

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
    setDiscoveryConfig
  };
};
