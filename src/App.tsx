
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import AppProviders from '@/components/app/AppProviders';
import AppRoutes from '@/components/app/AppRoutes';
import { createQueryClient } from '@/config/queryClientConfig';
import { useAppInitialization } from '@/hooks/useAppInitialization';

const queryClient = createQueryClient();

const AppContent: React.FC = () => {
  useAppInitialization();

  return (
    <ErrorBoundary>
      <AppProviders queryClient={queryClient}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;
