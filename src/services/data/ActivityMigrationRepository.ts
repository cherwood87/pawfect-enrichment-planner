
import { BatchMigrationService } from './BatchMigrationService';
import { handleError } from '@/utils/errorUtils';
import { BaseRepository } from './BaseRepository';

export class ActivityMigrationRepository extends BaseRepository {
  static async migrateFromLocalStorage(dogId: string): Promise<void> {
    console.log(`🚀 Starting optimized migration for dog ${dogId}...`);
    
    try {
      this.validateDogId(dogId);

      // Check migration flags to avoid duplicate migrations
      const scheduledMigrationFlag = `migration_scheduled_${dogId}`;
      const userMigrationFlag = `migration_user_${dogId}`;
      
      const hasScheduledMigration = localStorage.getItem(scheduledMigrationFlag) === 'completed';
      const hasUserMigration = localStorage.getItem(userMigrationFlag) === 'completed';

      const migrationPromises = [];

      // Migrate scheduled activities if not already done
      if (!hasScheduledMigration) {
        migrationPromises.push(
          BatchMigrationService.batchMigrateScheduledActivities(dogId).then(result => {
            if (result.success) {
              localStorage.setItem(scheduledMigrationFlag, 'completed');
            }
            return { type: 'scheduled', ...result };
          })
        );
      }

      // Migrate user activities if not already done
      if (!hasUserMigration) {
        migrationPromises.push(
          BatchMigrationService.batchMigrateUserActivities(dogId).then(result => {
            if (result.success) {
              localStorage.setItem(userMigrationFlag, 'completed');
            }
            return { type: 'user', ...result };
          })
        );
      }

      if (migrationPromises.length === 0) {
        console.log(`✅ Migration already completed for dog ${dogId}`);
        return;
      }

      // Execute migrations in parallel for better performance
      const results = await Promise.allSettled(migrationPromises);
      
      let totalMigrated = 0;
      let totalFailed = 0;
      const allErrors: Error[] = [];

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          totalMigrated += result.value.migrated;
          totalFailed += result.value.failed;
          allErrors.push(...result.value.errors);
          
          console.log(`✅ ${result.value.type} migration completed:`, {
            migrated: result.value.migrated,
            failed: result.value.failed
          });
        } else {
          console.error('Migration promise rejected:', result.reason);
          allErrors.push(new Error(result.reason));
        }
      });

      console.log(`🎉 Migration completed for dog ${dogId}:`, {
        totalMigrated,
        totalFailed,
        errorCount: allErrors.length
      });

      // If there were significant errors, report them but don't fail the entire operation
      if (allErrors.length > 0 && totalFailed > totalMigrated * 0.2) {
        console.warn(`⚠️ Migration completed with ${allErrors.length} errors`);
        handleError(
          new Error(`Migration completed with errors: ${allErrors.slice(0, 3).map(e => e.message).join(', ')}`),
          { operation: 'migrateFromLocalStorage', dogId, totalMigrated, totalFailed },
          false
        );
      }
    } catch (error) {
      console.error(`❌ Migration failed for dog ${dogId}:`, error);
      handleError(error as Error, { operation: 'migrateFromLocalStorage', dogId });
      throw error;
    }
  }
}
