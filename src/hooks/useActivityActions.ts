
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityService } from '@/services/activityService';

export const useActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[] | ((prev: ScheduledActivity[]) => ScheduledActivity[])) => void,
  setUserActivities: (activities: UserActivity[] | ((prev: UserActivity[]) => UserActivity[])) => void,
  currentDog: Dog | null
) => {
  const addScheduledActivity = async (activity: Omit<ScheduledActivity, 'id' | 'dogId'>) => {
    if (!currentDog) return;
    
    const newActivity: ScheduledActivity = {
      ...activity,
      id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dogId: currentDog.id,
      userSelectedTime: activity.userSelectedTime || activity.scheduledTime,
      notes: activity.notes || '',
      completionNotes: activity.completionNotes || '',
      reminderEnabled: activity.reminderEnabled ?? false
    };

    // Optimistically update the UI
    setScheduledActivities(prev => [...prev, newActivity]);

    // Sync to Supabase in background
    try {
      const savedActivity = await ActivityService.createScheduledActivity(newActivity);
      // Update with the actual Supabase ID
      setScheduledActivities(prev => 
        prev.map(a => a.id === newActivity.id ? savedActivity : a)
      );
    } catch (error) {
      console.error('Failed to save scheduled activity to Supabase:', error);
      // Activity is still saved locally, so user doesn't lose work
    }
  };

  const toggleActivityCompletion = async (activityId: string, completionNotes?: string) => {
    setScheduledActivities(prev => {
      const updatedActivities = prev.map(activity => {
        if (activity.id === activityId) {
          const updatedActivity = { 
            ...activity, 
            completed: !activity.completed,
            completedAt: !activity.completed ? new Date().toISOString() : undefined,
            completionNotes: !activity.completed ? (completionNotes || '') : activity.completionNotes
          };

          // Sync to Supabase in background
          ActivityService.updateScheduledActivity(updatedActivity).catch(error => {
            console.error('Failed to update activity in Supabase:', error);
          });

          return updatedActivity;
        }
        return activity;
      });
      
      return updatedActivities;
    });
  };

  const updateScheduledActivity = async (activityId: string, updates: Partial<ScheduledActivity>) => {
    setScheduledActivities(prev => {
      const updatedActivities = prev.map(activity => {
        if (activity.id === activityId) {
          const updatedActivity = { ...activity, ...updates };

          // Sync to Supabase in background
          ActivityService.updateScheduledActivity(updatedActivity).catch(error => {
            console.error('Failed to update activity in Supabase:', error);
          });

          return updatedActivity;
        }
        return activity;
      });
      
      return updatedActivities;
    });
  };

  const addUserActivity = async (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>) => {
    if (!currentDog) return;
    
    const newActivity: UserActivity = {
      ...activity,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dogId: currentDog.id,
      createdAt: new Date().toISOString()
    };

    // Optimistically update the UI
    setUserActivities(prev => [...prev, newActivity]);

    // Sync to Supabase in background
    try {
      const savedActivity = await ActivityService.createUserActivity(newActivity);
      // Update with the actual Supabase ID
      setUserActivities(prev => 
        prev.map(a => a.id === newActivity.id ? savedActivity : a)
      );
    } catch (error) {
      console.error('Failed to save user activity to Supabase:', error);
      // Activity is still saved locally, so user doesn't lose work
    }
  };

  return {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity
  };
};
