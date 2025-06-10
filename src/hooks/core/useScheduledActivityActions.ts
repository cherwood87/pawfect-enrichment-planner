
import { useCallback } from 'react';
import { ScheduledActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityDomainService } from '@/services/domain/ActivityDomainService';
import { useToast } from '@/hooks/use-toast';
import { handleError, getUserFriendlyMessage } from '@/utils/errorUtils';
import { normalizeActivityData, DataValidator } from '@/utils/dataValidation';
import { useActivityValidation } from './useActivityValidation';
import { useActivityRefresh } from './useActivityRefresh';

/**
 * Hook for scheduled activity actions (create, update, toggle completion)
 */
export const useScheduledActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[] | ((prev: ScheduledActivity[]) => ScheduledActivity[])) => void,
  currentDog: Dog | null,
  existingScheduledActivities: ScheduledActivity[] = []
) => {
  const { toast } = useToast();
  const { validateScheduledActivity, validateActivityUpdate, validateCompletionNotes } = useActivityValidation();
  const { refreshScheduledActivities } = useActivityRefresh(setScheduledActivities, currentDog);

  const addScheduledActivity = useCallback(async (activity: Omit<ScheduledActivity, 'id'>): Promise<void> => {
    console.log('🎯 [useScheduledActivityActions] Starting addScheduledActivity with:', {
      activityId: activity.activityId,
      dogId: activity.dogId,
      scheduledDate: activity.scheduledDate,
      weekNumber: activity.weekNumber,
      dayOfWeek: activity.dayOfWeek,
      currentDog: currentDog?.name || 'None',
      existingActivitiesCount: existingScheduledActivities.length
    });

    const validation = validateScheduledActivity(activity, currentDog, existingScheduledActivities);
    if (!validation.isValid || !validation.normalizedActivity) {
      return;
    }

    try {
      console.log('💾 [useScheduledActivityActions] Creating scheduled activity via domain service...');
      const createdActivity = await ActivityDomainService.createScheduledActivity({
        ...validation.normalizedActivity,
        dogId: currentDog!.id,
        notes: validation.normalizedActivity.notes || '',
        completionNotes: validation.normalizedActivity.completionNotes || '',
        reminderEnabled: validation.normalizedActivity.reminderEnabled ?? false,
      } as Omit<ScheduledActivity, 'id'>);
      
      console.log('✅ [useScheduledActivityActions] Activity created successfully:', {
        createdId: createdActivity.id,
        activityId: createdActivity.activityId,
        scheduledDate: createdActivity.scheduledDate,
        weekNumber: createdActivity.weekNumber,
        dayOfWeek: createdActivity.dayOfWeek
      });
      
      console.log('🔄 [useScheduledActivityActions] Refreshing activities list...');
      await refreshScheduledActivities();
      
      toast({
        title: "Activity scheduled!",
        description: "Your activity has been added to the schedule",
        variant: "default"
      });
    } catch (error) {
      console.error('❌ [useScheduledActivityActions] Failed to create scheduled activity:', error);
      const userMessage = getUserFriendlyMessage(error);
      
      toast({
        title: "Failed to schedule activity",
        description: userMessage,
        variant: "destructive"
      });
      
      handleError(error as Error, 'addScheduledActivity', false);
    }
  }, [currentDog, existingScheduledActivities, validateScheduledActivity, refreshScheduledActivities, toast]);

  const toggleActivityCompletion = useCallback(async (activityId: string, completionNotes?: string): Promise<void> => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      throw new Error("No dog selected");
    }

    if (!validateCompletionNotes(completionNotes)) {
      throw new Error("Completion notes too long");
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
  }, [currentDog, validateCompletionNotes, refreshScheduledActivities, toast]);

  const updateScheduledActivity = useCallback(async (activityId: string, updates: Partial<ScheduledActivity>): Promise<void> => {
    if (!validateActivityUpdate(updates, currentDog)) {
      return;
    }

    // Normalize the updates
    const normalizedUpdates = normalizeActivityData(updates);
    
    try {
      await ActivityDomainService.updateScheduledActivity(activityId, currentDog!.id, normalizedUpdates);
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
  }, [currentDog, validateActivityUpdate, refreshScheduledActivities, toast]);

  return {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity
  };
};
