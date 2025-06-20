import { useCallback } from "react";
import { useLearningSystem } from "./useLearningSystem";

export const useInteractionTracking = () => {
	const { trackInteraction } = useLearningSystem();

	// Track activity views
	const trackActivityView = useCallback(
		(
			activityId: string,
			activityType: "library" | "user" | "discovered",
			pillar?: string,
		) => {
			trackInteraction("activity_view", {
				activityId,
				activityType,
				pillar,
				timestamp: new Date().toISOString(),
			});
		},
		[trackInteraction],
	);

	// Track activity scheduling
	const trackActivitySchedule = useCallback(
		(
			activityId: string,
			activityType: "library" | "user" | "discovered",
			scheduledDate: string,
		) => {
			trackInteraction("activity_schedule", {
				activityId,
				activityType,
				scheduledDate,
				timestamp: new Date().toISOString(),
			});
		},
		[trackInteraction],
	);

	// Track activity completion
	const trackActivityComplete = useCallback(
		(
			activityId: string,
			activityType: "library" | "user" | "discovered",
			duration?: number,
		) => {
			trackInteraction("activity_complete", {
				activityId,
				activityType,
				duration,
				timestamp: new Date().toISOString(),
			});
		},
		[trackInteraction],
	);

	// Track activity skipping
	const trackActivitySkip = useCallback(
		(activityId: string, reason?: string) => {
			trackInteraction("activity_skip", {
				activityId,
				reason,
				timestamp: new Date().toISOString(),
			});
		},
		[trackInteraction],
	);

	// Track search behavior
	const trackSearch = useCallback(
		(query: string, pillar?: string, results?: number) => {
			trackInteraction("search", {
				query,
				pillar,
				results,
				timestamp: new Date().toISOString(),
			});
		},
		[trackInteraction],
	);

	// Track filter usage
	const trackFilter = useCallback(
		(filters: Record<string, any>) => {
			trackInteraction("filter", {
				filters,
				timestamp: new Date().toISOString(),
			});
		},
		[trackInteraction],
	);

	return {
		trackActivityView,
		trackActivitySchedule,
		trackActivityComplete,
		trackActivitySkip,
		trackSearch,
		trackFilter,
	};
};
