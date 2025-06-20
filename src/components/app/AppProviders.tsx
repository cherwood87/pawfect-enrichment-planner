
import React from 'react';
import { QueryClient } from "@tanstack/react-query";
import NetworkErrorBoundary from "@/components/error/NetworkErrorBoundary";
import ConditionalProviders from './ConditionalProviders';

interface AppProvidersProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children, queryClient }) => {
  return (
    <NetworkErrorBoundary>
      <ConditionalProviders queryClient={queryClient}>
        {children}
      </ConditionalProviders>
    </NetworkErrorBoundary>
  );
};

export default AppProviders;
