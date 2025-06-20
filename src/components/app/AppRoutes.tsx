
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import {
  LazyLanding,
  LazyAuth,
  LazyCoach,
  LazyDogProfileQuizPage,
  LazyAccountSettings,
  LazyNotFound
} from '@/components/lazy/LazyRouteComponents';

// Import critical routes directly for better performance
import IndexOptimized from '@/pages/IndexOptimized';
import ActivityLibraryPage from '@/pages/ActivityLibraryPage';
import WeeklyPlannerPage from '@/pages/WeeklyPlannerPage';

const SimpleLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<SimpleLoadingFallback />}>
      <Routes>
        <Route path="/auth" element={<LazyAuth />} />
        
        {/* Direct imports for critical routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <IndexOptimized />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/activity-library" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <ActivityLibraryPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/dog-profile-dashboard/activity-library" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <ActivityLibraryPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/dog-profile-dashboard/weekly-plan" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <WeeklyPlannerPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/coach" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <LazyCoach />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/dog-profile-quiz" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <LazyDogProfileQuizPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <LazyAccountSettings />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={
          <ErrorBoundary>
            <LazyLanding />
          </ErrorBoundary>
        } />
        
        <Route path="*" element={
          <ErrorBoundary>
            <LazyNotFound />
          </ErrorBoundary>
        } />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
