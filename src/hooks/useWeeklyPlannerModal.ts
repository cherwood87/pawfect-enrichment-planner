import { useState } from "react";
import type {
	ActivityLibraryItem,
	ScheduledActivity,
	UserActivity,
} from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

interface ActivityModalState {
	activity: ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
	scheduledActivity: ScheduledActivity | null;
}

export const useWeeklyPlannerModal = () => {
	const [selectedActivityModal, setSelectedActivityModal] =
		useState<ActivityModalState>({
			activity: null,
			scheduledActivity: null,
		});

	const openModal = (
		activity: ActivityLibraryItem | UserActivity | DiscoveredActivity,
		scheduledActivity: ScheduledActivity,
	) => {
		setSelectedActivityModal({ activity, scheduledActivity });
	};

	const closeModal = () => {
		setSelectedActivityModal({ activity: null, scheduledActivity: null });
	};

	return {
		selectedActivityModal,
		openModal,
		closeModal,
	};
};
