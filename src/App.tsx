
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
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Coach from "./pages/Coach";
import DogProfileQuizPage from "./pages/DogProfileQuiz";
import ActivityLibraryPage from "./pages/ActivityLibraryPage";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/coach" element={
                    <ProtectedRoute>
                      <Coach />
                    </ProtectedRoute>
                  } />
                  <Route path="/activity-library" element={
                    <ProtectedRoute>
                      <ActivityLibraryPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/dog-profile-quiz" element={
                    <ProtectedRoute>
                      <DogProfileQuizPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <AccountSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/" element={<Landing />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ChatProvider>
          </ActivityProvider>
        </DogProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
