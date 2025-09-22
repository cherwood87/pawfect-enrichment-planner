import React, { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DogProvider } from "@/contexts/DogContext";
import { ActivityProvider } from "@/contexts/ActivityContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import UnifiedErrorBoundary from "@/components/error/UnifiedErrorBoundary";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { FLAGS } from "@/constants/flags";
import { useRouteAnalytics } from "@/hooks/useRouteAnalytics";
import { preloadCriticalDependencies, preloadNonCriticalDependencies } from "@/utils/lazyImports";

// Lazy load all pages for better bundle splitting with enhanced error handling
const Index = lazy(() => import("./pages/Index"));
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const Coach = lazy(() => import("./pages/Coach"));
const DogProfileQuizPage = lazy(() => import("./pages/DogProfileQuiz"));
const ActivityLibraryPage = lazy(() => import("./pages/ActivityLibraryPage"));
const WeeklyPlannerPage = lazy(() => import("./pages/WeeklyPlannerPage"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Subscribe = lazy(() => import("./pages/Subscribe"));
const DogDetails = lazy(() => import("./pages/DogDetails"));
const DogQuizRoute = lazy(() => import("./pages/DogQuizRoute"));
const ChatSafetyTest = lazy(() => import("./pages/ChatSafetyTest"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
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

const AppRoutes = () => {
  useRouteAnalytics(); // Track route changes
  
  return (
    <Routes>
                        <Route path="/auth" element={
                          <UnifiedErrorBoundary context="Auth">
                            <Auth />
                          </UnifiedErrorBoundary>
                        } />
                        <Route path="/subscribe" element={
                          <UnifiedErrorBoundary context="Subscribe">
                            <Subscribe />
                          </UnifiedErrorBoundary>
                        } />
                        <Route path="/dogs" element={<Navigate to="/settings?tab=dogs" replace />} />
                        <Route path="/dogs/:id" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <UnifiedErrorBoundary context="Dog Details">
                                <DogDetails />
                              </UnifiedErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        <Route path="/dogs/:id/quiz" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <UnifiedErrorBoundary context="Dog Quiz">
                                <DogQuizRoute />
                              </UnifiedErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        <Route path="/activities" element={<Navigate to="/activity-library" replace />} />
                        <Route path="/app" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <UnifiedErrorBoundary context="Dashboard">
                                <Index />
                              </UnifiedErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        <Route path="/coach" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <UnifiedErrorBoundary context="Coach">
                                <Coach />
                              </UnifiedErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        <Route path="/activity-library" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <UnifiedErrorBoundary context="Activity Library">
                                <ActivityLibraryPage />
                              </UnifiedErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        {FLAGS.ENABLE_WEEKLY_PLANNER && (
                          <Route path="/weekly-planner" element={
                            <ProtectedRoute>
                              <SubscriptionGuard>
                                <UnifiedErrorBoundary context="Weekly Planner">
                                  <WeeklyPlannerPage />
                                </UnifiedErrorBoundary>
                              </SubscriptionGuard>
                            </ProtectedRoute>
                          } />
                        )}
                        <Route path="/dog-profile-dashboard/activity-library" element={<Navigate to="/activity-library" replace />} />
                        <Route path="/dog-profile-quiz" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <UnifiedErrorBoundary context="Dog Profile Quiz">
                                <DogProfileQuizPage />
                              </UnifiedErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                         <Route path="/settings" element={
                           <ProtectedRoute>
                             <UnifiedErrorBoundary context="Settings">
                               <AccountSettings />
                             </UnifiedErrorBoundary>
                           </ProtectedRoute>
                         } />
                         <Route path="/chat-safety-test" element={
                           <ProtectedRoute>
                             <UnifiedErrorBoundary context="Chat Safety Test">
                               <ChatSafetyTest />
                             </UnifiedErrorBoundary>
                           </ProtectedRoute>
                         } />
                        <Route path="/" element={
                          <UnifiedErrorBoundary context="Landing">
                            <Landing />
                          </UnifiedErrorBoundary>
                        } />
                        <Route path="*" element={
                          <UnifiedErrorBoundary context="Not Found">
                            <NotFound />
                          </UnifiedErrorBoundary>
                        } />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    // Preload critical dependencies after initial render
    preloadCriticalDependencies();
    
    // Load non-critical dependencies after a delay
    setTimeout(preloadNonCriticalDependencies, 2000);
  }, []);

  return (
    <UnifiedErrorBoundary context="App Root">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <DogProvider>
              <ActivityProvider>
                <ChatProvider>
                  <SubscriptionProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Suspense fallback={<PageLoader />}>
                        <AppRoutes />
                      </Suspense>
                    </BrowserRouter>
                  </SubscriptionProvider>
                </ChatProvider>
              </ActivityProvider>
            </DogProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </UnifiedErrorBoundary>
  );
};

export default App;