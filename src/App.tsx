
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import EnhancedErrorBoundary from '@/components/error/EnhancedErrorBoundary';
import AppProviders from '@/components/app/AppProviders';
import AppRoutes from '@/components/app/AppRoutes';
import { createQueryClient } from '@/config/queryClientConfig';
import { useAppInitialization } from '@/hooks/useAppInitialization';

// Create query client once and memoize it
const queryClient = createQueryClient();

const AppContent: React.FC = () => {
  useAppInitialization();

  React.useEffect(() => {
    console.log('[App] Mounting AppContent with optimized providers...');
  }, []);

  return (
    <EnhancedErrorBoundary showDetails>
      <AppProviders queryClient={queryClient}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </EnhancedErrorBoundary>
  );
};

const App: React.FC = () => {
  React.useEffect(() => {
    console.log('[App] Mounting App with provider optimizations...');
  }, []);

  return <AppContent />;
};

export default App;
