
import { ScheduledActivity, UserActivity, ActivityLibraryItem, StreakData, WeeklyProgress, PillarGoals } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { ActivityDomainService } from '@/services/domain/ActivityDomainService';

export const useActivityOperations = (
  scheduledActivities: ScheduledActivity[],
  userActivities: UserActivity[],
  discoveredActivities: DiscoveredActivity[],
  currentDog: Dog | null
) => {
  const getTodaysActivities = (): ScheduledActivity[] => {
    return ActivityDomainService.getTodaysActivities(scheduledActivities, currentDog);
  };

  const getActivityDetails = (activityId: string): ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined => {
    return ActivityDomainService.getActivityDetails(activityId, userActivities, discoveredActivities, currentDog);
  };

  const getStreakData = (): StreakData => {
    return ActivityDomainService.calculateStreakData(scheduledActivities, currentDog);
  };

  const getWeeklyProgress = (): WeeklyProgress[] => {
    return ActivityDomainService.calculateWeeklyProgress(scheduledActivities, currentDog!);
  };

  const getPillarBalance = (): Record<string, number> => {
    return ActivityDomainService.calculatePillarBalance(scheduledActivities, userActivities, discoveredActivities, currentDog);
  };

  const getDailyGoals = (): PillarGoals => {
    return ActivityDomainService.getDailyGoals(currentDog);
  };

  return {
    getTodaysActivities,
    getActivityDetails,
    getStreakData,
    getWeeklyProgress,
    getPillarBalance,
    getDailyGoals
  };
};
