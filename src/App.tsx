
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
// Replace ErrorBoundary with EnhancedErrorBoundary for better diagnostics
import EnhancedErrorBoundary from '@/components/error/EnhancedErrorBoundary';
import AppProviders from '@/components/app/AppProviders';
import AppRoutes from '@/components/app/AppRoutes';
import { createQueryClient } from '@/config/queryClientConfig';
import { useAppInitialization } from '@/hooks/useAppInitialization';

const queryClient = createQueryClient();

const AppContent: React.FC = () => {
  useAppInitialization();

  React.useEffect(() => {
    console.log('[App] 🚀 AppContent mounting...', {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent.substring(0, 100)
    });

    // Add global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('[App] 💥 Unhandled promise rejection:', event.reason);
      // Prevent the default browser behavior
      event.preventDefault();
    };

    // Add global error handler for JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('[App] 💥 Global JavaScript error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      console.log('[App] 🧹 AppContent unmounting...');
    };
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
    console.log('[App] 🎬 App component mounting...', {
      buildTime: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      reactVersion: React.version
    });
  }, []);

  return <AppContent />;
};

export default App;
