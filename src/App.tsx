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
import { Suspense, lazy } from "react";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

// Lazy load all pages for better bundle splitting
const Index = lazy(() => import("./pages/Index"));
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const Coach = lazy(() => import("./pages/Coach"));
const DogProfileQuizPage = lazy(() => import("./pages/DogProfileQuiz"));
const ActivityLibraryPage = lazy(() => import("./pages/ActivityLibraryPage"));
const WeeklyPlannerPage = lazy(() => import("./pages/WeeklyPlannerPage"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OpenAITestPage = lazy(() => import("./pages/OpenAITestPage"));
const Subscribe = lazy(() => import("./pages/Subscribe"));
const DogsHome = lazy(() => import("./pages/DogsHome"));
const DogDetails = lazy(() => import("./pages/DogDetails"));
const DogQuizRoute = lazy(() => import("./pages/DogQuizRoute"));

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

const App = () => (
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
                        <Route path="/subscribe" element={<ErrorBoundary><Subscribe /></ErrorBoundary>} />
                        <Route path="/dogs" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <ErrorBoundary>
                                <DogsHome />
                              </ErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        <Route path="/dogs/:id" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <ErrorBoundary>
                                <DogDetails />
                              </ErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        <Route path="/dogs/:id/quiz" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <ErrorBoundary>
                                <DogQuizRoute />
                              </ErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        <Route path="/activities" element={
                          <ProtectedRoute>
                            <SubscriptionGuard>
                              <ErrorBoundary>
                                <ActivityLibraryPage />
                              </ErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        <Route path="/app" element={
                          <ProtectedRoute>
                            <ErrorBoundary>
                              <Index />
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
                            <SubscriptionGuard>
                              <ErrorBoundary>
                                <ActivityLibraryPage />
                              </ErrorBoundary>
                            </SubscriptionGuard>
                          </ProtectedRoute>
                        } />
                        <Route path="/weekly-planner" element={
                          <ProtectedRoute>
                            <ErrorBoundary>
                              <WeeklyPlannerPage />
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
                        <Route path="/openai-test" element={
                          <ProtectedRoute>
                            <ErrorBoundary>
                              <OpenAITestPage />
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

export default App;