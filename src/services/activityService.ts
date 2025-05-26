
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { ScheduledActivityService } from './scheduledActivityService';
import { UserActivityService } from './userActivityService';
import { MigrationService } from './migrationService';

export class ActivityService {
  // Scheduled Activities
  static async getScheduledActivities(dogId: string): Promise<ScheduledActivity[]> {
    return ScheduledActivityService.getAll(dogId);
  }

  static async createScheduledActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
    return ScheduledActivityService.create(activity);
  }

  static async updateScheduledActivity(activity: ScheduledActivity): Promise<ScheduledActivity> {
    return ScheduledActivityService.update(activity);
  }

  static async deleteScheduledActivity(id: string): Promise<void> {
    return ScheduledActivityService.delete(id);
  }

  // User Activities (Custom Activities)
  static async getUserActivities(dogId: string): Promise<UserActivity[]> {
    return UserActivityService.getAll(dogId);
  }

  static async createUserActivity(activity: Omit<UserActivity, 'id' | 'createdAt'>): Promise<UserActivity> {
    return UserActivityService.create(activity);
  }

  // Migration helpers
  static async migrateScheduledActivitiesFromLocalStorage(dogId: string): Promise<void> {
    return MigrationService.migrateScheduledActivitiesFromLocalStorage(dogId);
  }

  static async migrateUserActivitiesFromLocalStorage(dogId: string): Promise<void> {
    return MigrationService.migrateUserActivitiesFromLocalStorage(dogId);
  }
}
