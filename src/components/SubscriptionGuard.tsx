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

  // Show loading while checking subscription status
  if (isLoading) {
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
