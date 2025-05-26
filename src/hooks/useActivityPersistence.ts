import { useEffect } from 'react';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';

export const useActivityPersistence = (
  currentDog: Dog | null,
  scheduledActivities: ScheduledActivity[],
  userActivities: UserActivity[],
  discoveredActivities: DiscoveredActivity[],
  isLoading: boolean
) => {
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
};
