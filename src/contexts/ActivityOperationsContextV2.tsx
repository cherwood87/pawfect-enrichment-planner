import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { useDog } from "@/contexts/DogContext";
import { useActivityActions as useActivityActionsCore } from "@/hooks/core/useActivityActions";
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
import { useActivityActions, useActivityData } from "./ActivityStateContextV2";

// Split contexts for operations as well
interface ActivityCrudOperationsType {
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
}

interface ActivityQueryOperationsType {
	getTodaysActivities: () => ScheduledActivity[];
	getActivityDetails: (
		activityId: string,
	) => ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined;
	getStreakData: () => StreakData;
	getWeeklyProgress: () => WeeklyProgress[];
	getPillarBalance: () => Record<string, number>;
	getDailyGoals: () => PillarGoals;
}

const ActivityCrudOperationsContext = createContext<
	ActivityCrudOperationsType | undefined
>(undefined);
const ActivityQueryOperationsContext = createContext<
	ActivityQueryOperationsType | undefined
>(undefined);

export const useActivityCrudOperations = () => {
	const context = useContext(ActivityCrudOperationsContext);
	if (!context) {
		throw new Error(
			"useActivityCrudOperations must be used within an ActivityOperationsV2Provider",
		);
	}
	return context;
};

export const useActivityQueryOperations = () => {
	const context = useContext(ActivityQueryOperationsContext);
	if (!context) {
		throw new Error(
			"useActivityQueryOperations must be used within an ActivityOperationsV2Provider",
		);
	}
	return context;
};

// Combined hook for backward compatibility
export const useActivityOperationsV2 = () => {
	const crud = useActivityCrudOperations();
	const query = useActivityQueryOperations();
	return { ...crud, ...query };
};

export const ActivityOperationsV2Provider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { currentDog } = useDog();
	const { scheduledActivities, userActivities, discoveredActivities } =
		useActivityData();
	const { setScheduledActivities, setUserActivities } = useActivityActions();

	// CRUD operations
	const {
		addScheduledActivity,
		toggleActivityCompletion,
		updateScheduledActivity,
		addUserActivity,
	} = useActivityActionsCore(
		setScheduledActivities,
		setUserActivities,
		currentDog,
		scheduledActivities,
	);

	// Query operations
	const queryOps = useActivityOperationsCore(
		scheduledActivities,
		userActivities,
		discoveredActivities,
		currentDog,
	);

	// Memoize CRUD operations
	const crudValue = useMemo<ActivityCrudOperationsType>(
		() => ({
			addScheduledActivity,
			toggleActivityCompletion,
			updateScheduledActivity,
			addUserActivity,
		}),
		[
			addScheduledActivity,
			toggleActivityCompletion,
			updateScheduledActivity,
			addUserActivity,
		],
	);

	// Memoize query operations
	const queryValue = useMemo<ActivityQueryOperationsType>(
		() => ({
			getTodaysActivities: queryOps.getTodaysActivities,
			getActivityDetails: queryOps.getActivityDetails,
			getStreakData: queryOps.getStreakData,
			getWeeklyProgress: queryOps.getWeeklyProgress,
			getPillarBalance: queryOps.getPillarBalance,
			getDailyGoals: queryOps.getDailyGoals,
		}),
		[queryOps],
	);

	return (
		<ActivityCrudOperationsContext.Provider value={crudValue}>
			<ActivityQueryOperationsContext.Provider value={queryValue}>
				{children}
			</ActivityQueryOperationsContext.Provider>
		</ActivityCrudOperationsContext.Provider>
	);
};
