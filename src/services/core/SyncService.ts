import type { UserActivity } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";
import { SyncDomainService } from "../domain/SyncDomainService";

export class SyncService {
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
		return SyncDomainService.performFullSync(
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
		return SyncDomainService.syncCuratedActivities();
	}

	static async syncDiscoveredActivities(
		activities: DiscoveredActivity[],
		dogId: string,
	): Promise<{ success: boolean; error?: string; synced: number }> {
		return SyncDomainService.syncDiscoveredActivities(activities, dogId);
	}

	static async syncUserActivities(
		activities: UserActivity[],
		dogId: string,
	): Promise<{ success: boolean; error?: string; synced: number }> {
		return SyncDomainService.syncUserActivities(activities, dogId);
	}

	static async loadActivitiesFromSupabase(dogId?: string) {
		return SyncDomainService.loadActivitiesFromSupabase(dogId);
	}
}
