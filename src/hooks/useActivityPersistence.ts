import { useEffect, useMemo } from "react";
import type { ScheduledActivity, UserActivity } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";
import type { Dog } from "@/types/dog";

export const useActivityPersistence = (
	currentDog: Dog | null,
	scheduledActivities: ScheduledActivity[],
	userActivities: UserActivity[],
	discoveredActivities: DiscoveredActivity[],
	isLoading: boolean,
) => {
	// Memoize the persistence operations to avoid unnecessary re-runs
	const persistenceKey = useMemo(
		() => (currentDog ? `activities-${currentDog.id}` : null),
		[currentDog?.id, currentDog],
	);

	// Debounced persistence - only save after data stabilizes
	useEffect(() => {
		if (!persistenceKey || isLoading) return;

		const timeoutId = setTimeout(() => {
			try {
				// Only save to localStorage as backup, primary storage is Supabase
				const data = {
					scheduled: scheduledActivities,
					user: userActivities,
					discovered: discoveredActivities,
					lastUpdated: new Date().toISOString(),
				};

				localStorage.setItem(persistenceKey, JSON.stringify(data));
			} catch (error) {
				console.warn("Failed to persist activities to localStorage:", error);
			}
		}, 1000); // Debounce by 1 second

		return () => clearTimeout(timeoutId);
	}, [
		persistenceKey,
		scheduledActivities,
		userActivities,
		discoveredActivities,
		isLoading,
	]);
};
