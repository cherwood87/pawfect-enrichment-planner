
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DogProvider } from "@/contexts/DogContext";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import DogProfileQuizPage from "./pages/DogProfileQuiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DogProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/app" element={<Index />} />
            <Route path="/dog-profile-quiz" element={<DogProfileQuizPage />} />
            <Route path="/" element={<Landing />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DogProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
