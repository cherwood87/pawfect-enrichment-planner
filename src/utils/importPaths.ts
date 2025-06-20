/**
 * Centralized import path configuration for consistent imports across the application.
 * This helps maintain clean and standardized import statements.
 */

// Component imports
export const COMPONENT_PATHS = {
	// UI Components
	UI: {
		DIALOG: "@/components/ui/dialog",
		SHEET: "@/components/ui/sheet",
		BUTTON: "@/components/ui/button",
		BADGE: "@/components/ui/badge",
		CARD: "@/components/ui/card",
		TOAST: "@/components/ui/toast",
		FORM: "@/components/ui/form",
		INPUT: "@/components/ui/input",
		SELECT: "@/components/ui/select",
		TEXTAREA: "@/components/ui/textarea",
		CHECKBOX: "@/components/ui/checkbox",
		TABS: "@/components/ui/tabs",
	},

	// Feature Components
	ACTIVITY: {
		MODAL: "@/components/ActivityModal",
		LIBRARY: "@/components/ActivityLibrary",
		LIBRARY_GRID: "@/components/ActivityLibraryGrid",
		CARD: "@/components/ActivityCard",
	},

	WEEKLY_PLANNER: {
		CARD: "@/components/WeeklyPlannerCard",
		VERTICAL_DAY_CARD: "@/components/weekly-planner/VerticalDayCard",
		DAY_ACTIVITY_CARD: "@/components/weekly-planner/DayActivityCard",
		ACTIVITY_DETAIL_MODAL: "@/components/weekly-planner/ActivityDetailModal",
		HEADER: "@/components/weekly-planner/WeeklyPlannerHeader",
		SUMMARY: "@/components/weekly-planner/WeeklySummary",
		EMPTY: "@/components/weekly-planner/EmptyWeeklyPlanner",
	},

	DASHBOARD: {
		MODALS: "@/components/dashboard/DashboardModals",
		CONTENT: "@/components/dashboard/DashboardContent",
		HEADER: "@/components/dashboard/DashboardHeader",
		STATS: "@/components/dashboard/QuickStats",
		FLOATING_CHAT: "@/components/dashboard/FloatingChatButton",
	},

	FORMS: {
		ADD_DOG: "@/components/AddDogForm",
		EDIT_DOG: "@/components/EditDogForm",
		DOG_FIELDS: "@/components/DogFormFields",
	},

	CHAT: {
		MODAL: "@/components/chat/ChatModal",
		BUTTON: "@/components/chat/CoachButton",
	},
} as const;

// Hook imports
export const HOOK_PATHS = {
	ACTIVITY_ACTIONS: "@/hooks/useActivityActions",
	ACTIVITY_FILTERING: "@/hooks/useActivityFiltering",
	ACTIVITY_OPERATIONS: "@/hooks/useActivityOperations",
	ACTIVITY_STATE: "@/hooks/useActivityState",
	RETRY: "@/hooks/useRetry",
	TOAST: "@/hooks/use-toast",
	MOBILE: "@/hooks/use-mobile",
	JOURNAL_ENTRY: "@/hooks/useJournalEntry",
	FAVOURITES: "@/hooks/useFavourites",
} as const;

// Context imports
export const CONTEXT_PATHS = {
	ACTIVITY: "@/contexts/ActivityContext",
	DOG: "@/contexts/DogContext",
	AUTH: "@/contexts/AuthContext",
	CHAT: "@/contexts/ChatContext",
	DISCOVERY: "@/contexts/DiscoveryContext",
	SYNC: "@/contexts/SyncContext",
} as const;

// Type imports
export const TYPE_PATHS = {
	ACTIVITY: "@/types/activity",
	DOG: "@/types/dog",
	DISCOVERY: "@/types/discovery",
	CHAT: "@/types/chat",
	JOURNAL: "@/types/journal",
	QUIZ: "@/types/quiz",
	ACTIVITY_CONTEXT: "@/types/activityContext",
} as const;

