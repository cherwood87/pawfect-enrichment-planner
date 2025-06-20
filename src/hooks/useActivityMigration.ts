import { ActivityService } from "@/services/activityService";
import type { ScheduledActivity, UserActivity } from "@/types/activity";
import type { Dog } from "@/types/dog";

export const useActivityMigration = (
	currentDog: Dog | null,
	setScheduledActivities: (activities: ScheduledActivity[]) => void,
	setUserActivities: (activities: UserActivity[]) => void,
	migrateScheduledActivity: (activity: any) => ScheduledActivity,
) => {
	const loadAndMigrateScheduledActivities = async () => {
		if (!currentDog) return;

		const savedScheduled = localStorage.getItem(
			`scheduledActivities-${currentDog.id}`,
		);
		if (savedScheduled) {
			const parsedActivities = JSON.parse(savedScheduled);
			const migratedActivities = parsedActivities.map(migrateScheduledActivity);
			setScheduledActivities(migratedActivities);

			// Migrate to Supabase in background
			try {
				await ActivityService.migrateScheduledActivitiesFromLocalStorage(
					currentDog.id,
				);
				console.log("Scheduled activities migrated to Supabase");
				// Optionally: clear localStorage after successful migration
				// localStorage.removeItem(`scheduledActivities-${currentDog.id}`);
			} catch (error) {
				console.error("Failed to migrate scheduled activities:", error);
			}
		} else {
			// Initialize with default activities for new dogs
			const today = new Date().toISOString().split("T")[0];
			const defaultActivities: ScheduledActivity[] = [
				{
					id: `scheduled-default-1-${currentDog.id}`,
					dogId: currentDog.id,
					activityId: "physical-morning-walk",
					scheduledDate: today,
					completed: false,
					notes: "",
					completionNotes: "",
					reminderEnabled: false,
				},
				{
					id: `scheduled-default-2-${currentDog.id}`,
					dogId: currentDog.id,
					activityId: "mental-puzzle-feeder",
					scheduledDate: today,
					completed: false,
					notes: "",
					completionNotes: "",
					reminderEnabled: false,
				},
				{
					id: `scheduled-default-3-${currentDog.id}`,
					dogId: currentDog.id,
					activityId: "environmental-new-route",
					scheduledDate: today,
					completed: false,
					notes: "",
					completionNotes: "",
					reminderEnabled: false,
				},
			];
			setScheduledActivities(defaultActivities);
			// Optionally: save these to Supabase as well
			try {
				for (const activity of defaultActivities) {
					await ActivityService.createScheduledActivity(activity);
				}
			} catch (error) {
				console.error(
					"Failed to save default scheduled activities to Supabase:",
					error,
				);
			}
		}
	};

	const loadAndMigrateUserActivities = async () => {
		if (!currentDog) return;

		const savedUser = localStorage.getItem(`userActivities-${currentDog.id}`);
		if (savedUser) {
			const parsedActivities = JSON.parse(savedUser);
			setUserActivities(parsedActivities);

			// Migrate to Supabase in background
			try {
				await ActivityService.migrateUserActivitiesFromLocalStorage(
					currentDog.id,
				);
				console.log("User activities migrated to Supabase");
				// Optionally: clear localStorage after successful migration
				// localStorage.removeItem(`userActivities-${currentDog.id}`);
			} catch (error) {
				console.error("Failed to migrate user activities:", error);
			}
		} else {
			setUserActivities([]);
		}
	};

	return {
		loadAndMigrateScheduledActivities,
		loadAndMigrateUserActivities,
	};
};
