
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DogProvider } from "@/contexts/DogContext";
import { ActivityProvider } from "@/contexts/ActivityContext";
import { ChatProvider } from "@/contexts/ChatContext";
import NetworkErrorBoundary from "@/components/error/NetworkErrorBoundary";

interface AppProvidersProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children, queryClient }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NetworkErrorBoundary>
          <AuthProvider>
            <DogProvider>
              <ActivityProvider>
                <ChatProvider>
                  {children}
                </ChatProvider>
              </ActivityProvider>
            </DogProvider>
          </AuthProvider>
        </NetworkErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
