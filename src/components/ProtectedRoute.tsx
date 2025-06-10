
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

  // Show loading only while auth is determining state
  if (loading) {
    console.log('⏳ ProtectedRoute: Auth loading, showing skeleton');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  // Handle network issues
  if (!isOnline || !isSupabaseConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            {!isOnline ? (
              <WifiOff className="w-16 h-16 text-red-500 mx-auto" />
            ) : (
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {!isOnline ? 'No Internet Connection' : 'Service Unavailable'}
          </h2>
          <p className="text-gray-600 mb-6">
            {!isOnline 
              ? 'Please check your internet connection and try again.'
              : 'Unable to connect to our services. Please try again.'
            }
          </p>
          <Button 
            onClick={retryConnection}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Wifi className="w-4 h-4 mr-2" />
            Try Again
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
