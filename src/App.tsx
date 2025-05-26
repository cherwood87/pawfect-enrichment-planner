
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DogProvider } from "@/contexts/DogContext";
import { ActivityProvider } from "@/contexts/ActivityContext";
import { ChatProvider } from "@/contexts/ChatContext";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Coach from "./pages/Coach";
import DogProfileQuizPage from "./pages/DogProfileQuiz";
import ActivityLibraryPage from "./pages/ActivityLibraryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DogProvider>
        <ActivityProvider>
          <ChatProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/app" element={<Index />} />
                <Route path="/coach" element={<Coach />} />
                <Route path="/activity-library" element={<ActivityLibraryPage />} />
                <Route path="/dog-profile-quiz" element={<DogProfileQuizPage />} />
                <Route path="/" element={<Landing />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </ActivityProvider>
      </DogProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
