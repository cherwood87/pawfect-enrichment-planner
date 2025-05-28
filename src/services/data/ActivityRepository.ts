
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { SupabaseAdapter } from '../integration/SupabaseAdapter';
import { LocalStorageAdapter } from '../integration/LocalStorageAdapter';

export class ActivityRepository {
  // Scheduled Activities
  static async getScheduledActivities(dogId: string, fallbackToLocalStorage = true): Promise<ScheduledActivity[]> {
    try {
      return await SupabaseAdapter.getScheduledActivities(dogId);
    } catch (error) {
      console.error('Failed to fetch from Supabase, falling back to localStorage:', error);
      if (fallbackToLocalStorage) {
        return LocalStorageAdapter.getScheduledActivities(dogId);
      }
      throw error;
    }
  }

  static async createScheduledActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
    try {
      const created = await SupabaseAdapter.createScheduledActivity(activity);
      // Update localStorage as backup
      if (activity.dogId) {
        const existing = LocalStorageAdapter.getScheduledActivities(activity.dogId);
        LocalStorageAdapter.saveScheduledActivities(activity.dogId, [...existing, created]);
      }
      return created;
    } catch (error) {
      console.error('Failed to create in Supabase:', error);
      throw error;
    }
  }

  static async updateScheduledActivity(activity: ScheduledActivity): Promise<ScheduledActivity> {
    try {
      const updated = await SupabaseAdapter.updateScheduledActivity(activity);
      // Update localStorage as backup
      const existing = LocalStorageAdapter.getScheduledActivities(activity.dogId);
      const updatedList = existing.map(a => a.id === activity.id ? updated : a);
      LocalStorageAdapter.saveScheduledActivities(activity.dogId, updatedList);
      return updated;
    } catch (error) {
      console.error('Failed to update in Supabase:', error);
      throw error;
    }
  }

  static async deleteScheduledActivity(id: string, dogId: string): Promise<void> {
    try {
      await SupabaseAdapter.deleteScheduledActivity(id);
      // Update localStorage as backup
      const existing = LocalStorageAdapter.getScheduledActivities(dogId);
      const filtered = existing.filter(a => a.id !== id);
      LocalStorageAdapter.saveScheduledActivities(dogId, filtered);
    } catch (error) {
      console.error('Failed to delete from Supabase:', error);
      throw error;
    }
  }

  // User Activities
  static async getUserActivities(dogId: string, fallbackToLocalStorage = true): Promise<UserActivity[]> {
    try {
      return await SupabaseAdapter.getUserActivities(dogId);
    } catch (error) {
      console.error('Failed to fetch from Supabase, falling back to localStorage:', error);
      if (fallbackToLocalStorage) {
        return LocalStorageAdapter.getUserActivities(dogId);
      }
      throw error;
    }
  }

  static async createUserActivity(activity: Omit<UserActivity, 'id' | 'createdAt'>): Promise<UserActivity> {
    try {
      const created = await SupabaseAdapter.createUserActivity(activity);
      // Update localStorage as backup
      const existing = LocalStorageAdapter.getUserActivities(activity.dogId);
      LocalStorageAdapter.saveUserActivities(activity.dogId, [...existing, created]);
      return created;
    } catch (error) {
      console.error('Failed to create in Supabase:', error);
      throw error;
    }
  }

  // Migration helpers
  static async migrateFromLocalStorage(dogId: string): Promise<void> {
    console.log(`Starting migration for dog ${dogId}...`);
    
    // Migrate scheduled activities
    if (LocalStorageAdapter.hasScheduledActivitiesData(dogId)) {
      const localScheduled = LocalStorageAdapter.getScheduledActivities(dogId);
      for (const activity of localScheduled) {
        try {
          await SupabaseAdapter.createScheduledActivity(activity);
        } catch (error) {
          console.error('Failed to migrate scheduled activity:', error);
        }
      }
      LocalStorageAdapter.clearScheduledActivities(dogId);
    }

    // Migrate user activities
    if (LocalStorageAdapter.hasUserActivitiesData(dogId)) {
      const localUser = LocalStorageAdapter.getUserActivities(dogId);
      for (const activity of localUser) {
        try {
          await SupabaseAdapter.createUserActivity(activity);
        } catch (error) {
          console.error('Failed to migrate user activity:', error);
        }
      }
      LocalStorageAdapter.clearUserActivities(dogId);
    }

    console.log(`Migration completed for dog ${dogId}`);
  }
}
