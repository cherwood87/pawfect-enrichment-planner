import { supabase } from "@/integrations/supabase/client";
import { ActivityLibraryItem, UserActivity } from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";
import { activityLibrary } from "@/data/activityLibrary";

interface SupabaseActivity {
  id: string;
  title: string;
  pillar: string;
  difficulty: string;
  duration: number;
  materials: string[];
  emotional_goals: string[];
  instructions: string[];
  benefits: string;
  tags: string[];
  age_group: string;
  energy_level: string;
  source: "curated" | "discovered" | "user";
  is_custom: boolean;
  dog_id?: string;
  source_url?: string;
  discovered_at?: string;
  verified: boolean;
  quality_score: number;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

interface SyncResult {
  success: boolean;
  error?: string;
  synced: number;
}

export class ActivitySyncService {
  private static transformToSupabaseActivity(
    activity: ActivityLibraryItem | DiscoveredActivity | UserActivity,
    source: "curated" | "discovered" | "user",
    dogId?: string,
  ): Omit<SupabaseActivity, "created_at" | "updated_at"> {
    const baseActivity = {
      id: activity.id,
      title: activity.title,
      pillar: activity.pillar,
      difficulty: activity.difficulty,
      duration: activity.duration,
      materials: activity.materials || [],
      emotional_goals: activity.emotionalGoals || [],
      instructions: activity.instructions || [],
      benefits: activity.benefits || "",
      tags: activity.tags || [],
      age_group: activity.ageGroup || "All Ages",
      energy_level: activity.energyLevel || "Medium",
      source,
      is_custom: source === "user",
      verified: true,
      quality_score: 1.0,
      approved: true,
    };

    if (source === "discovered") {
      const discoveredActivity = activity as DiscoveredActivity;
      return {
        ...baseActivity,
        dog_id: dogId,
        source_url: discoveredActivity.sourceUrl,
        discovered_at:
          discoveredActivity.discoveredAt || new Date().toISOString(),
        verified: discoveredActivity.verified || false,
        quality_score: discoveredActivity.qualityScore || 0.5,
        approved: discoveredActivity.approved || false,
      };
    }

    if (source === "user") {
      return {
        ...baseActivity,
        dog_id: dogId,
      };
    }

    // Curated activities don't have dog_id
    return baseActivity;
  }

