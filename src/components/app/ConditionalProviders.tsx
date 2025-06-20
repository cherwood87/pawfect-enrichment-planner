import React, { memo, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DogProvider } from "@/contexts/DogContext";
import { ActivityProvider } from "@/contexts/ActivityContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ProviderErrorBoundary from "@/components/error/ProviderErrorBoundary";

interface ConditionalProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

// Memoized individual providers to prevent unnecessary re-renders
const MemoizedQueryClientProvider = memo<{
  children: React.ReactNode;
  client: QueryClient;
}>(({ children, client }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
));

const MemoizedTooltipProvider = memo<{ children: React.ReactNode }>(
  ({ children }) => <TooltipProvider>{children}</TooltipProvider>,
);

const MemoizedAuthProvider = memo<{ children: React.ReactNode }>(
  ({ children }) => <AuthProvider>{children}</AuthProvider>,
);

const MemoizedDogProvider = memo<{ children: React.ReactNode }>(
  ({ children }) => <DogProvider>{children}</DogProvider>,
);

const MemoizedActivityProvider = memo<{ children: React.ReactNode }>(
  ({ children }) => <ActivityProvider>{children}</ActivityProvider>,
);

const MemoizedChatProvider = memo<{ children: React.ReactNode }>(
  ({ children }) => <ChatProvider>{children}</ChatProvider>,
);

// Conditional loading wrapper
const ConditionalProvider: React.FC<{
  condition?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ condition = true, fallback = null, children }) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};

const ConditionalProviders: React.FC<ConditionalProviderProps> = ({
  children,
  queryClient,
}) => {
  // Memoize the provider configuration
  const providerConfig = useMemo(
    () => ({
      enableQuery: true,
      enableTooltip: true,
      enableAuth: true,
      enableDog: true,
      enableActivity: true,
      enableChat: true,
    }),
    [],
  );

  return (
    <ProviderErrorBoundary providerName="QueryClient" critical>
      <ConditionalProvider condition={providerConfig.enableQuery}>
        <MemoizedQueryClientProvider client={queryClient}>
          <ProviderErrorBoundary providerName="Tooltip">
            <ConditionalProvider condition={providerConfig.enableTooltip}>
              <MemoizedTooltipProvider>
                <ProviderErrorBoundary providerName="Auth" critical>
                  <ConditionalProvider condition={providerConfig.enableAuth}>
                    <MemoizedAuthProvider>
                      <ProviderErrorBoundary providerName="Dog">
                        <ConditionalProvider
                          condition={providerConfig.enableDog}
                        >
                          <MemoizedDogProvider>
                            <ProviderErrorBoundary providerName="Activity">
                              <ConditionalProvider
                                condition={providerConfig.enableActivity}
                              >
                                <MemoizedActivityProvider>
                                  <ProviderErrorBoundary providerName="Chat">
                                    <ConditionalProvider
                                      condition={providerConfig.enableChat}
                                    >
                                      <MemoizedChatProvider>
                                        {children}
                                      </MemoizedChatProvider>
                                    </ConditionalProvider>
                                  </ProviderErrorBoundary>
                                </MemoizedActivityProvider>
                              </ConditionalProvider>
                            </ProviderErrorBoundary>
                          </MemoizedDogProvider>
                        </ConditionalProvider>
                      </ProviderErrorBoundary>
                    </MemoizedAuthProvider>
                  </ConditionalProvider>
                </ProviderErrorBoundary>
              </MemoizedTooltipProvider>
            </ConditionalProvider>
          </ProviderErrorBoundary>
        </MemoizedQueryClientProvider>
      </ConditionalProvider>
    </ProviderErrorBoundary>
  );
};

export default ConditionalProviders;
