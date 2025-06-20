
import { supabase } from '@/integrations/supabase/client';

/**
 * Comprehensive auth state cleanup utility
 */
export const cleanupAuthState = () => {
  console.log('🧹 Starting auth state cleanup...');
  
  try {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log(`🗑️ Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if it exists
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          console.log(`🗑️ Removing sessionStorage key: ${key}`);
          sessionStorage.removeItem(key);
        }
      });
    }
    
    console.log('✅ Auth state cleanup completed');
  } catch (error) {
    console.error('❌ Error during auth state cleanup:', error);
  }
};

/**
 * Simplified sign-in function with reasonable timeout
 */
export const robustSignIn = async (email: string, password: string) => {
  console.log('🔐 Starting simplified sign-in process...');
  
  try {
    // Step 1: Clean up existing state first
    cleanupAuthState();
    
    // Step 2: Sign in with email/password (with reasonable timeout)
    console.log('📧 Attempting sign in...');
    
    const signInPromise = supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Reasonable timeout - 15 seconds instead of 10
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Sign in took too long - please check your connection')), 15000)
    );

    const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
    
    if (data.user) {
      console.log('✅ Sign in successful, user:', data.user.email);
      return { data, error: null };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ Sign-in failed:', error);
    return { data: null, error };
  }
};

/**
 * Simplified sign-up function
 */
export const robustSignUp = async (email: string, password: string) => {
  console.log('🔐 Starting simplified sign-up process...');
  
  try {
    // Step 1: Clean up existing state first
    cleanupAuthState();
    
    // Step 2: Sign up with email/password
    console.log('📧 Attempting sign up...');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      console.error('❌ Sign up error:', error);
      throw error;
    }
    
    console.log('✅ Sign up successful');
    return { data, error: null };
  } catch (error) {
    console.error('❌ Sign-up failed:', error);
    return { data: null, error };
  }
};

/**
 * Simplified sign-out function
 */
export const robustSignOut = async () => {
  console.log('🔐 Starting simplified sign-out process...');
  
  try {
    // Step 1: Clean up auth state first
    cleanupAuthState();
    
    // Step 2: Attempt Supabase sign out (with reasonable timeout)
    try {
      console.log('📤 Attempting Supabase sign out...');
      
      const signOutPromise = supabase.auth.signOut({ scope: 'global' });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 5000)
      );

      await Promise.race([signOutPromise, timeoutPromise]);
      console.log('✅ Supabase sign out successful');
    } catch (signOutError) {
      console.warn('⚠️ Supabase sign out failed or timed out (continuing anyway):', signOutError);
    }
    
    // Step 3: Navigate to auth page
    console.log('🔄 Navigating to auth page...');
    window.location.href = '/auth';
    
  } catch (error) {
    console.error('❌ Error during sign-out:', error);
    // Even if everything fails, force redirect to auth page
    window.location.href = '/auth';
  }
};

/**
 * Network connectivity checker
 */
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Network connectivity check failed:', error);
    return false;
  }
};
