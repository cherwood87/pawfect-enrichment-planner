
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState, robustSignOut, robustSignIn, robustSignUp } from '@/utils/authUtils';
import { handleError, AppError } from '@/utils/errorUtils';

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
        
        try {
          // Update state synchronously
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          setError(null);
          
          // Handle specific auth events
          if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
            cleanupAuthState();
          }
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('👋 User signed in:', session.user.email);
            setTimeout(() => {
              console.log('🎯 Auth initialization complete for user:', session.user.email);
            }, 0);
          }
          
          if (event === 'TOKEN_REFRESHED') {
            console.log('🔄 Token refreshed for user:', session?.user?.email);
          }
        } catch (authError) {
          console.error('❌ Error in auth state change handler:', authError);
          handleError(authError as Error, {
            component: 'AuthContext',
            action: 'onAuthStateChange',
            metadata: { event, userId: session?.user?.id }
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
        handleError(error, {
          component: 'AuthContext',
          action: 'getSession'
        });
        cleanupAuthState();
        setError('Failed to restore your session. Please sign in again.');
      }
      
      console.log('📱 Initial session check:', session?.user?.email || 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
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
        const appError = new AppError(
          error.message,
          'SIGNUP_ERROR',
          { component: 'AuthContext', action: 'signUp', metadata: { email } }
        );
        handleError(appError, undefined, false);
        throw appError;
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
        const appError = new AppError(
          error.message,
          'SIGNIN_ERROR',
          { component: 'AuthContext', action: 'signIn', metadata: { email } }
        );
        handleError(appError, undefined, false);
        throw appError;
      }
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
      handleError(error as Error, {
        component: 'AuthContext',
        action: 'signOut',
        metadata: { userId: user?.id }
      });
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
