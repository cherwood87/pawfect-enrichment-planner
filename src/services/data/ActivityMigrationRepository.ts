
import { SupabaseAdapter } from '../integration/SupabaseAdapter';
import { LocalStorageAdapter } from '../integration/LocalStorageAdapter';
import { handleError } from '@/utils/errorUtils';
import { BaseRepository } from './BaseRepository';

export class ActivityMigrationRepository extends BaseRepository {
  static async migrateFromLocalStorage(dogId: string): Promise<void> {
    console.log(`Starting migration for dog ${dogId}...`);
    
    try {
      this.validateDogId(dogId);

      // Migrate scheduled activities
      if (LocalStorageAdapter.hasScheduledActivitiesData(dogId)) {
        const localScheduled = LocalStorageAdapter.getScheduledActivities(dogId);
        const migrationResults = {
          scheduled: { success: 0, failed: 0 },
          user: { success: 0, failed: 0 }
        };

        for (const activity of localScheduled) {
          try {
            await SupabaseAdapter.createScheduledActivity(activity);
            migrationResults.scheduled.success++;
          } catch (error) {
            console.error('Failed to migrate scheduled activity:', error);
            migrationResults.scheduled.failed++;
            handleError(error as Error, { operation: 'migrateScheduledActivity', activity }, false);
          }
        }
        
        // Only clear localStorage if migration was mostly successful
        if (migrationResults.scheduled.success > migrationResults.scheduled.failed) {
          LocalStorageAdapter.clearScheduledActivities(dogId);
        }
      }

      // Migrate user activities
      if (LocalStorageAdapter.hasUserActivitiesData(dogId)) {
        const localUser = LocalStorageAdapter.getUserActivities(dogId);
        let userSuccess = 0;
        let userFailed = 0;

        for (const activity of localUser) {
          try {
            await SupabaseAdapter.createUserActivity(activity);
            userSuccess++;
          } catch (error) {
            console.error('Failed to migrate user activity:', error);
            userFailed++;
            handleError(error as Error, { operation: 'migrateUserActivity', activity }, false);
          }
        }
        
        // Only clear localStorage if migration was mostly successful
        if (userSuccess > userFailed) {
          LocalStorageAdapter.clearUserActivities(dogId);
        }
      }

      console.log(`Migration completed for dog ${dogId}`);
    } catch (error) {
      console.error(`Migration failed for dog ${dogId}:`, error);
      handleError(error as Error, { operation: 'migrateFromLocalStorage', dogId });
      throw error;
    }
  }
}
