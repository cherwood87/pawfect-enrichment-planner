import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SyncDomainService } from "@/services/domain/SyncDomainService";
import type { UserActivity } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

export const useActivitySync = () => {
	const [isSyncing, setIsSyncing] = useState(false);
	const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
	const { toast } = useToast();

	const performSync = async (
		discoveredActivities: DiscoveredActivity[],
		userActivities: UserActivity[],
		dogId?: string,
	) => {
		setIsSyncing(true);

		try {
			const result = await SyncDomainService.performFullSync(
				discoveredActivities,
				userActivities,
				dogId,
			);

			if (result.success) {
				setLastSyncTime(new Date());
				toast({
					title: "Sync Complete",
					description: `Successfully synced ${result.totalSynced} activities to Supabase.`,
				});
			} else {
				toast({
					title: "Sync Failed",
					description: result.error || "Failed to sync activities.",
					variant: "destructive",
				});
			}

			return result;
		} catch (error) {
			console.error("Sync error:", error);
			toast({
				title: "Sync Error",
				description: "An unexpected error occurred during sync.",
				variant: "destructive",
			});
			return {
				success: false,
				error: "Unexpected error",
				totalSynced: 0,
				details: {},
			};
		} finally {
			setIsSyncing(false);
		}
	};

	return {
		isSyncing,
		lastSyncTime,
		performSync,
	};
};
