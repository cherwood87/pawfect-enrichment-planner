import { useMemo } from "react";
import {
  ScheduledActivity,
  UserActivity,
  ActivityLibraryItem,
  StreakData,
  WeeklyProgress,
  PillarGoals,
} from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";
import { Dog } from "@/types/dog";
import { ActivityService } from "@/services/core/ActivityService";

export const useActivityOperations = (
  scheduledActivities: ScheduledActivity[],
  userActivities: UserActivity[],
  discoveredActivities: DiscoveredActivity[],
  currentDog: Dog | null,
) => {
  const getTodaysActivities = (): ScheduledActivity[] => {
    return ActivityService.getTodaysActivities(scheduledActivities, currentDog);
  };

  const getActivityDetails = (
    activityId: string,
  ): ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined => {
    return ActivityService.getActivityDetails(
      activityId,
      userActivities,
      discoveredActivities,
      currentDog,
    );
  };

  const getStreakData = (): StreakData => {
    return ActivityService.calculateStreakData(scheduledActivities, currentDog);
  };

  const getWeeklyProgress = (): WeeklyProgress[] => {
    if (!currentDog) return [];
    return ActivityService.calculateWeeklyProgress(
      scheduledActivities,
      currentDog,
    );
  };

  const getPillarBalance = (): Record<string, number> => {
    return ActivityService.calculatePillarBalance(
      scheduledActivities,
      userActivities,
      discoveredActivities,
      currentDog,
    );
  };

  const getDailyGoals = (): PillarGoals => {
    return ActivityService.getDailyGoals(currentDog);
  };

  // Memoize operations for performance
  const memoizedOperations = useMemo(
    () => ({
      getTodaysActivities,
      getActivityDetails,
      getStreakData,
      getWeeklyProgress,
      getPillarBalance,
      getDailyGoals,
    }),
    [scheduledActivities, userActivities, discoveredActivities, currentDog],
  );

  return memoizedOperations;
};
