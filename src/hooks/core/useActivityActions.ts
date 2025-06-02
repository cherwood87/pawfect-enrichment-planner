
import { useCallback } from 'react';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityDomainService } from '@/services/domain/ActivityDomainService';
import { useToast } from '@/hooks/use-toast';
import { handleError, getUserFriendlyMessage } from '@/utils/errorUtils';
import { DataValidator, normalizeActivityData } from '@/utils/dataValidation';
import { DuplicateDetector } from '@/utils/duplicateDetection';
import { SchedulingValidator } from '@/utils/schedulingValidation';

/**
 * Comprehensive activity actions hook with enhanced validation, error handling, and duplicate prevention.
 */
export const useActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[] | ((prev: ScheduledActivity[]) => ScheduledActivity[])) => void,
  setUserActivities: (activities: UserActivity[] | ((prev: UserActivity[]) => UserActivity[])) => void,
  currentDog: Dog | null,
  existingScheduledActivities: ScheduledActivity[] = []
) => {
  const { toast } = useToast();

  // Refresh scheduled activities from the domain service
  const refreshScheduledActivities = useCallback(async () => {
    if (!currentDog) return;
    try {
      const activities = await ActivityDomainService.getScheduledActivitiesForDog(currentDog.id);
      setScheduledActivities(activities);
    } catch (error) {
      console.error('Failed to refresh scheduled activities:', error);
      handleError(error as Error, 'refreshScheduledActivities', false);
    }
  }, [currentDog, setScheduledActivities]);

  // Enhanced addScheduledActivity with comprehensive validation and duplicate prevention
  const addScheduledActivity = useCallback(async (activity: Omit<ScheduledActivity, 'id'>): Promise<void> => {
    console.log('Adding scheduled activity:', activity);
    console.log('Current dog:', currentDog);
    console.log('Existing activities count:', existingScheduledActivities.length);

    // Validate dog context first
    const dogValidation = SchedulingValidator.validateDogContext(currentDog);
    if (!dogValidation.isValid) {
      toast({
        title: "No dog selected",
        description: dogValidation.errors[0] || "Please select a dog first",
        variant: "destructive"
      });
      return;
    }

    // Normalize and validate the activity data
    const normalizedActivity = normalizeActivityData({
      ...activity,
      dogId: currentDog!.id,
    });

    console.log('Normalized activity:', normalizedActivity);

    // Comprehensive validation
    const validation = SchedulingValidator.validateScheduledActivity(normalizedActivity, currentDog);
    if (!validation.isValid) {
      console.error('Validation failed:', validation.errors);
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

    // Enhanced duplicate checking
    const duplicateCheck = DuplicateDetector.performComprehensiveCheck(
      normalizedActivity as ScheduledActivity, 
      existingScheduledActivities,
      { maxPerDay: 5 }
    );

    if (duplicateCheck.isDuplicate) {
      console.warn('Duplicate activity detected:', duplicateCheck);
      toast({
        title: "Activity Already Scheduled",
        description: duplicateCheck.message || "This activity is already scheduled",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Creating scheduled activity in domain service...');
      await ActivityDomainService.createScheduledActivity({
        ...normalizedActivity,
        dogId: currentDog!.id,
        notes: normalizedActivity.notes || '',
        completionNotes: normalizedActivity.completionNotes || '',
        reminderEnabled: normalizedActivity.reminderEnabled ?? false,
      } as Omit<ScheduledActivity, 'id'>);
      
      console.log('Activity created successfully, refreshing activities...');
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
  }, [currentDog, existingScheduledActivities, refreshScheduledActivities, toast]);

  const toggleActivityCompletion = useCallback(async (activityId: string, completionNotes?: string): Promise<void> => {
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
  }, [currentDog, refreshScheduledActivities, toast]);

  const updateScheduledActivity = useCallback(async (activityId: string, updates: Partial<ScheduledActivity>): Promise<void> => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }

    // Validate updates if they include scheduling changes
    if (updates.scheduledDate || updates.weekNumber !== undefined || updates.dayOfWeek !== undefined) {
      const validation = SchedulingValidator.validateScheduledActivity(updates, currentDog);
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.errors.join(', '),
          variant: "destructive"
        });
        return;
      }
    }

    // Normalize the updates
    const normalizedUpdates = normalizeActivityData(updates);
    
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
  }, [currentDog, refreshScheduledActivities, toast]);

  const addUserActivity = useCallback(async (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>): Promise<void> => {
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
  }, [currentDog, toast]);

  return {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity,
  };
};
