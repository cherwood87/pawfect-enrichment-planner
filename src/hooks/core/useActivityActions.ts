
import { useCallback } from 'react';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityService } from '@/services/core/ActivityService';
import { useToast } from '@/hooks/use-toast';

export const useActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[] | ((prev: ScheduledActivity[]) => ScheduledActivity[])) => void,
  setUserActivities: (activities: UserActivity[] | ((prev: UserActivity[]) => UserActivity[])) => void,
  currentDog: Dog | null
) => {
  const { toast } = useToast();

  const addScheduledActivity = useCallback(async (activity: Omit<ScheduledActivity, 'id'>): Promise<void> => {
    if (!currentDog) {
      toast({
        title: "Error",
        description: "No dog selected",
        variant: "destructive"
      });
      return;
    }

    try {
      const newActivity = await ActivityService.createScheduledActivity({
        ...activity,
        dogId: currentDog.id
      });
      
      setScheduledActivities(prev => [...prev, newActivity]);
      
      toast({
        title: "Activity Scheduled",
        description: "Activity has been added to your schedule"
      });
    } catch (error) {
      console.error('Failed to add scheduled activity:', error);
      toast({
        title: "Error",
        description: "Failed to schedule activity",
        variant: "destructive"
      });
    }
  }, [currentDog, setScheduledActivities, toast]);

  const toggleActivityCompletion = useCallback(async (activityId: string, completionNotes?: string): Promise<void> => {
    if (!currentDog) return;

    try {
      const updatedActivity = await ActivityService.toggleActivityCompletion(
        activityId,
        currentDog.id,
        completionNotes
      );

      setScheduledActivities(prev => 
        prev.map(activity => 
          activity.id === activityId ? updatedActivity : activity
        )
      );

      toast({
        title: updatedActivity.completed ? "Activity Completed!" : "Activity Unmarked",
        description: updatedActivity.completed 
          ? "Great job completing this activity!" 
          : "Activity marked as incomplete"
      });
    } catch (error) {
      console.error('Failed to toggle activity completion:', error);
      toast({
        title: "Error",
        description: "Failed to update activity status",
        variant: "destructive"
      });
    }
  }, [currentDog, setScheduledActivities, toast]);

  const updateScheduledActivity = useCallback(async (activityId: string, updates: Partial<ScheduledActivity>): Promise<void> => {
    if (!currentDog) return;

    try {
      const updatedActivity = await ActivityService.updateScheduledActivity(
        activityId,
        currentDog.id,
        updates
      );

      setScheduledActivities(prev => 
        prev.map(activity => 
          activity.id === activityId ? updatedActivity : activity
        )
      );

      toast({
        title: "Activity Updated",
        description: "Activity has been successfully updated"
      });
    } catch (error) {
      console.error('Failed to update scheduled activity:', error);
      toast({
        title: "Error",
        description: "Failed to update activity",
        variant: "destructive"
      });
    }
  }, [currentDog, setScheduledActivities, toast]);

  const addUserActivity = useCallback(async (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>): Promise<void> => {
    if (!currentDog) {
      toast({
        title: "Error",
        description: "No dog selected",
        variant: "destructive"
      });
      return;
    }

    try {
      const newActivity = await ActivityService.createUserActivity(activity, currentDog.id);
      
      setUserActivities(prev => [...prev, newActivity]);
      
      toast({
        title: "Custom Activity Created",
        description: "Your custom activity has been saved"
      });
    } catch (error) {
      console.error('Failed to add user activity:', error);
      toast({
        title: "Error",
        description: "Failed to create custom activity",
        variant: "destructive"
      });
    }
  }, [currentDog, setUserActivities, toast]);

  return {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity
  };
};