  static async syncCuratedActivities(): Promise<SyncResult> {
    try {
      console.log("Starting curated activities sync...");

      const activitiesToSync = activityLibrary.map((activity) =>
        this.transformToSupabaseActivity(activity, "curated"),
      );

      const { error } = await supabase
        .from("activities")
        .upsert(activitiesToSync, {
          onConflict: "id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error("Error syncing curated activities:", error);
        return { success: false, error: error.message, synced: 0 };
      }

      console.log(
        `Successfully synced ${activitiesToSync.length} curated activities`,
      );
      return { success: true, synced: activitiesToSync.length };
    } catch (error) {
      console.error("Failed to sync curated activities:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        synced: 0,
      };
    }
  }

  static async syncDiscoveredActivities(
    discoveredActivities: DiscoveredActivity[],
    dogId: string,
  ): Promise<SyncResult> {
    try {
      console.log(`Starting discovered activities sync for dog ${dogId}...`);

      if (!discoveredActivities.length) {
        return { success: true, synced: 0 };
      }

      const activitiesToSync = discoveredActivities.map((activity) =>
        this.transformToSupabaseActivity(activity, "discovered", dogId),
      );

      const { error } = await supabase
        .from("activities")
        .upsert(activitiesToSync, {
          onConflict: "id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error("Error syncing discovered activities:", error);
        return { success: false, error: error.message, synced: 0 };
      }

      console.log(
        `Successfully synced ${activitiesToSync.length} discovered activities`,
      );
      return { success: true, synced: activitiesToSync.length };
    } catch (error) {
      console.error("Failed to sync discovered activities:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        synced: 0,
      };
    }
  }

  static async syncUserActivities(
    userActivities: UserActivity[],
    dogId: string,
  ): Promise<SyncResult> {
    try {
      console.log(`Starting user activities sync for dog ${dogId}...`);

      if (!userActivities.length) {
        return { success: true, synced: 0 };
      }

      const activitiesToSync = userActivities.map((activity) =>
        this.transformToSupabaseActivity(activity, "user", dogId),
      );

      const { error } = await supabase
        .from("activities")
        .upsert(activitiesToSync, {
          onConflict: "id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error("Error syncing user activities:", error);
        return { success: false, error: error.message, synced: 0 };
      }

      console.log(
        `Successfully synced ${activitiesToSync.length} user activities`,
      );
      return { success: true, synced: activitiesToSync.length };
    } catch (error) {
      console.error("Failed to sync user activities:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        synced: 0,
      };
    }
  }

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

      // Always sync curated activities
      const curatedResult = await this.syncCuratedActivities();

      let discoveredResult: SyncResult = { success: true, synced: 0 };
      let userResult: SyncResult = { success: true, synced: 0 };

      // Only sync dog-specific activities if dogId is provided
      if (dogId) {
        discoveredResult = await this.syncDiscoveredActivities(
          discoveredActivities,
          dogId,
        );
        userResult = await this.syncUserActivities(userActivities, dogId);
      }

      const allSuccessful =
        curatedResult.success && discoveredResult.success && userResult.success;
      const totalSynced =
        curatedResult.synced + discoveredResult.synced + userResult.synced;

      // Collect all error messages
      const errors = [
        curatedResult.error,
        discoveredResult.error,
        userResult.error,
      ].filter(Boolean);

      const result = {
        success: allSuccessful,
        error: !allSuccessful ? errors.join("; ") : undefined,
        totalSynced,
        details: {
          curated: curatedResult,
          discovered: discoveredResult,
          user: userResult,
        },
      };

      console.log("Full sync completed:", result);
      return result;
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

  static async loadActivitiesFromSupabase(dogId?: string): Promise<{
    curated: ActivityLibraryItem[];
    discovered: DiscoveredActivity[];
    user: UserActivity[];
  }> {
    try {
      console.log("Loading activities from Supabase...");

      let query = supabase.from("activities").select("*");

      if (dogId) {
        query = query.or(
          `source.eq.curated,and(source.neq.curated,dog_id.eq.${dogId})`,
        );
      } else {
        query = query.eq("source", "curated");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading activities from Supabase:", error);
        return { curated: [], discovered: [], user: [] };
      }

      const activities = data || [];

      const curated: ActivityLibraryItem[] = [];
      const discovered: DiscoveredActivity[] = [];
      const user: UserActivity[] = [];

      activities.forEach((activity) => {
        const baseActivity = {
          id: activity.id,
          title: activity.title,
          pillar: activity.pillar as any,
          difficulty: activity.difficulty as any,
          duration: activity.duration,
          materials: activity.materials || [],
          emotionalGoals: activity.emotional_goals || [],
          instructions: activity.instructions || [],
          benefits: activity.benefits || "",
          tags: activity.tags || [],
          ageGroup: activity.age_group as any,
          energyLevel: activity.energy_level as any,
        };

        if (activity.source === "curated") {
          curated.push(baseActivity);
        } else if (activity.source === "discovered") {
          discovered.push({
            ...baseActivity,
            source: "discovered",
            sourceUrl: activity.source_url,
            discoveredAt: activity.discovered_at,
            verified: activity.verified,
            qualityScore: activity.quality_score,
            approved: activity.approved,
          });
        } else if (activity.source === "user") {
          user.push({
            ...baseActivity,
            isCustom: true,
            createdAt: activity.created_at,
            dogId: activity.dog_id!,
          });
        }
      });

      console.log(
        `Loaded ${curated.length} curated, ${discovered.length} discovered, ${user.length} user activities`,
      );
      return { curated, discovered, user };
    } catch (error) {
      console.error("Failed to load activities from Supabase:", error);
      return { curated: [], discovered: [], user: [] };
    }
  }
}
