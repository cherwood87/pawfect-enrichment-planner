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
import { ActivityBusinessLogicService } from "./ActivityBusinessLogicService";
import { ActivityAnalyticsService } from "./ActivityAnalyticsService";

export class ActivityDomainService {
  // Delegate business logic operations to ActivityBusinessLogicService
  static async getScheduledActivitiesForDog(
    dogId: string,
  ): Promise<ScheduledActivity[]> {
    return ActivityBusinessLogicService.getScheduledActivitiesForDog(dogId);
  }

  static async createScheduledActivity(
    activity: Omit<ScheduledActivity, "id">,
  ): Promise<ScheduledActivity> {
    return ActivityBusinessLogicService.createScheduledActivity(activity);
  }

  static async toggleActivityCompletion(
    activityId: string,
    dogId: string,
    completionNotes?: string,
  ): Promise<ScheduledActivity> {
    return ActivityBusinessLogicService.toggleActivityCompletion(
      activityId,
      dogId,
      completionNotes,
    );
  }

  static async updateScheduledActivity(
    activityId: string,
    dogId: string,
    updates: Partial<ScheduledActivity>,
  ): Promise<ScheduledActivity> {
    return ActivityBusinessLogicService.updateScheduledActivity(
      activityId,
      dogId,
      updates,
    );
  }

  static async createUserActivity(
    activity: Omit<UserActivity, "id" | "createdAt" | "dogId">,
    dogId: string,
  ): Promise<UserActivity> {
    return ActivityBusinessLogicService.createUserActivity(activity, dogId);
  }

  // Delegate analytics operations to ActivityAnalyticsService
  static getTodaysActivities(
    scheduledActivities: ScheduledActivity[],
    currentDog: Dog | null,
  ): ScheduledActivity[] {
    return ActivityAnalyticsService.getTodaysActivities(
      scheduledActivities,
      currentDog,
    );
  }

  static getActivityDetails(
    activityId: string,
    userActivities: UserActivity[],
    discoveredActivities: DiscoveredActivity[],
    currentDog: Dog | null,
  ): ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined {
    return ActivityAnalyticsService.getActivityDetails(
      activityId,
      userActivities,
      discoveredActivities,
      currentDog,
    );
  }

  static calculateStreakData(
    scheduledActivities: ScheduledActivity[],
    currentDog: Dog | null,
  ): StreakData {
    return ActivityAnalyticsService.calculateStreakData(
      scheduledActivities,
      currentDog,
    );
  }

  static calculateWeeklyProgress(
    scheduledActivities: ScheduledActivity[],
    currentDog: Dog,
  ): WeeklyProgress[] {
    return ActivityAnalyticsService.calculateWeeklyProgress(
      scheduledActivities,
      currentDog,
    );
  }

  static calculatePillarBalance(
    scheduledActivities: ScheduledActivity[],
    userActivities: UserActivity[],
    discoveredActivities: DiscoveredActivity[],
    currentDog: Dog | null,
  ): Record<string, number> {
    return ActivityAnalyticsService.calculatePillarBalance(
      scheduledActivities,
      userActivities,
      discoveredActivities,
      currentDog,
    );
  }

  static getDailyGoals(currentDog: Dog | null): PillarGoals {
    return ActivityAnalyticsService.getDailyGoals(currentDog);
  }
}
