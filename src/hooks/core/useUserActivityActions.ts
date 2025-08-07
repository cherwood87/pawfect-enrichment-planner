
import { useCallback } from 'react';
import { UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityDomainService } from '@/services/domain/ActivityDomainService';
import { useToast } from '@/hooks/use-toast';
import { handleError, getUserFriendlyMessage } from '@/utils/errorUtils';
import { useActivityValidation } from './useActivityValidation';

/**
 * Hook for user/custom activity actions (create)
 */
export const useUserActivityActions = (currentDog: Dog | null) => {
  const { toast } = useToast();
  const { validateUserActivity } = useActivityValidation();

  const addUserActivity = useCallback(async (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>): Promise<void> => {
    const validation = validateUserActivity(activity, currentDog);
    if (!validation.isValid || !validation.sanitizedActivity) {
      return;
    }

    try {
      await ActivityDomainService.createUserActivity(validation.sanitizedActivity, currentDog!.id);
      
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
  }, [currentDog, validateUserActivity, toast]);

  return {
    addUserActivity
  };
};
