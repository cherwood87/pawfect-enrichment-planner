import { ScheduledActivity, UserActivity } from "@/types/activity";
import { ScheduledActivityRepository } from "./ScheduledActivityRepository";
import { UserActivityRepository } from "./UserActivityRepository";
import { ActivityMigrationRepository } from "./ActivityMigrationRepository";

export class ActivityRepository {
  // Scheduled Activities - delegate to ScheduledActivityRepository
  static async getScheduledActivities(
    dogId: string,
    fallbackToLocalStorage = true,
  ): Promise<ScheduledActivity[]> {
    return ScheduledActivityRepository.getScheduledActivities(
      dogId,
      fallbackToLocalStorage,
    );
  }

  static async createScheduledActivity(
    activity: ScheduledActivity,
  ): Promise<ScheduledActivity> {
    return ScheduledActivityRepository.createScheduledActivity(activity);
  }

  static async updateScheduledActivity(
    activity: ScheduledActivity,
  ): Promise<ScheduledActivity> {
    return ScheduledActivityRepository.updateScheduledActivity(activity);
  }

  static async deleteScheduledActivity(
    id: string,
    dogId: string,
  ): Promise<void> {
    return ScheduledActivityRepository.deleteScheduledActivity(id, dogId);
  }

  // User Activities - delegate to UserActivityRepository
  static async getUserActivities(
    dogId: string,
    fallbackToLocalStorage = true,
  ): Promise<UserActivity[]> {
    return UserActivityRepository.getUserActivities(
      dogId,
      fallbackToLocalStorage,
    );
  }

  static async createUserActivity(
    activity: UserActivity,
  ): Promise<UserActivity> {
    return UserActivityRepository.createUserActivity(activity);
  }

  // Migration helpers - delegate to ActivityMigrationRepository
  static async migrateFromLocalStorage(dogId: string): Promise<void> {
    return ActivityMigrationRepository.migrateFromLocalStorage(dogId);
  }
}
