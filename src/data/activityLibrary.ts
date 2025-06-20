import type { ActivityLibraryItem } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";
import { weightedShuffle } from "@/utils/weightedShuffle";
import { environmentalActivities } from "./activities/environmentalActivities";
import { instinctualActivities } from "./activities/instinctualActivities";
import { mentalActivities } from "./activities/mentalActivities";
import { physicalActivities } from "./activities/physicalActivities";
import { socialActivities } from "./activities/socialActivities";

export const activityLibrary: ActivityLibraryItem[] = [
	...mentalActivities,
	...physicalActivities,
	...socialActivities,
	...environmentalActivities,
	...instinctualActivities,
];

// Helper function to get random activities with weighted shuffling
export function getRandomActivities(count: number = 5): ActivityLibraryItem[] {
	const shuffled = weightedShuffle([...activityLibrary]);
	return shuffled.slice(0, count);
}

// Helper function to get activities by pillar
export function getActivitiesByPillar(pillar: string): ActivityLibraryItem[] {
	return activityLibrary.filter((activity) => activity.pillar === pillar);
}

// Helper function to get activities by difficulty
export function getActivitiesByDifficulty(
	difficulty: string,
): ActivityLibraryItem[] {
	return activityLibrary.filter(
		(activity) => activity.difficulty === difficulty,
	);
}

// Helper function to get activities by duration
export function getActivitiesByDuration(
	maxDuration: number,
): ActivityLibraryItem[] {
	return activityLibrary.filter((activity) => activity.duration <= maxDuration);
}

// Helper function to get discovered activities (placeholder for now)
export function getDiscoveredActivities(dogId?: string): any[] {
	if (!dogId) return [];
	const saved = localStorage.getItem(`discoveredActivities-${dogId}`);
	return saved ? JSON.parse(saved) : [];
}

// Get activity by ID from library
export function getActivityById(id: string): ActivityLibraryItem | undefined {
	return activityLibrary.find((activity) => activity.id === id);
}

// Get activities by pillar with weighted shuffling
export function getPillarActivities(
	pillar?: string | null,
): ActivityLibraryItem[] {
	if (!pillar || pillar === "all") {
		return weightedShuffle([...activityLibrary]);
	}
	const pillarActivities = getActivitiesByPillar(pillar);
	return weightedShuffle(pillarActivities);
}

// Search combined activities (library + discovered) with weighted results
export function searchCombinedActivities(
	query: string,
	discoveredActivities: DiscoveredActivity[],
): (ActivityLibraryItem | DiscoveredActivity)[] {
	const combinedActivities = getCombinedActivities(discoveredActivities);
	const lowercaseQuery = query.toLowerCase();

	const matchingActivities = combinedActivities.filter(
		(activity) =>
			activity.title.toLowerCase().includes(lowercaseQuery) ||
			activity.pillar.toLowerCase().includes(lowercaseQuery) ||
			activity.tags?.some((tag) =>
				tag.toLowerCase().includes(lowercaseQuery),
			) ||
			activity.benefits?.toLowerCase().includes(lowercaseQuery),
	);

	// Apply weighted shuffling to search results to promote discovered activities
	return weightedShuffle(matchingActivities);
}

// Get combined activities (library + discovered) with weighted shuffling
export function getCombinedActivities(
	discoveredActivities: DiscoveredActivity[],
): (ActivityLibraryItem | DiscoveredActivity)[] {
	const approvedDiscovered = discoveredActivities.filter(
		(activity) => activity.approved,
	);
	const combined = [...activityLibrary, ...approvedDiscovered];

	// Apply weighted shuffling to promote discovered activities
	return weightedShuffle(combined);
}
