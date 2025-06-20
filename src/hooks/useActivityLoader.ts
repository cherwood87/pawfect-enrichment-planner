import { useCallback, useState } from "react";
import { getDiscoveredActivities } from "@/data/activityLibrary";
import { ContentDiscoveryService } from "@/services/ContentDiscoveryService";
import { SyncService } from "@/services/core/SyncService";
import { ActivityRepository } from "@/services/data/ActivityRepository";
import type { ScheduledActivity, UserActivity } from "@/types/activity";
import type {
	ContentDiscoveryConfig,
	DiscoveredActivity,
} from "@/types/discovery";
import type { Dog } from "@/types/dog";

export const useActivityLoader = (currentDog: Dog | null) => {
	const [isLoading, setIsLoading] = useState(false);
	const [migrationFlags, setMigrationFlags] = useState<Record<string, boolean>>(
		{},
	);

	// Check if migration has already been performed for this dog
	const hasMigrated = useCallback(
		(dogId: string, type: "scheduled" | "user") => {
			const flagKey = `migrated_${type}_${dogId}`;
			return (
				migrationFlags[flagKey] || localStorage.getItem(flagKey) === "true"
			);
		},
		[migrationFlags],
	);

	// Mark migration as completed
	const markMigrated = useCallback(
		(dogId: string, type: "scheduled" | "user") => {
			const flagKey = `migrated_${type}_${dogId}`;
			localStorage.setItem(flagKey, "true");
			setMigrationFlags((prev) => ({ ...prev, [flagKey]: true }));
		},
		[],
	);

	const migrateScheduledActivity = useCallback(
		(activity: any): ScheduledActivity => {
			return {
				id: activity.id || `scheduled-${Date.now()}-${Math.random()}`,
				dogId: activity.dogId || currentDog?.id || "",
				activityId: activity.activityId || activity.id,
				scheduledDate:
					activity.scheduledDate || new Date().toISOString().split("T")[0],
				completed: activity.completed || false,
				notes: activity.notes || "",
				completionNotes: activity.completionNotes || "",
				reminderEnabled: activity.reminderEnabled || false,
				weekNumber: activity.weekNumber,
				dayOfWeek: activity.dayOfWeek,
			};
		},
		[currentDog],
	);

	const loadActivitiesFromSupabase = useCallback(
		async (
			setScheduledActivities: (activities: ScheduledActivity[]) => void,
			setUserActivities: (activities: UserActivity[]) => void,
			setDiscoveredActivities: (activities: DiscoveredActivity[]) => void,
			setDiscoveryConfig: (config: ContentDiscoveryConfig) => void,
			loadAndMigrateScheduledActivities: () => Promise<void>,
			loadAndMigrateUserActivities: () => Promise<void>,
		) => {
			if (!currentDog) return;

			try {
				setIsLoading(true);

				// Load activities in parallel for better performance
				const [supabaseData] = await Promise.allSettled([
					SyncService.loadActivitiesFromSupabase(currentDog.id),
				]);

				if (supabaseData.status === "fulfilled" && supabaseData.value) {
					const { user: userActivities, discovered: discoveredActivities } =
						supabaseData.value;

					// Load scheduled activities from repository
					const scheduledActivities =
						await ActivityRepository.getScheduledActivities(currentDog.id);

					setScheduledActivities(scheduledActivities);
					setUserActivities(userActivities);
					setDiscoveredActivities(discoveredActivities);

					console.log("✅ Loaded activities from Supabase:", {
						scheduled: scheduledActivities.length,
						user: userActivities.length,
						discovered: discoveredActivities.length,
					});
				} else {
					console.log("📱 Fallback to localStorage and migration");

					// Only migrate if not already done
					if (!hasMigrated(currentDog.id, "scheduled")) {
						await loadAndMigrateScheduledActivities();
						markMigrated(currentDog.id, "scheduled");
					}

					if (!hasMigrated(currentDog.id, "user")) {
						await loadAndMigrateUserActivities();
						markMigrated(currentDog.id, "user");
					}
				}

				// Load discovery config and discovered activities
				setDiscoveredActivities(getDiscoveredActivities());
				setDiscoveryConfig(ContentDiscoveryService.getDefaultConfig());
			} catch (error) {
				console.error("❌ Error loading activities:", error);

				// Fallback to localStorage if Supabase fails
				if (!hasMigrated(currentDog.id, "scheduled")) {
					await loadAndMigrateScheduledActivities();
					markMigrated(currentDog.id, "scheduled");
				}

				if (!hasMigrated(currentDog.id, "user")) {
					await loadAndMigrateUserActivities();
					markMigrated(currentDog.id, "user");
				}
			} finally {
				setIsLoading(false);
			}
		},
		[currentDog, hasMigrated, markMigrated],
	);

	return {
		isLoading,
		setIsLoading,
		loadActivitiesFromSupabase,
		migrateScheduledActivity,
	};
};
