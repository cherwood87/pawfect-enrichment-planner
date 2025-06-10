
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { cleanupAuthState, robustSignOut, robustSignIn, robustSignUp, validateAuthState } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  isConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  const clearError = () => setError(null);

  useEffect(() => {
    console.log('🔐 Initializing optimized auth state...');
    
    let mounted = true;
    let authSubscription: any = null;
    
    const initializeAuth = async () => {
      try {
        // Step 1: Check network connectivity first
        const connectionOk = await checkSupabaseConnection();
        if (mounted) {
          setIsConnected(connectionOk);
        }
        
        if (!connectionOk) {
          console.warn('⚠️ Supabase connection failed, working offline');
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        // Step 2: Set up auth state listener with error handling
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('🔄 Auth state change:', event, session?.user?.email || 'no user');
            
            try {
              // Update state synchronously to prevent race conditions
              setSession(session);
              setUser(session?.user ?? null);
              setError(null);
              
              // Handle specific auth events
              if (event === 'SIGNED_OUT') {
                console.log('👋 User signed out - cleaning up');
                cleanupAuthState();
              }
              
              if (event === 'SIGNED_IN' && session?.user) {
                console.log('👋 User signed in:', session.user.email);
              }
              
              if (event === 'TOKEN_REFRESHED') {
                console.log('🔄 Token refreshed for user:', session?.user?.email);
              }
              
            } catch (stateError) {
              console.error('❌ Error handling auth state change:', stateError);
              if (mounted) {
                setError('Authentication state error');
              }
            } finally {
              if (mounted) {
                setLoading(false);
              }
            }
          }
        );
        
        authSubscription = subscription;
        
        // Step 3: Check for existing session with timeout and validation
        const sessionTimeout = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Session check timeout, proceeding without session');
            setLoading(false);
          }
        }, 2000); // Reduced from 3s to 2s for better performance

        try {
          const isValidAuth = await validateAuthState();
          
          if (isValidAuth) {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (mounted) {
              clearTimeout(sessionTimeout);
              
              if (error) {
                console.error('❌ Error getting session:', error);
                cleanupAuthState();
                setError('Failed to restore your session. Please sign in again.');
              } else {
                console.log('📱 Initial session restored:', session?.user?.email || 'no session');
                setSession(session);
                setUser(session?.user ?? null);
              }
              
              setLoading(false);
            }
          } else if (mounted) {
            clearTimeout(sessionTimeout);
            setLoading(false);
          }
        } catch (sessionError) {
          if (mounted) {
            clearTimeout(sessionTimeout);
            console.error('❌ Session validation failed:', sessionError);
            setLoading(false);
          }
        }
        
      } catch (initError) {
        console.error('❌ Auth initialization failed:', initError);
        if (mounted) {
          setError('Failed to initialize authentication');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        console.log('🧹 Cleaning up auth subscription');
        authSubscription.unsubscribe();
      }
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
    setLoading(true);
    
    try {
      const { error } = await robustSignIn(email, password);
      if (error) {
        throw new Error(error.message);
      }
      // State will be updated by onAuthStateChange
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
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
    isConnected,
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
