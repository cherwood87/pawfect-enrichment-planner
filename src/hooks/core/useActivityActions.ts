
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { useScheduledActivityActions } from './useScheduledActivityActions';
import { useUserActivityActions } from './useUserActivityActions';

/**
 * Main activity actions hook that combines all activity-related actions.
 * This hook now delegates to specialized hooks for better maintainability.
 */
export const useActivityActions = (
  setScheduledActivities: (activities: ScheduledActivity[] | ((prev: ScheduledActivity[]) => ScheduledActivity[])) => void,
  setUserActivities: (activities: UserActivity[] | ((prev: UserActivity[]) => UserActivity[])) => void,
  currentDog: Dog | null,
  existingScheduledActivities: ScheduledActivity[] = []
) => {
  const scheduledActivityActions = useScheduledActivityActions(
    setScheduledActivities,
    currentDog,
    existingScheduledActivities
  );

  const userActivityActions = useUserActivityActions(currentDog);

  return {
    addScheduledActivity: scheduledActivityActions.addScheduledActivity,
    toggleActivityCompletion: scheduledActivityActions.toggleActivityCompletion,
    updateScheduledActivity: scheduledActivityActions.updateScheduledActivity,
    addUserActivity: userActivityActions.addUserActivity,
  };
};
