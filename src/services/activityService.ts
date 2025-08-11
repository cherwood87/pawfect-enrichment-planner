
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { ActivityDomainService } from './domain/ActivityDomainService';
import { ActivityRepository } from './data/ActivityRepository';

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
    return ActivityRepository.getUserActivities(dogId);
  }

  static async createUserActivity(activity: Omit<UserActivity, 'id' | 'createdAt'>): Promise<UserActivity> {
    return ActivityDomainService.createUserActivity(activity, activity.dogId);
  }

  // Migration helpers - now properly implemented
  static async migrateScheduledActivitiesFromLocalStorage(dogId: string): Promise<void> {
    try {
      await ActivityRepository.migrateFromLocalStorage(dogId);
      console.log('Scheduled activities migration completed for dog:', dogId);
    } catch (error) {
      console.error('Failed to migrate scheduled activities for dog:', dogId, error);
    }
  }

  static async migrateUserActivitiesFromLocalStorage(dogId: string): Promise<void> {
    try {
      await ActivityRepository.migrateFromLocalStorage(dogId);
      console.log('User activities migration completed for dog:', dogId);
    } catch (error) {
      console.error('Failed to migrate user activities for dog:', dogId, error);
    }
  }
}
