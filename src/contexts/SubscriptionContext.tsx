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

  // Check subscription from database
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
      const { data, error: dbError } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier, subscription_end, subscription_status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (dbError) {
        console.error('Error fetching subscription:', dbError);
        setError('Failed to check subscription status');
        setStatus('inactive');
        return;
      }

      if (data) {
        const isActive = data.subscribed && 
                        (!data.subscription_end || new Date(data.subscription_end) > new Date());
        
        setStatus(isActive ? 'active' : 'inactive');
        setTier(data.subscription_tier || undefined);
        setEndDate(data.subscription_end || undefined);
      } else {
        // No subscription record found
        setStatus('inactive');
        setTier(undefined);
        setEndDate(undefined);
      }
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
    if (!user) {
      setError('User must be authenticated');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      // For demo purposes - insert/update subscription record
      const { error: upsertError } = await supabase
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email!,
          subscribed: true,
          subscription_tier: 'Premium',
          subscription_status: 'active',
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      if (upsertError) {
        throw upsertError;
      }

      await checkSubscription();
    } catch (err) {
      console.error('Activation error:', err);
      setError('Failed to activate subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const cancel = async () => {
    if (!user) {
      setError('User must be authenticated');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          subscribed: false,
          subscription_status: 'cancelled',
        })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

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
