import { useMemo } from "react";
import type { ActivityLibraryItem } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

// Simple, fast filtering without caching overhead
export const useSimpleFiltering = (
	searchQuery: string,
	selectedPillar: string,
	selectedDifficulty: string,
	activities: (ActivityLibraryItem | DiscoveredActivity)[],
) => {
	const filteredActivities = useMemo(() => {
		let filtered = activities;

		// Apply pillar filter first (most selective)
		if (selectedPillar !== "all") {
			filtered = filtered.filter(
				(activity) => activity.pillar === selectedPillar,
			);
		}

		// Apply difficulty filter
		if (selectedDifficulty !== "all") {
			filtered = filtered.filter(
				(activity) => activity.difficulty === selectedDifficulty,
			);
		}

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter(
				(activity) =>
					activity.title.toLowerCase().includes(query) ||
					activity.pillar.toLowerCase().includes(query) ||
					activity.difficulty.toLowerCase().includes(query),
			);
		}

		return filtered;
	}, [activities, searchQuery, selectedPillar, selectedDifficulty]);

	return filteredActivities;
};
