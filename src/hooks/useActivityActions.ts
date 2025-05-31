
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityDomainService } from '@/services/domain/ActivityDomainService';
import { useToast } from '@/hooks/use-toast';
import { handleError, getUserFriendlyMessage } from '@/utils/errorUtils';
import { DataValidator, checkForDuplicates, normalizeActivityData } from '@/utils/dataValidation';

/**
 * Custom hook for activity actions with comprehensive validation and error handling.
 * All mutations are handled through the domain service layer with enhanced data integrity.
 */
export const useActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[]) => void,
  setUserActivities: (activities: UserActivity[]) => void,
  currentDog: Dog | null,
  existingScheduledActivities: ScheduledActivity[] = []
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

  const addScheduledActivity = async (activity: Omit<ScheduledActivity, 'id'>) => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }

    // Normalize and validate the activity data
    const normalizedActivity = normalizeActivityData({
      ...activity,
      dogId: currentDog.id,
    });

    const validation = DataValidator.validateScheduledActivity(normalizedActivity);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Activity validation warnings:', validation.warnings);
      toast({
        title: "Warning",
        description: validation.warnings[0],
        variant: "default"
      });
    }

    // Check for duplicates
    if (checkForDuplicates(normalizedActivity as ScheduledActivity, existingScheduledActivities)) {
      toast({
        title: "Duplicate Activity",
        description: "This activity is already scheduled for this date",
        variant: "destructive"
      });
      return;
    }

    try {
      await ActivityDomainService.createScheduledActivity({
        ...normalizedActivity,
        dogId: currentDog.id,
        notes: normalizedActivity.notes || '',
        completionNotes: normalizedActivity.completionNotes || '',
        reminderEnabled: normalizedActivity.reminderEnabled ?? false,
      } as Omit<ScheduledActivity, 'id'>);
      
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

  const toggleActivityCompletion = async (activityId: string, completionNotes?: string): Promise<void> => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      throw new Error("No dog selected");
    }

    // Validate completion notes if provided
    if (completionNotes) {
      const sanitizedNotes = DataValidator.sanitizeInput(completionNotes);
      if (sanitizedNotes.length > 1000) {
        toast({
          title: "Validation Error",
          description: "Completion notes are too long (max 1000 characters)",
          variant: "destructive"
        });
        throw new Error("Completion notes too long");
      }
    }
    
    try {
      await ActivityDomainService.toggleActivityCompletion(
        activityId, 
        currentDog.id, 
        completionNotes ? DataValidator.sanitizeInput(completionNotes) : undefined
      );
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

    // Normalize and validate the updates
    const normalizedUpdates = normalizeActivityData(updates);
    const validation = DataValidator.validateScheduledActivity(normalizedUpdates);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Activity update warnings:', validation.warnings);
    }
    
    try {
      await ActivityDomainService.updateScheduledActivity(activityId, currentDog.id, normalizedUpdates);
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

    // Validate the user activity
    const validation = DataValidator.validateUserActivity(activity);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      console.warn('User activity warnings:', validation.warnings);
      toast({
        title: "Warning",
        description: validation.warnings[0],
        variant: "default"
      });
    }

    // Sanitize string fields
    const sanitizedActivity = {
      ...activity,
      title: DataValidator.sanitizeInput(activity.title),
      benefits: activity.benefits ? DataValidator.sanitizeInput(activity.benefits) : activity.benefits,
      instructions: activity.instructions ? activity.instructions.map(instruction => 
        DataValidator.sanitizeInput(instruction)
      ) : activity.instructions,
      materials: activity.materials ? activity.materials.map(material => 
        DataValidator.sanitizeInput(material)
      ) : activity.materials
    };

    try {
      await ActivityDomainService.createUserActivity(sanitizedActivity, currentDog.id);
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
