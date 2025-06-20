
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

// Timeout wrapper for session retrieval
const getSessionWithTimeout = async (timeoutMs: number = 5000) => {
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
    console.log('🔐 Initializing Phase 3 optimized auth state...');
    
    let mounted = true;
    let authSubscription: any = null;
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener first (immediate, non-blocking)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('🔄 Auth state change:', event, session?.user?.email || 'no user');
            
            // Update state immediately
            setSession(session);
            setUser(session?.user ?? null);
            setError(null);
            
            // Always resolve loading state on auth change
            if (loading) {
              setLoading(false);
            }
            
            // Handle specific events
            if (event === 'SIGNED_OUT') {
              console.log('👋 User signed out - cleaning up');
              cleanupAuthState();
            }
          }
        );
        
        authSubscription = subscription;
        
        // Get initial session with timeout (no connection dependency)
        try {
          const { data: { session }, error } = await getSessionWithTimeout(5000);
          
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
            console.warn('⚠️ Session check timeout or failed:', sessionError);
            // Don't set error for timeout - just continue without session
          }
        } finally {
          // Always resolve loading state
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

    // Failsafe: Always resolve loading after maximum wait time
    const failsafeTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⚠️ Auth initialization taking too long, resolving loading state');
        setLoading(false);
      }
    }, 8000);

    return () => {
      mounted = false;
      clearTimeout(failsafeTimeout);
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
