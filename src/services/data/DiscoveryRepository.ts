
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { SupabaseAdapter } from '../integration/SupabaseAdapter';
import { LocalStorageAdapter } from '../integration/LocalStorageAdapter';
import { ContentDiscoveryService } from '@/services/ContentDiscoveryService';

export class DiscoveryRepository {
  // Discovered Activities
  static async getDiscoveredActivities(dogId: string, fallbackToLocalStorage = true): Promise<DiscoveredActivity[]> {
    try {
      // Fetch globally visible discovered activities (ignores dogId for visibility)
      return await ContentDiscoveryService.getDiscoveredActivities(dogId);
    } catch (error) {
      console.error('Failed to fetch global discovered activities, falling back:', error);
      // Fall back to previous behavior (dog-scoped via SupabaseAdapter), then local storage
      try {
        return await SupabaseAdapter.getDiscoveredActivities(dogId);
      } catch (innerError) {
        console.error('Failed to fetch from SupabaseAdapter, falling back to localStorage:', innerError);
        if (fallbackToLocalStorage) {
          return LocalStorageAdapter.getDiscoveredActivities(dogId);
        }
        throw innerError;
      }
    }
  }

  static async saveDiscoveredActivities(dogId: string, activities: DiscoveredActivity[]): Promise<void> {
    try {
      await SupabaseAdapter.createDiscoveredActivities(activities, dogId);
      // Update localStorage as backup
      LocalStorageAdapter.saveDiscoveredActivities(dogId, activities);
    } catch (error) {
      console.error('Failed to save to Supabase, saving to localStorage:', error);
      LocalStorageAdapter.saveDiscoveredActivities(dogId, activities);
      throw error;
    }
  }

  // Discovery Config
  static async getDiscoveryConfig(dogId: string, fallbackToLocalStorage = true): Promise<ContentDiscoveryConfig | null> {
    try {
      return await SupabaseAdapter.getDiscoveryConfig(dogId);
    } catch (error) {
      console.error('Failed to fetch from Supabase, falling back to localStorage:', error);
      if (fallbackToLocalStorage) {
        return LocalStorageAdapter.getDiscoveryConfig(dogId);
      }
      throw error;
    }
  }

  static async saveDiscoveryConfig(dogId: string, config: ContentDiscoveryConfig): Promise<void> {
    try {
      await SupabaseAdapter.saveDiscoveryConfig(config, dogId);
      // Update localStorage as backup
      LocalStorageAdapter.saveDiscoveryConfig(dogId, config);
    } catch (error) {
      console.error('Failed to save to Supabase, saving to localStorage:', error);
      LocalStorageAdapter.saveDiscoveryConfig(dogId, config);
      throw error;
    }
  }

  // Migration helpers
  static async migrateFromLocalStorage(dogId: string): Promise<void> {
    console.log(`Starting discovery migration for dog ${dogId}...`);
    
    // Migrate discovered activities
    if (LocalStorageAdapter.hasDiscoveredActivitiesData(dogId)) {
      const localDiscovered = LocalStorageAdapter.getDiscoveredActivities(dogId);
      try {
        await SupabaseAdapter.createDiscoveredActivities(localDiscovered, dogId);
        LocalStorageAdapter.clearDiscoveredActivities(dogId);
      } catch (error) {
        console.error('Failed to migrate discovered activities:', error);
      }
    }

    // Migrate discovery config
    if (LocalStorageAdapter.hasDiscoveryConfigData(dogId)) {
      const localConfig = LocalStorageAdapter.getDiscoveryConfig(dogId);
      if (localConfig) {
        try {
          await SupabaseAdapter.saveDiscoveryConfig(localConfig, dogId);
          LocalStorageAdapter.clearDiscoveryConfig(dogId);
        } catch (error) {
          console.error('Failed to migrate discovery config:', error);
        }
      }
    }

    console.log(`Discovery migration completed for dog ${dogId}`);
  }
}
