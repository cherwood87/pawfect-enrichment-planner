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
   * Safe upsert that handles race conditions and constraint violations
   */
  static async safeUpsertSubscription(data: SubscriptionData): Promise<{ success: boolean; error?: string }> {
    const maxRetries = 3;
    const baseDelay = 100; // Start with 100ms delay

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // First, try to get existing subscription
        const { data: existingData, error: fetchError } = await supabase
          .from('subscribers')
          .select('*')
          .eq('user_id', data.user_id)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('subscribers')
            .update({
              email: data.email,
              subscribed: data.subscribed,
              subscription_tier: data.subscription_tier,
              subscription_status: data.subscription_status,
              subscription_end: data.subscription_end,
              stripe_customer_id: data.stripe_customer_id,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', data.user_id);

          if (updateError) {
            throw updateError;
          }

          console.log(`✅ Updated subscription for user ${data.user_id}`);
          return { success: true };
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('subscribers')
            .insert({
              user_id: data.user_id,
              email: data.email,
              subscribed: data.subscribed,
              subscription_tier: data.subscription_tier,
              subscription_status: data.subscription_status,
              subscription_end: data.subscription_end,
              stripe_customer_id: data.stripe_customer_id,
            });

          if (insertError) {
            // Check if it's a constraint violation (race condition)
            if (insertError.message.includes('duplicate key value violates unique constraint')) {
              console.log(`⚠️ Race condition detected, retrying... (attempt ${attempt + 1})`);
              
              // Add exponential backoff delay
              const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
              await new Promise(resolve => setTimeout(resolve, delay));
              continue; // Retry the operation
            } else {
              throw insertError;
            }
          }

          console.log(`✅ Created subscription for user ${data.user_id}`);
          return { success: true };
        }
      } catch (error) {
        console.error(`❌ Attempt ${attempt + 1} failed for user ${data.user_id}:`, error);
        
        if (attempt === maxRetries - 1) {
          // Last attempt failed
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`💥 All attempts failed for user ${data.user_id}:`, errorMessage);
          return { 
            success: false, 
            error: `Failed to create/update subscription after ${maxRetries} attempts: ${errorMessage}` 
          };
        }

        // Add delay before next retry
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return { success: false, error: 'Unexpected error in retry loop' };
  }

  /**
   * Get subscription status safely
   */
  static async getSubscriptionStatus(userId: string): Promise<{
    success: boolean;
    data?: SubscriptionData;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || undefined };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Cancel subscription safely
   */
  static async cancelSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('subscribers')
        .update({
          subscribed: false,
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
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