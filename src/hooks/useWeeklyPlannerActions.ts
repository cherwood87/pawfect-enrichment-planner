
import { useCallback } from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useActivity } from '@/contexts/ActivityContext';
import { useToast } from '@/hooks/use-toast';
import { useRetry } from '@/hooks/useRetry';

export const useWeeklyPlannerActions = (
  allWeekActivities: ScheduledActivity[],
  optimisticUpdates: Record<string, boolean>,
  loadingStates: Record<string, boolean>,
  setOptimisticUpdates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  setLoadingStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  const { toggleActivityCompletion } = useActivity();
  const { toast } = useToast();

  // Retry mechanism for failed operations
  const { retry, isRetrying } = useRetry({
    maxAttempts: 3,
    delay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt} for error:`, error);
      toast({
        title: `Retrying... (${attempt}/3)`,
        description: "Please wait while we try again.",
        variant: "default"
      });
    }
  });

  // Enhanced toggle completion with optimistic updates and error handling
  const handleToggleCompletion = useCallback(async (activityId: string, completionNotes?: string) => {
    if (loadingStates[activityId]) return; // Prevent double-clicks

    // Set loading state
    setLoadingStates(prev => ({ ...prev, [activityId]: true }));

    // Find current state
    const activity = allWeekActivities.find(a => a.id === activityId);
    if (!activity) {
      console.error('Activity not found:', activityId);
      setLoadingStates(prev => ({ ...prev, [activityId]: false }));
      return;
    }

    const currentState = optimisticUpdates[activityId] !== undefined ? optimisticUpdates[activityId] : activity.completed;
    const newState = !currentState;

    // Optimistic update
    setOptimisticUpdates(prev => ({ ...prev, [activityId]: newState }));

    try {
      // Wrap the toggleActivityCompletion call to ensure it returns a Promise
      await retry(async () => {
        await toggleActivityCompletion(activityId, completionNotes);
        return Promise.resolve(); // Ensure we return a Promise
      });
      
      // Clear optimistic update on success
      setOptimisticUpdates(prev => {
        const { [activityId]: _, ...rest } = prev;
        return rest;
      });
      
      toast({
        title: newState ? "Activity completed!" : "Activity marked incomplete",
        description: newState ? "Great job on completing this activity!" : "Activity status updated",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to toggle activity completion:', error);
      
      // Revert optimistic update
      setOptimisticUpdates(prev => {
        const { [activityId]: _, ...rest } = prev;
        return rest;
      });
      
      toast({
        title: "Update failed",
        description: "We couldn't update the activity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [activityId]: false }));
    }
  }, [allWeekActivities, optimisticUpdates, loadingStates, toggleActivityCompletion, retry, toast, setOptimisticUpdates, setLoadingStates]);

  return {
    handleToggleCompletion,
    isRetrying
  };
};
