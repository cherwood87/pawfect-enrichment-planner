
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState, robustSignOut, robustSignIn, robustSignUp } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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
    console.log('🔐 Initializing auth state...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'no user');
        
        // Update state synchronously - no async operations here to prevent deadlocks
        setSession(session);
        setUser(session?.user ?? null);
        setError(null);
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          cleanupAuthState();
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('👋 User signed in:', session.user.email);
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed for user:', session?.user?.email);
        }
        
        // Always set loading to false after auth state change
        setLoading(false);
      }
    );

    // THEN check for existing session - with timeout for better UX
    const sessionTimeout = setTimeout(() => {
      console.log('⏰ Session check timeout, proceeding without session');
      setLoading(false);
    }, 3000); // 3 second timeout

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      clearTimeout(sessionTimeout);
      
      if (error) {
        console.error('❌ Error getting session:', error);
        cleanupAuthState();
        setError('Failed to restore your session. Please sign in again.');
      }
      
      console.log('📱 Initial session check:', session?.user?.email || 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      clearTimeout(sessionTimeout);
      console.error('❌ Session check failed:', error);
      setLoading(false);
    });

    return () => {
      clearTimeout(sessionTimeout);
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('📝 Sign up requested for:', email);
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
    console.log('🔑 Sign in requested for:', email);
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
    console.log('👋 Sign out requested');
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

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
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
