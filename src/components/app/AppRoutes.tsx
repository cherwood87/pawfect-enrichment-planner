
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import {
  LazyIndexOptimized,
  LazyLanding,
  LazyAuth,
  LazyCoach,
  LazyDogProfileQuizPage,
  LazyActivityLibraryPage,
  LazyWeeklyPlannerPage,
  LazyAccountSettings,
  LazyNotFound,
  LazyLoadingFallback
} from '@/components/lazy/LazyRouteComponents';

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LazyLoadingFallback />}>
      <Routes>
        <Route path="/auth" element={<LazyAuth />} />
        <Route path="/app" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <LazyIndexOptimized />
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
        <Route path="/activity-library" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <LazyActivityLibraryPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/dog-profile-dashboard/activity-library" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <LazyActivityLibraryPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/dog-profile-dashboard/weekly-plan" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <LazyWeeklyPlannerPage />
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
