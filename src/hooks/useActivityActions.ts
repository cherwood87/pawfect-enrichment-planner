import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityService } from '@/services/activityService';

/**
 * Custom hook for activity actions, fully synced with Supabase.
 * All mutations are persisted remotely and UI state is refreshed after each change.
 */
export const useActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[]) => void,
  setUserActivities: (activities: UserActivity[]) => void,
  currentDog: Dog | null
) => {
  // Refresh scheduled activities from Supabase for the current dog
  const refreshScheduledActivities = async () => {
    if (!currentDog) return;
    try {
      const activities = await ActivityService.getScheduledActivities(currentDog.id);
      setScheduledActivities(activities);
    } catch (error) {
      console.error('Failed to refresh scheduled activities from Supabase:', error);
    }
  };

  // Refresh user activities from Supabase for the current dog
  const refreshUserActivities = async () => {
    if (!currentDog) return;
    try {
      const activities = await ActivityService.getUserActivities(currentDog.id);
      setUserActivities(activities);
    } catch (error) {
      console.error('Failed to refresh user activities from Supabase:', error);
    }
  };

  const addScheduledActivity = async (activity: Omit<ScheduledActivity, 'id' | 'dogId'>) => {
    if (!currentDog) return;

    // Optionally, you could show an optimistic update here, but we will refresh from backend after saving.
    const newActivity: ScheduledActivity = {
      ...activity,
      id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dogId: currentDog.id,
      userSelectedTime: activity.userSelectedTime || activity.scheduledTime,
      notes: activity.notes || '',
      completionNotes: activity.completionNotes || '',
      reminderEnabled: activity.reminderEnabled ?? false,
    };

    try {
      await ActivityService.createScheduledActivity(newActivity);
      await refreshScheduledActivities();
    } catch (error) {
      console.error('Failed to save scheduled activity to Supabase:', error);
    }
  };

  const toggleActivityCompletion = async (activityId: string, completionNotes?: string) => {
    if (!currentDog) return;
    try {
      // Fetch current activities from backend to ensure we have the latest
      const activities = await ActivityService.getScheduledActivities(currentDog.id);
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      const updatedActivity: ScheduledActivity = {
        ...activity,
        completed: !activity.completed,
        completedAt: !activity.completed ? new Date().toISOString() : undefined,
        completionNotes: !activity.completed ? (completionNotes || '') : activity.completionNotes,
      };

      await ActivityService.updateScheduledActivity(updatedActivity);
      await refreshScheduledActivities();
    } catch (error) {
      console.error('Failed to update activity in Supabase:', error);
    }
  };

  const updateScheduledActivity = async (activityId: string, updates: Partial<ScheduledActivity>) => {
    if (!currentDog) return;
    try {
      // Fetch current activities from backend to ensure we have the latest
      const activities = await ActivityService.getScheduledActivities(currentDog.id);
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      const updatedActivity = { ...activity, ...updates };

      await ActivityService.updateScheduledActivity(updatedActivity);
      await refreshScheduledActivities();
    } catch (error) {
      console.error('Failed to update activity in Supabase:', error);
    }
  };

  const addUserActivity = async (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>) => {
    if (!currentDog) return;

    const newActivity: UserActivity = {
      ...activity,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dogId: currentDog.id,
      createdAt: new Date().toISOString(),
    };

    try {
      await ActivityService.createUserActivity(newActivity);
      await refreshUserActivities();
    } catch (error) {
      console.error('Failed to save user activity to Supabase:', error);
    }
  };

  return {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity,
  };
};