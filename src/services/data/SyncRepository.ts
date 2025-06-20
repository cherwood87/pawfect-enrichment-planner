import { ActivityLibraryItem, UserActivity } from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";
import { SupabaseAdapter } from "../integration/SupabaseAdapter";
import { ActivitySyncService } from "../ActivitySyncService";

export class SyncRepository {
  static async fullSync(
    discoveredActivities: DiscoveredActivity[],
    userActivities: UserActivity[],
    dogId?: string,
  ): Promise<{
    success: boolean;
    error?: string;
    totalSynced: number;
    details: any;
  }> {
    try {
      console.log("Starting full activity sync...");

      // Use the existing ActivitySyncService for now
      return await ActivitySyncService.fullSync(
        discoveredActivities,
        userActivities,
        dogId,
      );
    } catch (error) {
      console.error("Failed to complete full sync:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        totalSynced: 0,
        details: {},
      };
    }
  }

  static async syncCuratedActivities(): Promise<{
    success: boolean;
    error?: string;
    synced: number;
  }> {
    return await ActivitySyncService.syncCuratedActivities();
  }

  static async syncDiscoveredActivities(
    activities: DiscoveredActivity[],
    dogId: string,
  ): Promise<{ success: boolean; error?: string; synced: number }> {
    return await SupabaseAdapter.syncActivitiesToSupabase(
      activities,
      "discovered",
      dogId,
    );
  }

  static async syncUserActivities(
    activities: UserActivity[],
    dogId: string,
  ): Promise<{ success: boolean; error?: string; synced: number }> {
    return await SupabaseAdapter.syncActivitiesToSupabase(
      activities,
      "user",
      dogId,
    );
  }

  static async loadActivitiesFromSupabase(dogId?: string): Promise<{
    curated: ActivityLibraryItem[];
    discovered: DiscoveredActivity[];
    user: UserActivity[];
  }> {
    return await ActivitySyncService.loadActivitiesFromSupabase(dogId);
  }
}
