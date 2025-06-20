import type React from "react";
import { createContext, useContext } from "react";
import { useDog } from "@/contexts/DogContext";
import { useActivityActions } from "@/hooks/core/useActivityActions"; // Use the consolidated hook
import { useActivityOperations as useActivityOperationsCore } from "@/hooks/core/useActivityOperations";
import type {
	ActivityLibraryItem,
	PillarGoals,
	ScheduledActivity,
	StreakData,
	UserActivity,
	WeeklyProgress,
} from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";
import { useActivityState } from "./ActivityStateContext";

interface ActivityOperationsContextType {
	addScheduledActivity: (activity: Omit<ScheduledActivity, "id">) => void;
	toggleActivityCompletion: (
		activityId: string,
		completionNotes?: string,
	) => void;
	updateScheduledActivity: (
		activityId: string,
		updates: Partial<ScheduledActivity>,
	) => void;
	addUserActivity: (
		activity: Omit<UserActivity, "id" | "createdAt" | "dogId">,
	) => void;
	getTodaysActivities: () => ScheduledActivity[];
	getActivityDetails: (
		activityId: string,
	) => ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined;
	getStreakData: () => StreakData;
	getWeeklyProgress: () => WeeklyProgress[];
	getPillarBalance: () => Record<string, number>;
	getDailyGoals: () => PillarGoals;
}

const ActivityOperationsContext = createContext<
	ActivityOperationsContextType | undefined
>(undefined);

export const useActivityOperations = () => {
	const context = useContext(ActivityOperationsContext);
	if (!context) {
		throw new Error(
			"useActivityOperations must be used within an ActivityOperationsProvider",
		);
	}
	return context;
};

export const ActivityOperationsProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { currentDog } = useDog();
	const {
		scheduledActivities,
		userActivities,
		discoveredActivities,
		setScheduledActivities,
		setUserActivities,
	} = useActivityState();

	// Use the consolidated activity actions hook
	const {
		addScheduledActivity,
		toggleActivityCompletion,
		updateScheduledActivity,
		addUserActivity,
	} = useActivityActions(
		setScheduledActivities,
		setUserActivities,
		currentDog,
		scheduledActivities,
	);

	// Activity operations using the existing hook
	const activityOps = useActivityOperationsCore(
		scheduledActivities,
		userActivities,
		discoveredActivities,
		currentDog,
	);

	const value: ActivityOperationsContextType = {
		addScheduledActivity,
		toggleActivityCompletion,
		updateScheduledActivity,
		addUserActivity,
		getTodaysActivities: activityOps.getTodaysActivities,
		getActivityDetails: activityOps.getActivityDetails,
		getStreakData: activityOps.getStreakData,
		getWeeklyProgress: activityOps.getWeeklyProgress,
		getPillarBalance: activityOps.getPillarBalance,
		getDailyGoals: activityOps.getDailyGoals,
	};

	return (
		<ActivityOperationsContext.Provider value={value}>
			{children}
		</ActivityOperationsContext.Provider>
	);
};
