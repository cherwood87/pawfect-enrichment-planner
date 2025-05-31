
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { SupabaseAdapter } from '../integration/SupabaseAdapter';
import { LocalStorageAdapter } from '../integration/LocalStorageAdapter';
import { AppError, handleError } from '@/utils/errorUtils';

export class ActivityRepository {
  // Scheduled Activities with enhanced error handling and retry logic
  static async getScheduledActivities(dogId: string, fallbackToLocalStorage = true): Promise<ScheduledActivity[]> {
    try {
      if (!dogId?.trim()) {
        throw new AppError('Dog ID is required', 'INVALID_DOG_ID');
      }

      return await SupabaseAdapter.getScheduledActivities(dogId);
    } catch (error) {
      console.error('Failed to fetch from Supabase, falling back to localStorage:', error);
      handleError(error as Error, { operation: 'getScheduledActivities', dogId }, false);
      
      if (fallbackToLocalStorage) {
        try {
          return LocalStorageAdapter.getScheduledActivities(dogId);
        } catch (localError) {
          console.error('LocalStorage fallback also failed:', localError);
          handleError(localError as Error, { operation: 'getScheduledActivities_localStorage', dogId }, false);
          return []; // Return empty array as last resort
        }
      }
      throw error;
    }
  }

  static async createScheduledActivity(activity: ScheduledActivity): Promise<ScheduledActivity> {
    try {
      this.validateScheduledActivity(activity);
      
      const created = await SupabaseAdapter.createScheduledActivity(activity);
      
      // Update localStorage as backup
      if (activity.dogId) {
        try {
          const existing = LocalStorageAdapter.getScheduledActivities(activity.dogId);
          LocalStorageAdapter.saveScheduledActivities(activity.dogId, [...existing, created]);
        } catch (localError) {
          console.warn('Failed to update localStorage backup:', localError);
        }
      }
      
      return created;
    } catch (error) {
      console.error('Failed to create in Supabase:', error);
      handleError(error as Error, { operation: 'createScheduledActivity', activity });
      throw error;
    }
  }

  static async updateScheduledActivity(activity: ScheduledActivity): Promise<ScheduledActivity> {
    try {
      this.validateScheduledActivity(activity);
      
      const updated = await SupabaseAdapter.updateScheduledActivity(activity);
      
      // Update localStorage as backup
      try {
        const existing = LocalStorageAdapter.getScheduledActivities(activity.dogId);
        const updatedList = existing.map(a => a.id === activity.id ? updated : a);
        LocalStorageAdapter.saveScheduledActivities(activity.dogId, updatedList);
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
      
      return updated;
    } catch (error) {
      console.error('Failed to update in Supabase:', error);
      handleError(error as Error, { operation: 'updateScheduledActivity', activity });
      throw error;
    }
  }

  static async deleteScheduledActivity(id: string, dogId: string): Promise<void> {
    try {
      if (!id?.trim() || !dogId?.trim()) {
        throw new AppError('ID and Dog ID are required', 'MISSING_REQUIRED_FIELDS');
      }

      await SupabaseAdapter.deleteScheduledActivity(id);
      
      // Update localStorage as backup
      try {
        const existing = LocalStorageAdapter.getScheduledActivities(dogId);
        const filtered = existing.filter(a => a.id !== id);
        LocalStorageAdapter.saveScheduledActivities(dogId, filtered);
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
    } catch (error) {
      console.error('Failed to delete from Supabase:', error);
      handleError(error as Error, { operation: 'deleteScheduledActivity', id, dogId });
      throw error;
    }
  }

  // User Activities with enhanced error handling
  static async getUserActivities(dogId: string, fallbackToLocalStorage = true): Promise<UserActivity[]> {
    try {
      if (!dogId?.trim()) {
        throw new AppError('Dog ID is required', 'INVALID_DOG_ID');
      }

      return await SupabaseAdapter.getUserActivities(dogId);
    } catch (error) {
      console.error('Failed to fetch from Supabase, falling back to localStorage:', error);
      handleError(error as Error, { operation: 'getUserActivities', dogId }, false);
      
      if (fallbackToLocalStorage) {
        try {
          return LocalStorageAdapter.getUserActivities(dogId);
        } catch (localError) {
          console.error('LocalStorage fallback also failed:', localError);
          handleError(localError as Error, { operation: 'getUserActivities_localStorage', dogId }, false);
          return []; // Return empty array as last resort
        }
      }
      throw error;
    }
  }

  static async createUserActivity(activity: UserActivity): Promise<UserActivity> {
    try {
      this.validateUserActivity(activity);
      
      const created = await SupabaseAdapter.createUserActivity(activity);
      
      // Update localStorage as backup
      try {
        const existing = LocalStorageAdapter.getUserActivities(activity.dogId);
        LocalStorageAdapter.saveUserActivities(activity.dogId, [...existing, created]);
      } catch (localError) {
        console.warn('Failed to update localStorage backup:', localError);
      }
      
      return created;
    } catch (error) {
      console.error('Failed to create in Supabase:', error);
      handleError(error as Error, { operation: 'createUserActivity', activity });
      throw error;
    }
  }

  // Validation methods
  private static validateScheduledActivity(activity: ScheduledActivity): void {
    if (!activity.id?.trim()) {
      throw new AppError('Activity ID is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.activityId?.trim()) {
      throw new AppError('Activity reference ID is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.dogId?.trim()) {
      throw new AppError('Dog ID is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.scheduledDate) {
      throw new AppError('Scheduled date is required', 'VALIDATION_ERROR');
    }

    // Validate date format
    const date = new Date(activity.scheduledDate);
    if (isNaN(date.getTime())) {
      throw new AppError('Invalid scheduled date format', 'VALIDATION_ERROR');
    }
  }

  private static validateUserActivity(activity: UserActivity): void {
    if (!activity.id?.trim()) {
      throw new AppError('Activity ID is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.title?.trim()) {
      throw new AppError('Activity title is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.dogId?.trim()) {
      throw new AppError('Dog ID is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.pillar) {
      throw new AppError('Activity pillar is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.duration || activity.duration <= 0) {
      throw new AppError('Valid duration is required', 'VALIDATION_ERROR');
    }
  }

  // Migration helpers with enhanced error handling
  static async migrateFromLocalStorage(dogId: string): Promise<void> {
    console.log(`Starting migration for dog ${dogId}...`);
    
    try {
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
