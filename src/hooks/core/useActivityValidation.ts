
import { useCallback } from 'react';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { useToast } from '@/hooks/use-toast';
import { DataValidator, normalizeActivityData } from '@/utils/dataValidation';
import { DuplicateDetector } from '@/utils/duplicateDetection';
import { SchedulingValidator } from '@/utils/schedulingValidation';

/**
 * Hook for validating activities before creation/updates
 */
export const useActivityValidation = () => {
  const { toast } = useToast();

  const validateScheduledActivity = useCallback((
    activity: Omit<ScheduledActivity, 'id'>,
    currentDog: Dog | null,
    existingActivities: ScheduledActivity[] = []
  ): { isValid: boolean; normalizedActivity?: ScheduledActivity } => {
    console.log('🔍 [useActivityValidation] Validating scheduled activity:', {
      activityId: activity.activityId,
      dogId: activity.dogId,
      scheduledDate: activity.scheduledDate
    });

    // Validate dog context first
    const dogValidation = SchedulingValidator.validateDogContext(currentDog);
    if (!dogValidation.isValid) {
      console.error('❌ [useActivityValidation] Dog validation failed:', dogValidation.errors);
      toast({
        title: "No dog selected",
        description: dogValidation.errors[0] || "Please select a dog first",
        variant: "destructive"
      });
      return { isValid: false };
    }

    // Normalize and validate the activity data
    const normalizedActivity = normalizeActivityData({
      ...activity,
      dogId: currentDog!.id,
    });

    console.log('📋 [useActivityValidation] Normalized activity data:', normalizedActivity);

    // Comprehensive validation
    const validation = SchedulingValidator.validateScheduledActivity(normalizedActivity, currentDog);
    if (!validation.isValid) {
      console.error('❌ [useActivityValidation] Activity validation failed:', validation.errors);
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return { isValid: false };
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      console.warn('⚠️ [useActivityValidation] Activity validation warnings:', validation.warnings);
      toast({
        title: "Warning",
        description: validation.warnings[0],
        variant: "default"
      });
    }

    // Enhanced duplicate checking
    const duplicateCheck = DuplicateDetector.performComprehensiveCheck(
      normalizedActivity as ScheduledActivity, 
      existingActivities,
      { maxPerDay: 5 }
    );

    if (duplicateCheck.isDuplicate) {
      console.warn('⚠️ [useActivityValidation] Duplicate activity detected:', duplicateCheck);
      toast({
        title: "Activity Already Scheduled",
        description: duplicateCheck.message || "This activity is already scheduled",
        variant: "destructive"
      });
      return { isValid: false };
    }

    return { isValid: true, normalizedActivity: normalizedActivity as ScheduledActivity };
  }, [toast]);

  const validateUserActivity = useCallback((
    activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>,
    currentDog: Dog | null
  ): { isValid: boolean; sanitizedActivity?: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'> } => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return { isValid: false };
    }

    // Validate the user activity
    const validation = DataValidator.validateUserActivity(activity);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return { isValid: false };
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

    return { isValid: true, sanitizedActivity };
  }, [currentDog, toast]);

  const validateActivityUpdate = useCallback((
    updates: Partial<ScheduledActivity>,
    currentDog: Dog | null
  ): boolean => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return false;
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
        return false;
      }
    }

    return true;
  }, [currentDog, toast]);

  const validateCompletionNotes = useCallback((completionNotes?: string): boolean => {
    if (completionNotes) {
      const sanitizedNotes = DataValidator.sanitizeInput(completionNotes);
      if (sanitizedNotes.length > 1000) {
        toast({
          title: "Validation Error",
          description: "Completion notes are too long (max 1000 characters)",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  }, [toast]);

  return {
    validateScheduledActivity,
    validateUserActivity,
    validateActivityUpdate,
    validateCompletionNotes
  };
};
