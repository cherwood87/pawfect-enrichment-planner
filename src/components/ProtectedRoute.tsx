
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkResilience } from '@/hooks/useNetworkResilience';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session, loading, isConnected } = useAuth();
  const { isOnline, isSupabaseConnected, retryConnection } = useNetworkResilience();

  // Show loading with a maximum time limit to prevent infinite loading
  if (loading) {
    console.log('⏳ ProtectedRoute: Auth loading, showing skeleton');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  // Handle offline mode gracefully - still allow access if user was previously authenticated
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <WifiOff className="w-16 h-16 text-yellow-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            You're Offline
          </h2>
          <p className="text-gray-600 mb-6">
            You can still browse your enrichment activities, but some features may be limited.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={retryConnection}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Wifi className="w-4 h-4 mr-2" />
              Try to Reconnect
            </Button>
            {user && (
              <Button 
                onClick={() => window.location.href = '/app'}
                variant="outline"
                className="w-full"
              >
                Continue Offline
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle Supabase connection issues with graceful degradation
  if (!isSupabaseConnected && isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Service Temporarily Unavailable
          </h2>
          <p className="text-gray-600 mb-6">
            We're having trouble connecting to our services. Please try again in a moment.
          </p>
          <Button 
            onClick={retryConnection}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Wifi className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!user || !session) {
    console.log('🚫 ProtectedRoute: No auth, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('✅ ProtectedRoute: User authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
