
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DogProvider } from "@/contexts/DogContext";
import { ActivityProvider } from "@/contexts/ActivityContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import NetworkErrorBoundary from "@/components/error/NetworkErrorBoundary";
import { Suspense, useEffect } from "react";
import { useBundleAnalytics } from "@/hooks/useBundleAnalytics";
import { registerProgressiveComponents } from "@/utils/progressiveLoader";

// Use the new lazy loading system
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
} from "@/components/lazy/LazyRouteComponents";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.message?.includes('auth') || error?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const App = () => {
  const { getMetrics } = useBundleAnalytics('App');

  useEffect(() => {
    // Register progressive loading components
    registerProgressiveComponents();

    // Preload critical route chunks based on current route
    const currentPath = window.location.pathname;
    
    if (currentPath === '/' || currentPath === '/auth') {
      // Preload app routes for faster navigation
      setTimeout(() => {
        (LazyIndexOptimized as any).preload?.();
      }, 2000);
    } else if (currentPath.includes('/app')) {
      // Preload activity library and weekly planner
      setTimeout(() => {
        (LazyActivityLibraryPage as any).preload?.();
        (LazyWeeklyPlannerPage as any).preload?.();
      }, 1000);
    }

    // Log bundle metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 App initialized with advanced code splitting');
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <NetworkErrorBoundary>
            <AuthProvider>
              <DogProvider>
                <ActivityProvider>
                  <ChatProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
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
                    </BrowserRouter>
                  </ChatProvider>
                </ActivityProvider>
              </DogProvider>
            </AuthProvider>
          </NetworkErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
