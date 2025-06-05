
import { ScheduledActivity } from '@/types/activity';
import { SupabaseAdapter } from '../integration/SupabaseAdapter';
import { LocalStorageAdapter } from '../integration/LocalStorageAdapter';
import { AppError, handleError } from '@/utils/errorUtils';
import { BaseRepository } from './BaseRepository';

export class ScheduledActivityRepository extends BaseRepository {
  static async getScheduledActivities(dogId: string, fallbackToLocalStorage = true): Promise<ScheduledActivity[]> {
    try {
      this.validateDogId(dogId);

      console.log('🔍 [ScheduledActivityRepository] Fetching scheduled activities for dog:', dogId);
      const activities = await SupabaseAdapter.getScheduledActivities(dogId);
      console.log('✅ [ScheduledActivityRepository] Retrieved from Supabase:', activities.length, 'activities');
      return activities;
    } catch (error) {
      console.error('❌ [ScheduledActivityRepository] Failed to fetch from Supabase, falling back to localStorage:', error);
      handleError(error as Error, { operation: 'getScheduledActivities', dogId }, false);
      
      if (fallbackToLocalStorage) {
        try {
          const localActivities = LocalStorageAdapter.getScheduledActivities(dogId);
          console.log('📱 [ScheduledActivityRepository] Retrieved from localStorage:', localActivities.length, 'activities');
          return localActivities;
        } catch (localError) {
          console.error('❌ [ScheduledActivityRepository] LocalStorage fallback also failed:', localError);
          handleError(localError as Error, { operation: 'getScheduledActivities_localStorage', dogId }, false);
          return []; // Return empty array as last resort
        }
      }
      throw error;
    }
  }

  static async createScheduledActivity(activity: ScheduledActivity): Promise<ScheduledActivity> {
    try {
      console.log('💾 [ScheduledActivityRepository] Creating scheduled activity:', {
        activityId: activity.activityId,
        dogId: activity.dogId,
        scheduledDate: activity.scheduledDate,
        weekNumber: activity.weekNumber,
        dayOfWeek: activity.dayOfWeek
      });
      
      this.validateScheduledActivity(activity);
      
      const created = await SupabaseAdapter.createScheduledActivity(activity);
      
      console.log('✅ [ScheduledActivityRepository] Created in Supabase:', {
        id: created.id,
        activityId: created.activityId,
        scheduledDate: created.scheduledDate,
        weekNumber: created.weekNumber,
        dayOfWeek: created.dayOfWeek
      });
      
      // Update localStorage as backup
      if (activity.dogId) {
        try {
          const existing = LocalStorageAdapter.getScheduledActivities(activity.dogId);
          LocalStorageAdapter.saveScheduledActivities(activity.dogId, [...existing, created]);
          console.log('📱 [ScheduledActivityRepository] Updated localStorage backup');
        } catch (localError) {
          console.warn('⚠️ [ScheduledActivityRepository] Failed to update localStorage backup:', localError);
        }
      }
      
      return created;
    } catch (error) {
      console.error('❌ [ScheduledActivityRepository] Failed to create in Supabase:', error);
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
      this.validateId(id, 'ID');
      this.validateDogId(dogId);

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

  private static validateScheduledActivity(activity: ScheduledActivity): void {
    this.validateId(activity.id, 'Activity ID');
    this.validateRequiredString(activity.activityId, 'Activity reference ID');
    this.validateDogId(activity.dogId);
    
    if (!activity.scheduledDate) {
      throw new AppError('Scheduled date is required', 'VALIDATION_ERROR');
    }

    this.validateDate(activity.scheduledDate, 'Scheduled date');
  }
}
