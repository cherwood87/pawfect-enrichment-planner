
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { ScheduledActivityService } from './scheduledActivityService';
import { ActivityDomainService } from './domain/ActivityDomainService';

export class MigrationService {
  static async migrateScheduledActivitiesFromLocalStorage(dogId: string): Promise<void> {
    try {
      const localActivities = localStorage.getItem(`scheduledActivities-${dogId}`);
      if (!localActivities) return;

      const activities: ScheduledActivity[] = JSON.parse(localActivities);
      console.log(`Migrating ${activities.length} scheduled activities for dog ${dogId}...`);

      for (const activity of activities) {
        try {
          await ScheduledActivityService.create(activity);
        } catch (error) {
          console.error(`Failed to migrate scheduled activity:`, error);
        }
      }

      console.log('Scheduled activities migration completed');
    } catch (error) {
      console.error('Error during scheduled activities migration:', error);
    }
  }

  static async migrateUserActivitiesFromLocalStorage(dogId: string): Promise<void> {
    try {
      const localActivities = localStorage.getItem(`userActivities-${dogId}`);
      if (!localActivities) return;

      const activities: UserActivity[] = JSON.parse(localActivities);
      console.log(`Migrating ${activities.length} user activities for dog ${dogId}...`);

      for (const activity of activities) {
        try {
          await ActivityDomainService.createUserActivity(activity, dogId);
        } catch (error) {
          console.error(`Failed to migrate user activity:`, error);
        }
      }

      console.log('User activities migration completed');
    } catch (error) {
      console.error('Error during user activities migration:', error);
    }
  }
}
