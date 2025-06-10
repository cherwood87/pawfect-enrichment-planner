
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
import { Suspense, lazy, useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { initializeCriticalPreloads } from "@/utils/preloadManager";
import { useBundleAnalytics } from "@/hooks/useBundleAnalytics";

// Lazy load all route components with better chunking
const IndexOptimized = lazy(() => 
  import("./pages/IndexOptimized").then(module => ({
    default: module.default
  }))
);

const Landing = lazy(() => 
  import("./pages/Landing").then(module => ({
    default: module.default
  }))
);

const Auth = lazy(() => 
  import("./pages/Auth").then(module => ({
    default: module.default
  }))
);

const Coach = lazy(() => 
  import("./pages/Coach").then(module => ({
    default: module.default
  }))
);

const DogProfileQuizPage = lazy(() => 
  import("./pages/DogProfileQuiz").then(module => ({
    default: module.default
  }))
);

const ActivityLibraryPage = lazy(() => 
  import("./pages/ActivityLibraryPage").then(module => ({
    default: module.default
  }))
);

const WeeklyPlannerPage = lazy(() => 
  import("./pages/WeeklyPlannerPage").then(module => ({
    default: module.default
  }))
);

const AccountSettings = lazy(() => 
  import("./pages/AccountSettings").then(module => ({
    default: module.default
  }))
);

const NotFound = lazy(() => 
  import("./pages/NotFound").then(module => ({
    default: module.default
  }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.message?.includes('auth') || error?.status === 401) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

// Loading fallback component with bundle analytics
const PageLoader = () => {
  const { getMetrics } = useBundleAnalytics('PageLoader');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
};

const App = () => {
  const { getMetrics } = useBundleAnalytics('App');

  useEffect(() => {
    // Initialize critical preloads as soon as the app starts
    initializeCriticalPreloads();

    // Preload critical route chunks after initial load
    setTimeout(() => {
      import("./pages/IndexOptimized");
      import("./pages/Landing");
    }, 1000);
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
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/app" element={
                            <ProtectedRoute>
                              <ErrorBoundary>
                                <IndexOptimized />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          } />
                          <Route path="/coach" element={
                            <ProtectedRoute>
                              <ErrorBoundary>
                                <Coach />
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
                          <Route path="/dog-profile-quiz" element={
                            <ProtectedRoute>
                              <ErrorBoundary>
                                <DogProfileQuizPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          } />
                          <Route path="/settings" element={
                            <ProtectedRoute>
                              <ErrorBoundary>
                                <AccountSettings />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          } />
                          <Route path="/" element={
                            <ErrorBoundary>
                              <Landing />
                            </ErrorBoundary>
                          } />
                          <Route path="*" element={
                            <ErrorBoundary>
                              <NotFound />
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
