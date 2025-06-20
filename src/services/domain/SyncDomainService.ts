import type { UserActivity } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";
import { SyncRepository } from "../data/SyncRepository";

export class SyncDomainService {
	static async performFullSync(
		discoveredActivities: DiscoveredActivity[],
		userActivities: UserActivity[],
		dogId?: string,
	): Promise<{
		success: boolean;
		error?: string;
		totalSynced: number;
		details: any;
	}> {
		console.log("Domain service performing full sync...");

		return await SyncRepository.fullSync(
			discoveredActivities,
			userActivities,
			dogId,
		);
	}

	static async syncCuratedActivities(): Promise<{
		success: boolean;
		error?: string;
		synced: number;
	}> {
		console.log("Domain service syncing curated activities...");

		return await SyncRepository.syncCuratedActivities();
	}

	static async syncDiscoveredActivities(
		activities: DiscoveredActivity[],
		dogId: string,
	): Promise<{ success: boolean; error?: string; synced: number }> {
		console.log(
			`Domain service syncing ${activities.length} discovered activities for dog ${dogId}...`,
		);

		return await SyncRepository.syncDiscoveredActivities(activities, dogId);
	}

	static async syncUserActivities(
		activities: UserActivity[],
		dogId: string,
	): Promise<{ success: boolean; error?: string; synced: number }> {
		console.log(
			`Domain service syncing ${activities.length} user activities for dog ${dogId}...`,
		);

		return await SyncRepository.syncUserActivities(activities, dogId);
	}

	static async loadActivitiesFromSupabase(dogId?: string) {
		console.log("Domain service loading activities from Supabase...");

		return await SyncRepository.loadActivitiesFromSupabase(dogId);
	}
}
