
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { SupabaseAdapter } from '../integration/SupabaseAdapter';
import { LocalStorageAdapter } from '../integration/LocalStorageAdapter';
import { handleError } from '@/utils/errorUtils';

export class BatchMigrationService {
  private static BATCH_SIZE = 10; // Process in smaller batches to avoid timeouts

  static async batchMigrateScheduledActivities(dogId: string): Promise<{
    success: boolean;
    migrated: number;
    failed: number;
    errors: Error[];
  }> {
    console.log(`🔄 Starting batch migration of scheduled activities for dog ${dogId}...`);
    
    try {
      if (!LocalStorageAdapter.hasScheduledActivitiesData(dogId)) {
        return { success: true, migrated: 0, failed: 0, errors: [] };
      }

      const localActivities = LocalStorageAdapter.getScheduledActivities(dogId);
      const results = {
        success: true,
        migrated: 0,
        failed: 0,
        errors: [] as Error[]
      };

      // Process in batches to avoid overwhelming the system
      for (let i = 0; i < localActivities.length; i += this.BATCH_SIZE) {
        const batch = localActivities.slice(i, i + this.BATCH_SIZE);
        
        const batchPromises = batch.map(async (activity) => {
          try {
            await SupabaseAdapter.createScheduledActivity(activity);
            return { success: true };
          } catch (error) {
            console.error('Failed to migrate scheduled activity:', error);
            const errorObj = error instanceof Error ? error : new Error(String(error));
            handleError(errorObj, { operation: 'batchMigrateScheduledActivity', activity }, false);
            return { success: false, error: errorObj };
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            if (result.value.success) {
              results.migrated++;
            } else {
              results.failed++;
              if (result.value.error) {
                results.errors.push(result.value.error);
              }
            }
          } else {
            results.failed++;
            results.errors.push(new Error(result.reason));
          }
        });

        // Add a small delay between batches to prevent rate limiting
        if (i + this.BATCH_SIZE < localActivities.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Only clear localStorage if migration was mostly successful (>80% success rate)
      const successRate = results.migrated / (results.migrated + results.failed);
      if (successRate > 0.8) {
        LocalStorageAdapter.clearScheduledActivities(dogId);
        console.log(`✅ Batch migration completed for dog ${dogId}. Migrated: ${results.migrated}, Failed: ${results.failed}`);
      } else {
        console.warn(`⚠️ Migration partially failed for dog ${dogId}. Success rate: ${(successRate * 100).toFixed(1)}%`);
        results.success = false;
      }

      return results;
    } catch (error) {
      console.error(`❌ Batch migration failed for dog ${dogId}:`, error);
      const errorObj = error instanceof Error ? error : new Error(String(error));
      handleError(errorObj, { operation: 'batchMigrateScheduledActivities', dogId });
      return { success: false, migrated: 0, failed: 0, errors: [errorObj] };
    }
  }

  static async batchMigrateUserActivities(dogId: string): Promise<{
    success: boolean;
    migrated: number;
    failed: number;
    errors: Error[];
  }> {
    console.log(`🔄 Starting batch migration of user activities for dog ${dogId}...`);
    
    try {
      if (!LocalStorageAdapter.hasUserActivitiesData(dogId)) {
        return { success: true, migrated: 0, failed: 0, errors: [] };
      }

      const localActivities = LocalStorageAdapter.getUserActivities(dogId);
      const results = {
        success: true,
        migrated: 0,
        failed: 0,
        errors: [] as Error[]
      };

      // Process in batches
      for (let i = 0; i < localActivities.length; i += this.BATCH_SIZE) {
        const batch = localActivities.slice(i, i + this.BATCH_SIZE);
        
        const batchPromises = batch.map(async (activity) => {
          try {
            await SupabaseAdapter.createUserActivity(activity);
            return { success: true };
          } catch (error) {
            console.error('Failed to migrate user activity:', error);
            const errorObj = error instanceof Error ? error : new Error(String(error));
            handleError(errorObj, { operation: 'batchMigrateUserActivity', activity }, false);
            return { success: false, error: errorObj };
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            if (result.value.success) {
              results.migrated++;
            } else {
              results.failed++;
              if (result.value.error) {
                results.errors.push(result.value.error);
              }
            }
          } else {
            results.failed++;
            results.errors.push(new Error(result.reason));
          }
        });

        // Add delay between batches
        if (i + this.BATCH_SIZE < localActivities.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Clear localStorage if migration was successful
      const successRate = results.migrated / (results.migrated + results.failed);
      if (successRate > 0.8) {
        LocalStorageAdapter.clearUserActivities(dogId);
        console.log(`✅ Batch migration completed for dog ${dogId}. Migrated: ${results.migrated}, Failed: ${results.failed}`);
      } else {
        console.warn(`⚠️ Migration partially failed for dog ${dogId}. Success rate: ${(successRate * 100).toFixed(1)}%`);
        results.success = false;
      }

      return results;
    } catch (error) {
      console.error(`❌ Batch migration failed for dog ${dogId}:`, error);
      const errorObj = error instanceof Error ? error : new Error(String(error));
      handleError(errorObj, { operation: 'batchMigrateUserActivities', dogId });
      return { success: false, migrated: 0, failed: 0, errors: [errorObj] };
    }
  }
}
