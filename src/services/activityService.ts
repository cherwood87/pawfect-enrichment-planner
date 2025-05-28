
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { ActivityDomainService } from './domain/ActivityDomainService';

export class ActivityService {
  // Scheduled Activities
  static async getScheduledActivities(dogId: string): Promise<ScheduledActivity[]> {
    return ActivityDomainService.getScheduledActivitiesForDog(dogId);
  }

  static async createScheduledActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
    return ActivityDomainService.createScheduledActivity(activity);
  }

  static async updateScheduledActivity(activity: ScheduledActivity): Promise<ScheduledActivity> {
    return ActivityDomainService.updateScheduledActivity(activity.id, activity.dogId, activity);
  }

  static async deleteScheduledActivity(id: string): Promise<void> {
    // This will need to be implemented in the domain service
    throw new Error('Delete functionality needs to be implemented in domain service');
  }

  // User Activities (Custom Activities)
  static async getUserActivities(dogId: string): Promise<UserActivity[]> {
    // This will be implemented through the repository
    throw new Error('User activities will be loaded through repository pattern');
  }

  static async createUserActivity(activity: Omit<UserActivity, 'id' | 'createdAt'>): Promise<UserActivity> {
    return ActivityDomainService.createUserActivity(activity, activity.dogId);
  }

  // Migration helpers - these will be handled by the repository layer
  static async migrateScheduledActivitiesFromLocalStorage(dogId: string): Promise<void> {
    console.log('Migration will be handled by repository layer');
  }

  static async migrateUserActivitiesFromLocalStorage(dogId: string): Promise<void> {
    console.log('Migration will be handled by repository layer');
  }
}
