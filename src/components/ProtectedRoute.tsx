
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session, loading } = useAuth();

  // Show loading only while auth is determining state
  if (loading) {
    console.log('⏳ ProtectedRoute: Auth loading, showing skeleton');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <LoadingSkeleton type="dashboard" />
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
