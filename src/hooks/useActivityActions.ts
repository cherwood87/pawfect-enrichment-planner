
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityDomainService } from '@/services/domain/ActivityDomainService';
import { useToast } from '@/hooks/use-toast';
import { handleError, getUserFriendlyMessage } from '@/utils/errorUtils';

/**
 * Custom hook for activity actions, using the new domain service architecture.
 * All mutations are handled through the domain service layer with enhanced error handling.
 */
export const useActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[]) => void,
  setUserActivities: (activities: UserActivity[]) => void,
  currentDog: Dog | null
) => {
  const { toast } = useToast();

  // Refresh scheduled activities from the domain service
  const refreshScheduledActivities = async () => {
    if (!currentDog) return;
    try {
      const activities = await ActivityDomainService.getScheduledActivitiesForDog(currentDog.id);
      setScheduledActivities(activities);
    } catch (error) {
      console.error('Failed to refresh scheduled activities:', error);
      handleError(error as Error, 'refreshScheduledActivities', false);
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
      handleError(error as Error, 'refreshUserActivities', false);
    }
  };

  // Validate activity data before submission
  const validateScheduledActivity = (activity: Omit<ScheduledActivity, 'id'>): string[] => {
    const errors: string[] = [];
    
    if (!activity.activityId?.trim()) {
      errors.push('Activity ID is required');
    }
    
    if (!activity.scheduledDate) {
      errors.push('Scheduled date is required');
    }
    
    if (!activity.dogId?.trim()) {
      errors.push('Dog ID is required');
    }

    // Check for duplicate scheduling
    const isDuplicate = false; // This would be implemented with actual duplicate detection
    if (isDuplicate) {
      errors.push('This activity is already scheduled for this date');
    }
    
    return errors;
  };

  const addScheduledActivity = async (activity: Omit<ScheduledActivity, 'id'>) => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }

    // Client-side validation
    const validationErrors = validateScheduledActivity(activity);
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(', '),
        variant: "destructive"
      });
      return;
    }

    try {
      await ActivityDomainService.createScheduledActivity({
        ...activity,
        dogId: currentDog.id,
        notes: activity.notes || '',
        completionNotes: activity.completionNotes || '',
        reminderEnabled: activity.reminderEnabled ?? false,
      });
      
      await refreshScheduledActivities();
      
      toast({
        title: "Activity scheduled!",
        description: "Your activity has been added to the schedule",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to create scheduled activity:', error);
      const userMessage = getUserFriendlyMessage(error);
      
      toast({
        title: "Failed to schedule activity",
        description: userMessage,
        variant: "destructive"
      });
      
      handleError(error as Error, 'addScheduledActivity', false);
    }
  };

  const toggleActivityCompletion = async (activityId: string, completionNotes?: string) => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await ActivityDomainService.toggleActivityCompletion(activityId, currentDog.id, completionNotes);
      await refreshScheduledActivities();
    } catch (error) {
      console.error('Failed to toggle activity completion:', error);
      const userMessage = getUserFriendlyMessage(error);
      
      // Re-throw the error so the calling component can handle optimistic updates
      throw new Error(userMessage);
    }
  };

  const updateScheduledActivity = async (activityId: string, updates: Partial<ScheduledActivity>) => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await ActivityDomainService.updateScheduledActivity(activityId, currentDog.id, updates);
      await refreshScheduledActivities();
      
      toast({
        title: "Activity updated",
        description: "Your changes have been saved",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to update scheduled activity:', error);
      const userMessage = getUserFriendlyMessage(error);
      
      toast({
        title: "Update failed",
        description: userMessage,
        variant: "destructive"
      });
      
      handleError(error as Error, 'updateScheduledActivity', false);
    }
  };

  const addUserActivity = async (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>) => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }

    try {
      await ActivityDomainService.createUserActivity(activity, currentDog.id);
      await refreshUserActivities();
      
      toast({
        title: "Custom activity created!",
        description: "Your custom activity has been added",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to create user activity:', error);
      const userMessage = getUserFriendlyMessage(error);
      
      toast({
        title: "Failed to create activity",
        description: userMessage,
        variant: "destructive"
      });
      
      handleError(error as Error, 'addUserActivity', false);
    }
  };

  return {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity,
  };
};
