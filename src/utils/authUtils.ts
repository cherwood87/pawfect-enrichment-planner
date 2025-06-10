
import { supabase } from '@/integrations/supabase/client';

/**
 * Comprehensive auth state cleanup utility
 * Removes all Supabase auth-related keys from localStorage and sessionStorage
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
 * Enhanced sign-in function with aggressive timeout for better performance
 */
export const robustSignIn = async (email: string, password: string) => {
  console.log('🔐 Starting robust sign-in process...');
  
  try {
    // Step 1: Clean up existing state first
    cleanupAuthState();
    
    // Step 2: Attempt global sign out to clear any lingering sessions
    try {
      await Promise.race([
        supabase.auth.signOut({ scope: 'global' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Pre-signin cleanup timeout')), 2000))
      ]);
    } catch (err) {
      console.warn('⚠️ Pre-signin cleanup failed (continuing):', err);
    }
    
    // Step 3: Sign in with email/password with aggressive timeout
    console.log('📧 Attempting sign in with 10-second timeout...');
    
    const signInPromise = supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Reduced timeout from 15s to 10s for better UX
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Sign in timeout after 10 seconds')), 10000)
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
    console.error('❌ Robust sign-in failed:', error);
    return { data: null, error };
  }
};

/**
 * Enhanced sign-up function with timeout
 */
export const robustSignUp = async (email: string, password: string) => {
  console.log('🔐 Starting robust sign-up process...');
  
  try {
    // Step 1: Clean up existing state first
    cleanupAuthState();
    
    // Step 2: Sign up with email/password with timeout
    console.log('📧 Attempting sign up with 10-second timeout...');
    
    const signUpPromise = supabase.auth.signUp({
      email,
      password,
    });

    // Reduced timeout for better performance
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Sign up timeout after 10 seconds')), 10000)
    );

    const { data, error } = await Promise.race([signUpPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('❌ Sign up error:', error);
      throw error;
    }
    
    console.log('✅ Sign up successful');
    return { data, error: null };
  } catch (error) {
    console.error('❌ Robust sign-up failed:', error);
    return { data: null, error };
  }
};

/**
 * Robust sign-out function with shorter timeout for better performance
 */
export const robustSignOut = async () => {
  console.log('🔐 Starting robust sign-out process...');
  
  try {
    // Step 1: Clean up auth state first
    cleanupAuthState();
    
    // Step 2: Attempt global sign out with shorter timeout
    try {
      console.log('📤 Attempting Supabase sign out with 3-second timeout...');
      
      const signOutPromise = supabase.auth.signOut({ scope: 'global' });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 3000)
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
    console.error('❌ Error during robust sign-out:', error);
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

/**
 * Enhanced auth state validator
 */
export const validateAuthState = async () => {
  console.log('🔍 Validating auth state...');
  
  try {
    const { data: { session }, error } = await Promise.race([
      supabase.auth.getSession(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Session check timeout')), 5000))
    ]) as any;
    
    if (error) {
      console.error('❌ Auth state validation failed:', error);
      cleanupAuthState();
      return false;
    }
    
    if (!session) {
      console.log('ℹ️ No active session found');
      return false;
    }
    
    console.log('✅ Valid auth state confirmed');
    return true;
  } catch (error) {
    console.error('❌ Auth state validation timeout:', error);
    cleanupAuthState();
    return false;
  }
};
