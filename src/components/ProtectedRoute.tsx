
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, session } = useAuth();
  const navigate = useNavigate();

  // Debug logging for protected route behavior
  useEffect(() => {
    console.log('🛡️ ProtectedRoute check');
    console.log('👤 User:', user?.email || 'none');
    console.log('📱 Session:', session ? 'exists' : 'none');
    console.log('⏳ Loading:', loading);
  }, [user, session, loading]);

  // Handle navigation after auth state is determined
  useEffect(() => {
    if (!loading && user && session) {
      console.log('✅ ProtectedRoute: User authenticated, ensuring proper navigation');
      // Only navigate if we're not already on an app route
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/auth') {
        navigate('/app', { replace: true });
      }
    }
  }, [user, session, loading, navigate]);

  if (loading) {
    console.log('⏳ ProtectedRoute: Showing loading skeleton');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  if (!user || !session) {
    console.log('🚫 ProtectedRoute: Redirecting unauthenticated user to /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('✅ ProtectedRoute: Allowing access for authenticated user');
  return <>{children}</>;
};

export default ProtectedRoute;
