import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import LazyLoadErrorBoundary from "@/components/error/LazyLoadErrorBoundary";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  LazyLanding,
  LazyAuth,
  LazyCoach,
  LazyDogProfileQuizPage,
  LazyAccountSettings,
  LazyNotFound,
} from "@/components/lazy/LazyRouteComponents";

// Import critical routes directly for better performance
import IndexOptimized from "@/pages/IndexOptimized";
import ActivityLibraryPage from "@/pages/ActivityLibraryPage";
import WeeklyPlannerPage from "@/pages/WeeklyPlannerPage";

// Immediate fallback for critical routes
const CriticalRouteFallback = ({ routeName }: { routeName: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
    <div className="text-center space-y-4 max-w-sm p-8">
      <LoadingSpinner size="lg" />
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Loading {routeName}...
        </p>
        <p className="text-xs text-gray-500">Please wait a moment</p>
      </div>
    </div>
  </div>
);

// Fast fallback for non-critical routes
const StandardRouteFallback = ({ routeName }: { routeName: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50 flex items-center justify-center">
    <div className="text-center space-y-3 max-w-xs p-6">
      <LoadingSpinner size="md" />
      <p className="text-sm text-gray-600">Loading {routeName}...</p>
    </div>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <LazyLoadErrorBoundary componentName="Authentication">
            <Suspense fallback={<StandardRouteFallback routeName="Sign In" />}>
              <LazyAuth />
            </Suspense>
          </LazyLoadErrorBoundary>
        }
      />

      {/* Critical routes with direct imports and immediate fallbacks */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <LazyLoadErrorBoundary componentName="Dashboard">
              <Suspense
                fallback={<CriticalRouteFallback routeName="Dashboard" />}
              >
                <IndexOptimized />
              </Suspense>
            </LazyLoadErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity-library"
        element={
          <ProtectedRoute>
            <LazyLoadErrorBoundary componentName="Activity Library">
              <Suspense
                fallback={
                  <CriticalRouteFallback routeName="Activity Library" />
                }
              >
                <ActivityLibraryPage />
              </Suspense>
            </LazyLoadErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dog-profile-dashboard/activity-library"
        element={
          <ProtectedRoute>
            <LazyLoadErrorBoundary componentName="Activity Library">
              <Suspense
                fallback={
                  <CriticalRouteFallback routeName="Activity Library" />
                }
              >
                <ActivityLibraryPage />
              </Suspense>
            </LazyLoadErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dog-profile-dashboard/weekly-plan"
        element={
          <ProtectedRoute>
            <LazyLoadErrorBoundary componentName="Weekly Planner">
              <Suspense
                fallback={<CriticalRouteFallback routeName="Weekly Planner" />}
              >
                <WeeklyPlannerPage />
              </Suspense>
            </LazyLoadErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Non-critical routes with lazy loading */}
      <Route
        path="/coach"
        element={
          <ProtectedRoute>
            <LazyLoadErrorBoundary componentName="Coach">
              <Suspense fallback={<StandardRouteFallback routeName="Coach" />}>
                <LazyCoach />
              </Suspense>
            </LazyLoadErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dog-profile-quiz"
        element={
          <ProtectedRoute>
            <LazyLoadErrorBoundary componentName="Dog Profile Quiz">
              <Suspense
                fallback={<StandardRouteFallback routeName="Dog Quiz" />}
              >
                <LazyDogProfileQuizPage />
              </Suspense>
            </LazyLoadErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <LazyLoadErrorBoundary componentName="Account Settings">
              <Suspense
                fallback={<StandardRouteFallback routeName="Settings" />}
              >
                <LazyAccountSettings />
              </Suspense>
            </LazyLoadErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <LazyLoadErrorBoundary componentName="Home">
            <Suspense fallback={<StandardRouteFallback routeName="Home" />}>
              <LazyLanding />
            </Suspense>
          </LazyLoadErrorBoundary>
        }
      />

      <Route
        path="*"
        element={
          <LazyLoadErrorBoundary componentName="Page">
            <Suspense fallback={<StandardRouteFallback routeName="Page" />}>
              <LazyNotFound />
            </Suspense>
          </LazyLoadErrorBoundary>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
