import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type SubscriptionStatus = 'active' | 'inactive' | 'pending' | 'cancelled';

interface SubscriptionData {
  status: SubscriptionStatus;
  tier?: string;
  end_date?: string;
  stripe_customer_id?: string;
}

interface SubscriptionContextType {
  status: SubscriptionStatus;
  isActive: boolean;
  isLoading: boolean;
  tier?: string;
  endDate?: string;
  activate: () => Promise<void>;
  cancel: () => Promise<void>;
  checkSubscription: () => Promise<void>;
  error?: string;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>('inactive');
  const [isLoading, setIsLoading] = useState(false);
  const [tier, setTier] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [error, setError] = useState<string>();

  // Check subscription from Stripe via edge function
  const checkSubscription = async () => {
    if (!user || !session) {
      setStatus('inactive');
      setTier(undefined);
      setEndDate(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('check-subscription');

      if (fnError) {
        console.error('Error checking subscription:', fnError);
        setError('Failed to check subscription status');
        setStatus('inactive');
        return;
      }

      const isActive = data?.subscribed || false;
      setStatus(isActive ? 'active' : 'inactive');
      setTier(data?.product_id || undefined);
      setEndDate(data?.subscription_end || undefined);

    } catch (err) {
      console.error('Subscription check error:', err);
      setError('Failed to verify subscription');
      setStatus('inactive');
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription when user changes
  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  const activate = async () => {
    // Refresh subscription status from Stripe
    await checkSubscription();
  };

  const cancel = async () => {
    if (!user) {
      setError('User must be authenticated');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      // For demo purposes - update local subscription record
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          subscribed: false,
          subscription_status: 'cancelled',
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.warn('Local update error:', updateError);
      }

      // Refresh from Stripe
      await checkSubscription();
    } catch (err) {
      console.error('Cancellation error:', err);
      setError('Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo<SubscriptionContextType>(() => ({
    status,
    isActive: status === 'active',
    isLoading,
    tier,
    endDate,
    activate,
    cancel,
    checkSubscription,
    error,
  }), [status, isLoading, tier, endDate, error]);

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
