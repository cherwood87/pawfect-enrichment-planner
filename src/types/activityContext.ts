import type {
	ActivityLibraryItem,
	PillarGoals,
	ScheduledActivity,
	StreakData,
	UserActivity,
	WeeklyProgress,
} from "@/types/activity";
import type {
	ContentDiscoveryConfig,
	DiscoveredActivity,
} from "@/types/discovery";

export interface ActivityHelpContext {
	type: "activity-help";
	activityName: string;
	activityPillar: string;
	activityDifficulty: string;
	activityDuration: number;
}

export interface ActivityContextType {
	scheduledActivities: ScheduledActivity[];
	userActivities: UserActivity[];
	discoveredActivities: DiscoveredActivity[];
	discoveryConfig: ContentDiscoveryConfig;
	isDiscovering: boolean;
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
	getCombinedActivityLibrary: () => (
		| ActivityLibraryItem
		| DiscoveredActivity
	)[];
	discoverNewActivities: () => Promise<void>;
	approveDiscoveredActivity: (activityId: string) => void;
	rejectDiscoveredActivity: (activityId: string) => void;
	updateDiscoveryConfig: (config: Partial<ContentDiscoveryConfig>) => void;
	checkAndRunAutoDiscovery?: () => Promise<void>;
	// Sync functionality
	isSyncing: boolean;
	lastSyncTime: Date | null;
	syncToSupabase: () => Promise<any>;
}
