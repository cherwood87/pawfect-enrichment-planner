import LoadingSpinner from "@/components/ui/loading-spinner";
import { createLoadableComponent } from "@/utils/componentLoader";

// Route-level lazy loading with reduced timeouts (3-5 seconds)
export const LazyIndexOptimized = createLoadableComponent(
	() => import("@/pages/IndexOptimized"),
	{ timeout: 4000 }, // Reduced from 15000
);

export const LazyLanding = createLoadableComponent(
	() => import("@/pages/Landing"),
	{ timeout: 3000 }, // Reduced from 10000
);

export const LazyAuth = createLoadableComponent(
	() => import("@/pages/Auth"),
	{ timeout: 3000 }, // Reduced from 8000
);

export const LazyCoach = createLoadableComponent(
	() => import("@/pages/Coach"),
	{ timeout: 4000 }, // Reduced from 12000
);

export const LazyDogProfileQuizPage = createLoadableComponent(
	() => import("@/pages/DogProfileQuiz"),
	{ timeout: 3000 }, // Reduced from 10000
);

export const LazyActivityLibraryPage = createLoadableComponent(
	() => import("@/pages/ActivityLibraryPage"),
	{ timeout: 5000 }, // Reduced from 15000
);

export const LazyWeeklyPlannerPage = createLoadableComponent(
	() => import("@/pages/WeeklyPlannerPage"),
	{ timeout: 5000 }, // Reduced from 15000
);

export const LazyAccountSettings = createLoadableComponent(
	() => import("@/pages/AccountSettings"),
	{ timeout: 3000 }, // Reduced from 8000
);

export const LazyNotFound = createLoadableComponent(
	() => import("@/pages/NotFound"),
	{ timeout: 2000 }, // Reduced from 5000
);

// Heavy component lazy loading with shorter timeouts
export const LazyActivityLibrary = createLoadableComponent(
	() => import("@/components/ActivityLibrary"),
	{ timeout: 4000 }, // Reduced from 12000
);

export const LazyWeeklyPlannerV2 = createLoadableComponent(
	() => import("@/components/weekly-planner/WeeklyPlannerV2"),
	{ timeout: 4000 }, // Reduced from 12000
);

export const LazyDashboardContent = createLoadableComponent(
	() => import("@/components/dashboard/DashboardContent"),
	{ timeout: 3000 }, // Reduced from 10000
);

// Improved fallback component for lazy loading
export const LazyLoadingFallback = () => (
	<div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
		<div className="text-center space-y-4 max-w-md p-8">
			<LoadingSpinner size="lg" />
			<div className="space-y-2">
				<p className="text-sm font-medium text-gray-700">Loading...</p>
				<p className="text-xs text-gray-500">This should only take a moment</p>
			</div>
		</div>
	</div>
);
