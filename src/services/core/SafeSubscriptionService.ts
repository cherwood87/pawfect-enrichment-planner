/**
 * Safe Subscription Service
 * Handles subscriber table operations with proper race condition prevention
 */

import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionData {
  user_id: string;
  email: string;
  subscribed: boolean;
  subscription_tier?: string;
  subscription_status?: string;
  subscription_end?: string;
  stripe_customer_id?: string;
}

export class SafeSubscriptionService {
  /**
   * Secure upsert using the new database security function
   */
  static async safeUpsertSubscription(data: SubscriptionData): Promise<{ success: boolean; error?: string }> {
    try {
      // Use the new secure database function
      const { data: subscriptionId, error } = await supabase
        .rpc('secure_subscription_upsert', {
          p_user_id: data.user_id,
          p_email: data.email,
          p_subscribed: data.subscribed,
          p_subscription_tier: data.subscription_tier || null,
          p_subscription_status: data.subscription_status || 'inactive',
          p_subscription_end: data.subscription_end || null,
          p_stripe_customer_id: data.stripe_customer_id || null
        });

      if (error) {
        console.error(`❌ Secure subscription upsert failed:`, error);
        return { 
          success: false, 
          error: `Failed to update subscription: ${error.message}` 
        };
      }

      console.log(`✅ Securely updated subscription for user ${data.user_id}, ID: ${subscriptionId}`);
      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`💥 Secure subscription upsert error:`, errorMessage);
      return { 
        success: false, 
        error: `Subscription operation failed: ${errorMessage}` 
      };
    }
  }

  /**
   * Get subscription status securely using the existing secure database function
   */
  static async getSubscriptionStatus(userId: string): Promise<{
    success: boolean;
    data?: SubscriptionData;
    error?: string;
  }> {
    try {
      // Use the existing secure function
      const { data, error } = await supabase
        .rpc('get_user_subscription_status', {
          p_user_id: userId
        });

      if (error) {
        console.error(`❌ Secure subscription status query failed:`, error);
        return { success: false, error: error.message };
      }

      // Convert the function result back to our SubscriptionData format
      if (data && Array.isArray(data) && data.length > 0) {
        const subscriptionInfo = data[0];
        const subscriptionData: SubscriptionData = {
          user_id: userId,
          email: '', // Email not returned by secure function for privacy
          subscribed: subscriptionInfo.subscribed,
          subscription_tier: subscriptionInfo.subscription_tier,
          subscription_status: subscriptionInfo.subscription_status,
          subscription_end: subscriptionInfo.subscription_end
        };
        return { success: true, data: subscriptionData };
      }

      return { success: true, data: undefined };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`💥 Secure subscription status error:`, errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Cancel subscription safely
   */
  static async cancelSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current subscription first to get the email
      const currentStatus = await this.getSubscriptionStatus(userId);
      if (!currentStatus.success) {
        return { success: false, error: 'Unable to retrieve current subscription' };
      }

      // Get user email from the current session (secure)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email || user.id !== userId) {
        return { success: false, error: 'Authentication required' };
      }

      // Use the secure database function for cancellation
      const { error } = await supabase
        .rpc('secure_subscription_upsert', {
          p_user_id: userId,
          p_email: user.email,
          p_subscribed: false,
          p_subscription_tier: null,
          p_subscription_status: 'cancelled',
          p_subscription_end: null,
          p_stripe_customer_id: null
        });

      if (error) {
        console.error(`❌ Secure subscription cancellation failed:`, error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Cancelled subscription for user ${userId}`);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Activate subscription safely
   */
  static async activateSubscription(
    userId: string,
    email: string,
    tier: string = 'Premium',
    durationDays: number = 30
  ): Promise<{ success: boolean; error?: string }> {
    const subscriptionEnd = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    
    return this.safeUpsertSubscription({
      user_id: userId,
      email,
      subscribed: true,
      subscription_tier: tier,
      subscription_status: 'active',
      subscription_end: subscriptionEnd,
    });
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const result = await this.getSubscriptionStatus(userId);
      
      if (!result.success || !result.data) {
        return false;
      }

      const { subscribed, subscription_end } = result.data;
      
      if (!subscribed) {
        return false;
      }

      if (subscription_end) {
        const endDate = new Date(subscription_end);
        return endDate > new Date();
      }

      // No end date means unlimited subscription
      return true;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  /**
   * Get subscription statistics for debugging
   */
  static async getSubscriptionStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    cancelled: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_status, subscription_end');

      if (error) {
        throw error;
      }

      const now = new Date();
      let active = 0;
      let expired = 0;
      let cancelled = 0;

      for (const sub of data || []) {
        if (!sub.subscribed || sub.subscription_status === 'cancelled') {
          cancelled++;
        } else if (sub.subscription_end && new Date(sub.subscription_end) <= now) {
          expired++;
        } else {
          active++;
        }
      }

      return {
        total: data?.length || 0,
        active,
        expired,
        cancelled,
      };
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      return { total: 0, active: 0, expired: 0, cancelled: 0 };
    }
  }
}