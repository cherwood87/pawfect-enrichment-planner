import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const { isActive, isLoading, error } = useSubscription();

  // Developer emails that get free access
  const DEVELOPER_EMAILS = ['cherwood87@gmail.com', 'info@streetwisecanine.com'];
  const isDeveloper = user?.email && DEVELOPER_EMAILS.includes(user.email);

  // Show loading while checking subscription status (unless developer)
  if (isLoading && !isDeveloper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  // If user is not authenticated, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Allow developers to bypass subscription check
  if (isDeveloper) {
    console.log('🔧 Developer access granted for:', user.email);
    return <>{children}</>;
  }

  // If subscription check failed, show error and redirect
  if (error) {
    console.error('Subscription guard error:', error);
    return <Navigate to="/subscribe" replace />;
  }

  // If not subscribed, redirect to subscription page
  if (!isActive) {
    return <Navigate to="/subscribe" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
