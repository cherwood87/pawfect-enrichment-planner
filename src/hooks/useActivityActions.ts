
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';

export const useActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[] | ((prev: ScheduledActivity[]) => ScheduledActivity[])) => void,
  setUserActivities: (activities: UserActivity[] | ((prev: UserActivity[]) => UserActivity[])) => void,
  currentDog: Dog | null
) => {
  const addScheduledActivity = (activity: Omit<ScheduledActivity, 'id' | 'dogId'>) => {
    if (!currentDog) return;
    
    const newActivity: ScheduledActivity = {
      ...activity,
      id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dogId: currentDog.id,
      // Ensure new fields have default values
      userSelectedTime: activity.userSelectedTime || activity.scheduledTime,
      notes: activity.notes || '',
      completionNotes: activity.completionNotes || '',
      reminderEnabled: activity.reminderEnabled ?? false
    };
    setScheduledActivities(prev => [...prev, newActivity]);
  };

  const toggleActivityCompletion = (activityId: string, completionNotes?: string) => {
    setScheduledActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { 
              ...activity, 
              completed: !activity.completed,
              completedAt: !activity.completed ? new Date().toISOString() : undefined,
              completionNotes: !activity.completed ? (completionNotes || '') : activity.completionNotes
            }
          : activity
      )
    );
  };

  const updateScheduledActivity = (activityId: string, updates: Partial<ScheduledActivity>) => {
    setScheduledActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, ...updates }
          : activity
      )
    );
  };

  const addUserActivity = (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>) => {
    if (!currentDog) return;
    
    const newActivity: UserActivity = {
      ...activity,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dogId: currentDog.id,
      createdAt: new Date().toISOString()
    };
    setUserActivities(prev => [...prev, newActivity]);
  };

  return {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity
  };
};
