
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DogService } from '@/services/dogService';
import { cleanupAuthState, robustSignOut, robustSignIn, robustSignUp, requestPasswordReset, updatePassword } from '@/utils/authUtils';
import { logger } from '@/utils/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.time('Auth:onAuthStateChange');
        
        // Update state synchronously - no async operations here to prevent deadlocks
        setSession(session);
        setUser(session?.user ?? null);
        setError(null);
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          cleanupAuthState();
          DogService.clearDogCache();
        }
        
        // Always set loading to false after auth state change
        logger.timeEnd('Auth:onAuthStateChange');
        setLoading(false);
      }
    );

    // THEN check for existing session - with timeout for better UX
    const sessionTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 second timeout

    logger.time('Auth:getSession');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      clearTimeout(sessionTimeout);
      
      if (error) {
        console.error('❌ Error getting session:', error);
        cleanupAuthState();
        setError('Failed to restore your session. Please sign in again.');
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      logger.timeEnd('Auth:getSession');
    }).catch((error) => {
      clearTimeout(sessionTimeout);
      console.error('❌ Session check failed:', error);
      setLoading(false);
      logger.timeEnd('Auth:getSession');
    });

    return () => {
      clearTimeout(sessionTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setError(null);
    
    try {
      const { error } = await robustSignUp(email, password);
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setError(errorMessage);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    
    try {
      const { error } = await robustSignIn(email, password);
      if (error) {
        throw new Error(error.message);
      }
      // Navigation will be handled by auth state change
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setError(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    setError(null);
    
    try {
      await robustSignOut();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setError(errorMessage);
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    
    try {
      const { error } = await requestPasswordReset(email);
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setError(errorMessage);
      throw error;
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    setError(null);
    
    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password update failed';
      setError(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
