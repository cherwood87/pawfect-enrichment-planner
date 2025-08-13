
import { supabase } from '@/integrations/supabase/client';
import { AuthSecurityService } from '@/services/security/AuthSecurityService';

/**
 * Enhanced auth state cleanup utility with security improvements
 */
export const cleanupAuthState = () => {
  console.log('🧹 Starting enhanced auth state cleanup...');
  AuthSecurityService.enhancedAuthCleanup();
};

/**
 * Enhanced sign-in function with security and timeout improvements
 */
export const robustSignIn = async (email: string, password: string) => {
  console.log('🔐 Starting robust sign-in process...');
  
  try {
    // Step 1: Validate inputs
    if (!AuthSecurityService.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Step 2: Check for rate limiting
    if (AuthSecurityService.isLockedOut(email)) {
      const remainingTime = AuthSecurityService.getRemainingLockoutTime(email);
      throw new Error(`Too many failed attempts. Try again in ${remainingTime} minutes.`);
    }

    // Step 3: Clean up existing state first
    cleanupAuthState();
    
    // Step 4: Attempt global sign out to clear any lingering sessions
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn('⚠️ Pre-signin cleanup sign-out failed (continuing):', err);
    }
    
    // Step 5: Sign in with email/password with timeout
    console.log('📧 Attempting sign in with timeout...');
    
    const signInPromise = supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Add timeout for sign-in operation
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Sign in timeout')), 15000)
    );

    const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('❌ Sign in error:', error);
      AuthSecurityService.recordFailedAttempt(email);
      throw error;
    }
    
    if (data.user) {
      console.log('✅ Sign in successful, user:', data.user.email);
      AuthSecurityService.clearFailedAttempts(email);
      return { data, error: null };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ Robust sign-in failed:', error);
    return { data: null, error };
  }
};

/**
 * Enhanced sign-up function with validation and timeout
 */
export const robustSignUp = async (email: string, password: string) => {
  console.log('🔐 Starting robust sign-up process...');
  
  try {
    // Step 1: Validate inputs
    if (!AuthSecurityService.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = AuthSecurityService.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('. '));
    }

    // Step 2: Clean up existing state first
    cleanupAuthState();
    
    // Step 3: Sign up with email/password with timeout
    console.log('📧 Attempting sign up with timeout...');
    
    const signUpPromise = supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    // Add timeout for sign-up operation
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Sign up timeout')), 15000)
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
 * Robust sign-out function with timeout
 */
export const robustSignOut = async () => {
  console.log('🔐 Starting robust sign-out process...');
  
  try {
    // Step 1: Clean up auth state first
    cleanupAuthState();
    
    // Step 2: Attempt global sign out with timeout
    try {
      console.log('📤 Attempting Supabase sign out with timeout...');
      
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
    console.error('❌ Error during robust sign-out:', error);
    // Even if everything fails, force redirect to auth page
    window.location.href = '/auth';
  }
};
