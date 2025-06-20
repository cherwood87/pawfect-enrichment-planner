import { useMemo } from "react";
import { searchCombinedActivities } from "@/data/activityLibrary";
import type { ActivityLibraryItem } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

export const useActivityFiltering = (
	searchQuery: string,
	selectedPillar: string,
	selectedDifficulty: string,
	currentActivities: (ActivityLibraryItem | DiscoveredActivity)[],
	discoveredActivities: DiscoveredActivity[],
) => {
	const filteredActivities = useMemo(() => {
		let activities = searchQuery
			? searchCombinedActivities(searchQuery, discoveredActivities)
			: currentActivities;

		if (selectedPillar !== "all") {
			activities = activities.filter(
				(activity) => activity.pillar === selectedPillar,
			);
		}

		if (selectedDifficulty !== "all") {
			activities = activities.filter(
				(activity) => activity.difficulty === selectedDifficulty,
			);
		}

		return activities;
	}, [
		searchQuery,
		selectedPillar,
		selectedDifficulty,
		currentActivities,
		discoveredActivities,
	]);

	return filteredActivities;
};
