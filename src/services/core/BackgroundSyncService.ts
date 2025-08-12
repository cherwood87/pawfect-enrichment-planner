import { SyncDomainService } from '../domain/SyncDomainService';
import { ActivityRepository } from '../data/ActivityRepository';
import { DiscoveredActivity } from '@/types/discovery';
import { UserActivity } from '@/types/activity';

export class BackgroundSyncService {
  private static isInitialized = false;
  private static isSyncing = false;

  /**
   * Automatically sync all activity sources in the background
   */
  static async initializeAllActivities(dogId?: string): Promise<void> {
    if (this.isSyncing) return;
    
    this.isSyncing = true;
    
    try {
      console.log('🔄 Starting automatic activity synchronization...');
      
      // 1. Sync curated activities (static library activities)
      await this.syncCuratedActivities();
      
      // 2. Load and sync discovered activities if dogId provided
      if (dogId) {
        await this.syncDiscoveredActivities(dogId);
        await this.syncUserActivities(dogId);
      }
      
      this.isInitialized = true;
      console.log('✅ Background activity sync completed successfully');
      
    } catch (error) {
      console.error('❌ Background sync failed:', error);
      // Silent failure - app continues with available activities
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync curated activities from static files
   */
  private static async syncCuratedActivities(): Promise<void> {
    try {
      const result = await SyncDomainService.syncCuratedActivities();
      if (result.success) {
        console.log(`✅ Synced ${result.synced} curated activities`);
      } else {
        console.warn('⚠️ Curated activities sync failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Error syncing curated activities:', error);
    }
  }

  /**
   * Sync discovered activities for a specific dog
   */
  private static async syncDiscoveredActivities(dogId: string): Promise<void> {
    try {
      // Load discovered activities from localStorage or other sources
      const discoveredActivities = await this.loadDiscoveredActivitiesFromStorage(dogId);
      
      if (discoveredActivities.length > 0) {
        const result = await SyncDomainService.syncDiscoveredActivities(discoveredActivities, dogId);
        if (result.success) {
          console.log(`✅ Synced ${result.synced} discovered activities for dog ${dogId}`);
        }
      }
    } catch (error) {
      console.error('❌ Error syncing discovered activities:', error);
    }
  }

  /**
   * Sync user-created activities for a specific dog
   */
  private static async syncUserActivities(dogId: string): Promise<void> {
    try {
      // Load user activities from localStorage or other sources
      const userActivities = await this.loadUserActivitiesFromStorage(dogId);
      
      if (userActivities.length > 0) {
        const result = await SyncDomainService.syncUserActivities(userActivities, dogId);
        if (result.success) {
          console.log(`✅ Synced ${result.synced} user activities for dog ${dogId}`);
        }
      }
    } catch (error) {
      console.error('❌ Error syncing user activities:', error);
    }
  }

  /**
   * Load discovered activities from localStorage
   */
  private static async loadDiscoveredActivitiesFromStorage(dogId: string): Promise<DiscoveredActivity[]> {
    try {
      const stored = localStorage.getItem(`discoveredActivities-${dogId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading discovered activities from storage:', error);
      return [];
    }
  }

  /**
   * Load user activities from localStorage
   */
  private static async loadUserActivitiesFromStorage(dogId: string): Promise<UserActivity[]> {
    try {
      const stored = localStorage.getItem(`userActivities-${dogId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading user activities from storage:', error);
      return [];
    }
  }

  /**
   * Get total activity count across all sources
   */
  static async getTotalActivityCount(dogId?: string): Promise<number> {
    try {
      const activities = await SyncDomainService.loadActivitiesFromSupabase(dogId);
      const total = activities.curated.length + activities.discovered.length + activities.user.length;
      console.log(`📊 Total activities available: ${total}`);
      return total;
    } catch (error) {
      console.error('Error getting total activity count:', error);
      // Fallback to static library count
      return 280;
    }
  }

  /**
   * Check if background sync has been initialized
   */
  static isBackgroundSyncInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Force a refresh of all activities
   */
  static async refreshAllActivities(dogId?: string): Promise<void> {
    this.isInitialized = false;
    await this.initializeAllActivities(dogId);
  }
}