// Service imports
export const SERVICE_PATHS = {
	DOMAIN: {
		ACTIVITY: "@/services/domain/ActivityDomainService",
		DISCOVERY: "@/services/domain/DiscoveryDomainService",
		SYNC: "@/services/domain/SyncDomainService",
	},
	DATA: {
		ACTIVITY_REPO: "@/services/data/ActivityRepository",
		DISCOVERY_REPO: "@/services/data/DiscoveryRepository",
		SYNC_REPO: "@/services/data/SyncRepository",
	},
	INTEGRATION: {
		LOCAL_STORAGE: "@/services/integration/LocalStorageAdapter",
		SUPABASE: "@/services/integration/SupabaseAdapter",
	},
	LEGACY: {
		ACTIVITY: "@/services/activityService",
		DOG: "@/services/dogService",
		JOURNAL: "@/services/journalService",
		FAVOURITES: "@/services/favouritesService",
		MIGRATION: "@/services/migrationService",
	},
} as const;

// Utility imports
export const UTILITY_PATHS = {
	ERROR_UTILS: "@/utils/errorUtils",
	DATA_VALIDATION: "@/utils/dataValidation",
	TIME_UTILS: "@/utils/timeUtils",
	AUTH_UTILS: "@/utils/authUtils",
	QUIZ_ANALYSIS: "@/utils/quizAnalysis",
	WEIGHTED_SHUFFLE: "@/utils/weightedShuffle",
	LIB_UTILS: "@/lib/utils",
} as const;

// Data imports
export const DATA_PATHS = {
	ACTIVITY_LIBRARY: "@/data/activityLibrary",
	QUIZ_QUESTIONS: "@/data/quizQuestions",
	ACTIVITIES: {
		MENTAL: "@/data/activities/mentalActivities",
		PHYSICAL: "@/data/activities/physicalActivities",
		SOCIAL: "@/data/activities/socialActivities",
		ENVIRONMENTAL: "@/data/activities/environmentalActivities",
		INSTINCTUAL: "@/data/activities/instinctualActivities",
	},
} as const;

// Icon imports from lucide-react
export const ICON_PATHS = {
	LUCIDE: "lucide-react",
} as const;

/**
 * Helper function to validate import paths at build time
 */
export const validateImportPath = (path: string): boolean => {
	const allPaths = [
		...Object.values(COMPONENT_PATHS).flatMap((section) =>
			Object.values(section),
		),
		...Object.values(HOOK_PATHS),
		...Object.values(CONTEXT_PATHS),
		...Object.values(TYPE_PATHS),
		...Object.values(SERVICE_PATHS).flatMap((section) =>
			Object.values(section),
		),
		...Object.values(UTILITY_PATHS),
		...Object.values(DATA_PATHS.ACTIVITIES),
		DATA_PATHS.ACTIVITY_LIBRARY,
		DATA_PATHS.QUIZ_QUESTIONS,
		ICON_PATHS.LUCIDE,
	] as string[];

	return allPaths.includes(path);
};

/**
 * Helper function to get commonly used import groups
 */
export const getCommonImports = () => ({
	react: "react",
	ui: [
		COMPONENT_PATHS.UI.DIALOG,
		COMPONENT_PATHS.UI.BUTTON,
		COMPONENT_PATHS.UI.BADGE,
		COMPONENT_PATHS.UI.CARD,
	],
	contexts: [CONTEXT_PATHS.ACTIVITY, CONTEXT_PATHS.DOG, CONTEXT_PATHS.AUTH],
	hooks: [HOOK_PATHS.TOAST, HOOK_PATHS.RETRY],
	types: [TYPE_PATHS.ACTIVITY, TYPE_PATHS.DOG],
	utils: [UTILITY_PATHS.ERROR_UTILS, UTILITY_PATHS.DATA_VALIDATION],
});
