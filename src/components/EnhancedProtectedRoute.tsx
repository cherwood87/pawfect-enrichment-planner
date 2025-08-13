import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthSecurityService } from '@/services/security/AuthSecurityService';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface EnhancedProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const EnhancedProtectedRoute: React.FC<EnhancedProtectedRouteProps> = ({ 
  children, 
  requiresSubscription = false 
}) => {
  const { user, session, loading, error } = useAuth();

  // Show loading while auth is determining state
  if (loading) {
    console.log('⏳ EnhancedProtectedRoute: Auth loading, showing skeleton');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  // Check for auth errors
  if (error) {
    console.log('❌ EnhancedProtectedRoute: Auth error, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Redirect unauthenticated users
  if (!user || !session) {
    console.log('🚫 EnhancedProtectedRoute: No auth, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Additional session validation for security
  React.useEffect(() => {
    const validateSession = async () => {
      const isValid = await AuthSecurityService.validateSession();
      if (!isValid) {
        console.log('🚫 EnhancedProtectedRoute: Invalid session detected, cleaning up');
        window.location.href = '/auth';
      }
    };

    validateSession();
  }, []);

  console.log('✅ EnhancedProtectedRoute: User authenticated, rendering children');
  return <>{children}</>;
};

export default EnhancedProtectedRoute;