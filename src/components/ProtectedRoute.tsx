import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNetworkHealth } from "@/hooks/useNetworkHealth";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { AlertCircle, Wifi, WifiOff, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session, loading, error } = useAuth();
  const {
    isOnline,
    isSupabaseConnected,
    retryConnection,
    isRecovering,
    connectionStability,
    canRetry,
  } = useNetworkHealth();

  // Show loading with improved timeout handling
  if (loading) {
    console.log("⏳ ProtectedRoute: Auth loading, showing skeleton");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  // Handle auth errors with better UX
  if (error && !error.includes("offline")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => (window.location.href = "/auth")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Handle offline mode gracefully
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
            You can still browse your enrichment activities, but some features
            may be limited.
          </p>
          <div className="space-y-3">
            <Button
              onClick={retryConnection}
              disabled={isRecovering}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Wifi className="w-4 h-4 mr-2" />
              {isRecovering ? "Checking..." : "Try to Reconnect"}
            </Button>
            {user && (
              <Button
                onClick={() => (window.location.href = "/app")}
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

  // Handle Supabase connection issues
  if (!isSupabaseConnected) {
    const stabilityPercent = Math.round(connectionStability * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            {isRecovering ? (
              <Activity className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
            ) : (
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isRecovering
              ? "Reconnecting..."
              : "Service Temporarily Unavailable"}
          </h2>
          <p className="text-gray-600 mb-4">
            {isRecovering
              ? "Attempting to restore connection to our services."
              : "We're having trouble connecting to our services. Please try again in a moment."}
          </p>
          {!isRecovering && (
            <div className="text-sm text-gray-500 mb-6">
              Connection stability: {stabilityPercent}%
            </div>
          )}
          {canRetry && !isRecovering && (
            <Button
              onClick={retryConnection}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Wifi className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          )}
          {!canRetry && !isRecovering && (
            <p className="text-sm text-gray-500">
              Please check your internet connection and try refreshing the page.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Check authentication
  if (!user || !session) {
    console.log("🚫 ProtectedRoute: No auth, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("✅ ProtectedRoute: User authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
