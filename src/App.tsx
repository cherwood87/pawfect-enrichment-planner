
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
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Coach from "./pages/Coach";
import DogProfileQuizPage from "./pages/DogProfileQuiz";
import ActivityLibraryPage from "./pages/ActivityLibraryPage";

import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";

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
                    <Routes>
                      <Route path="/auth" element={<Auth />} />
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
