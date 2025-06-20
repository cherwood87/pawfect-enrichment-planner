
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState, robustSignOut, robustSignIn, robustSignUp, validateConnection } from '@/utils/authUtils';

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

// Optimized session retrieval with shorter timeout
const getSessionWithTimeout = async (timeoutMs: number = 3000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const sessionPromise = supabase.auth.getSession();
    const result = await Promise.race([
      sessionPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session timeout')), timeoutMs)
      )
    ]) as any;
    
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    console.log('🔐 Initializing optimized auth state...');
    
    let mounted = true;
    let authSubscription: any = null;
    
    const initializeAuth = async () => {
      try {
        // Validate connection first
        const isConnected = await validateConnection();
        if (!isConnected) {
          console.warn('⚠️ No connection to Supabase, using offline mode');
          if (mounted) {
            setError('No connection - using offline mode');
            setLoading(false);
          }
          return;
        }

        // Set up optimized auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('🔄 Auth state change:', event, session?.user?.email || 'no user');
            
            // Update state immediately for better UX
            setSession(session);
            setUser(session?.user ?? null);
            setError(null);
            
            // Always resolve loading state quickly
            if (loading) {
              setLoading(false);
            }
            
            // Handle specific events
            if (event === 'SIGNED_OUT') {
              console.log('👋 User signed out - cleaning up');
              cleanupAuthState();
            } else if (event === 'SIGNED_IN') {
              console.log('✅ User signed in successfully');
              // Small delay to prevent auth state conflicts
              setTimeout(() => {
                if (mounted) {
                  setError(null);
                }
              }, 100);
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('🔄 Token refreshed successfully');
            }
          }
        );
        
        authSubscription = subscription;
        
        // Get initial session with shorter timeout for better UX
        try {
          const { data: { session }, error } = await getSessionWithTimeout(3000);
          
          if (mounted) {
            if (error) {
              console.error('❌ Error getting session:', error);
              setError('Failed to restore session');
            } else {
              console.log('📱 Initial session:', session?.user?.email || 'no session');
              setSession(session);
              setUser(session?.user ?? null);
            }
          }
        } catch (sessionError) {
          if (mounted) {
            console.warn('⚠️ Session check timeout, continuing without session');
            // Don't set error for timeout - just continue
          }
        } finally {
          // Always resolve loading state quickly
          if (mounted) {
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

    // Shorter failsafe timeout for better UX
    const failsafeTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⚠️ Auth taking too long, resolving loading state');
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(failsafeTimeout);
      if (authSubscription) {
        console.log('🧹 Cleaning up auth subscription');
        authSubscription.unsubscribe();
      }
    };
  }, []); // Simplified dependency array

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
      // Force a page refresh for clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setError(errorMessage);
      console.error('Sign out error:', error);
      // Still redirect even on error
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
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
