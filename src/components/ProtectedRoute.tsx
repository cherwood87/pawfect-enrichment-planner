
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, session } = useAuth();

  // Debug logging for protected route behavior
  useEffect(() => {
    console.log('🛡️ ProtectedRoute check');
    console.log('👤 User:', user?.email || 'none');
    console.log('📱 Session:', session ? 'exists' : 'none');
    console.log('⏳ Loading:', loading);
  }, [user, session, loading]);

  if (loading) {
    console.log('⏳ ProtectedRoute: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
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
