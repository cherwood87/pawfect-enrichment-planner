
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityDomainService } from '@/services/domain/ActivityDomainService';

/**
 * Custom hook for activity actions, using the new domain service architecture.
 * All mutations are handled through the domain service layer.
 */
export const useActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[]) => void,
  setUserActivities: (activities: UserActivity[]) => void,
  currentDog: Dog | null
) => {
  // Refresh scheduled activities from the domain service
  const refreshScheduledActivities = async () => {
    if (!currentDog) return;
    try {
      const activities = await ActivityDomainService.getScheduledActivitiesForDog(currentDog.id);
      setScheduledActivities(activities);
    } catch (error) {
      console.error('Failed to refresh scheduled activities:', error);
    }
  };

  // Refresh user activities from the domain service
  const refreshUserActivities = async () => {
    if (!currentDog) return;
    try {
      // This will need to be implemented in the domain service
      console.log('User activities refresh will be implemented through domain service');
    } catch (error) {
      console.error('Failed to refresh user activities:', error);
    }
  };

  const addScheduledActivity = async (activity: Omit<ScheduledActivity, 'id'>) => {
    if (!currentDog) return;

    try {
      await ActivityDomainService.createScheduledActivity({
        ...activity,
        dogId: currentDog.id,
        notes: activity.notes || '',
        completionNotes: activity.completionNotes || '',
        reminderEnabled: activity.reminderEnabled ?? false,
      });
      await refreshScheduledActivities();
    } catch (error) {
      console.error('Failed to create scheduled activity:', error);
    }
  };

  const toggleActivityCompletion = async (activityId: string, completionNotes?: string) => {
    if (!currentDog) return;
    
    try {
      await ActivityDomainService.toggleActivityCompletion(activityId, currentDog.id, completionNotes);
      await refreshScheduledActivities();
    } catch (error) {
      console.error('Failed to toggle activity completion:', error);
    }
  };

  const updateScheduledActivity = async (activityId: string, updates: Partial<ScheduledActivity>) => {
    if (!currentDog) return;
    
    try {
      await ActivityDomainService.updateScheduledActivity(activityId, currentDog.id, updates);
      await refreshScheduledActivities();
    } catch (error) {
      console.error('Failed to update scheduled activity:', error);
    }
  };

  const addUserActivity = async (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>) => {
    if (!currentDog) return;

    try {
      await ActivityDomainService.createUserActivity(activity, currentDog.id);
      await refreshUserActivities();
    } catch (error) {
      console.error('Failed to create user activity:', error);
    }
  };

  return {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity,
  };
};
