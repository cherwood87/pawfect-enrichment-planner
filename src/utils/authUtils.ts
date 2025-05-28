
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
 * Robust sign-out function that handles cleanup and refresh
 */
export const robustSignOut = async () => {
  console.log('🔐 Starting robust sign-out process...');
  
  try {
    // Step 1: Clean up auth state first
    cleanupAuthState();
    
    // Step 2: Attempt global sign out (don't fail if this errors)
    try {
      console.log('📤 Attempting Supabase sign out...');
      await supabase.auth.signOut({ scope: 'global' });
      console.log('✅ Supabase sign out successful');
    } catch (signOutError) {
      console.warn('⚠️ Supabase sign out failed (continuing anyway):', signOutError);
    }
    
    // Step 3: Force page reload for clean state
    console.log('🔄 Forcing page reload to ensure clean state...');
    window.location.href = '/auth';
    
  } catch (error) {
    console.error('❌ Error during robust sign-out:', error);
    // Even if everything fails, force redirect to auth page
    window.location.href = '/auth';
  }
};

/**
 * Enhanced sign-in function with cleanup
 */
export const robustSignIn = async (email: string, password: string) => {
  console.log('🔐 Starting robust sign-in process...');
  
  try {
    // Step 1: Clean up existing state first
    cleanupAuthState();
    
    // Step 2: Attempt global sign out to clear any lingering sessions
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn('⚠️ Pre-signin cleanup sign-out failed (continuing):', err);
    }
    
    // Step 3: Sign in with email/password
    console.log('📧 Attempting sign in...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
    
    if (data.user) {
      console.log('✅ Sign in successful, redirecting...');
      // Force page reload to ensure clean state
      window.location.href = '/app';
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ Robust sign-in failed:', error);
    return { data: null, error };
  }
};

/**
 * Enhanced sign-up function with cleanup
 */
export const robustSignUp = async (email: string, password: string) => {
  console.log('🔐 Starting robust sign-up process...');
  
  try {
    // Step 1: Clean up existing state first
    cleanupAuthState();
    
    // Step 2: Sign up with email/password
    console.log('📧 Attempting sign up...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
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
