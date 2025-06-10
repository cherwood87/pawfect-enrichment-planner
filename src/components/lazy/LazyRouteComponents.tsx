
import { createLoadableComponent } from '@/utils/componentLoader';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Route-level lazy loading with optimized chunking
export const LazyIndexOptimized = createLoadableComponent(
  () => import('@/pages/IndexOptimized'),
  { timeout: 15000 }
);

export const LazyLanding = createLoadableComponent(
  () => import('@/pages/Landing'),
  { timeout: 10000 }
);

export const LazyAuth = createLoadableComponent(
  () => import('@/pages/Auth'),
  { timeout: 8000 }
);

export const LazyCoach = createLoadableComponent(
  () => import('@/pages/Coach'),
  { timeout: 12000 }
);

export const LazyDogProfileQuizPage = createLoadableComponent(
  () => import('@/pages/DogProfileQuiz'),
  { timeout: 10000 }
);

export const LazyActivityLibraryPage = createLoadableComponent(
  () => import('@/pages/ActivityLibraryPage'),
  { timeout: 15000 }
);

export const LazyWeeklyPlannerPage = createLoadableComponent(
  () => import('@/pages/WeeklyPlannerPage'),
  { timeout: 15000 }
);

export const LazyAccountSettings = createLoadableComponent(
  () => import('@/pages/AccountSettings'),
  { timeout: 8000 }
);

export const LazyNotFound = createLoadableComponent(
  () => import('@/pages/NotFound'),
  { timeout: 5000 }
);

// Heavy component lazy loading
export const LazyActivityLibrary = createLoadableComponent(
  () => import('@/components/ActivityLibrary'),
  { timeout: 12000 }
);

export const LazyWeeklyPlannerV2 = createLoadableComponent(
  () => import('@/components/weekly-planner/WeeklyPlannerV2'),
  { timeout: 12000 }
);

export const LazyDashboardContent = createLoadableComponent(
  () => import('@/components/dashboard/DashboardContent'),
  { timeout: 10000 }
);

// Fallback component for lazy loading
export const LazyLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);
