import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const { isActive } = useSubscription();

  if (!isActive) {
    return <Navigate to="/subscribe" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
