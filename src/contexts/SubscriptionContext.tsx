import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

// Very lightweight, client-side subscription state with localStorage persistence.
// Replace with real billing (Stripe) later. Keys and logic are intentionally simple.

type SubscriptionStatus = 'active' | 'inactive';

interface SubscriptionContextType {
  status: SubscriptionStatus;
  isActive: boolean;
  activate: () => void;
  cancel: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEY = 'subscription_status';

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SubscriptionStatus>('inactive');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SubscriptionStatus | null;
      if (saved === 'active' || saved === 'inactive') setStatus(saved);
    } catch (e) {
      console.warn('Subscription status read failed:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, status);
    } catch (e) {
      console.warn('Subscription status write failed:', e);
    }
  }, [status]);

  const value = useMemo<SubscriptionContextType>(() => ({
    status,
    isActive: status === 'active',
    activate: () => setStatus('active'),
    cancel: () => setStatus('inactive'),
  }), [status]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};
