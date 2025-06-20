
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
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
    console.log('🔐 Initializing simplified auth state...');
    
    let mounted = true;
    let authSubscription: any = null;
    
    const initializeAuth = async () => {
      try {
        // Step 1: Set up auth state listener first (no blocking)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('🔄 Auth state change:', event, session?.user?.email || 'no user');
            
            // Update state immediately
            setSession(session);
            setUser(session?.user ?? null);
            setError(null);
            setLoading(false); // Always set loading to false on auth state change
            
            // Handle specific events
            if (event === 'SIGNED_OUT') {
              console.log('👋 User signed out - cleaning up');
              cleanupAuthState();
            }
          }
        );
        
        authSubscription = subscription;
        
        // Step 2: Check connectivity without blocking (progressive loading)
        checkSupabaseConnection()
          .then(connectionOk => {
            if (mounted) {
              setIsConnected(connectionOk);
              console.log('🌐 Connection status:', connectionOk ? 'connected' : 'offline');
            }
          })
          .catch(() => {
            if (mounted) {
              setIsConnected(false);
              console.warn('⚠️ Connection check failed, working offline');
            }
          });
        
        // Step 3: Get initial session (with simple fallback, no aggressive timeout)
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (mounted) {
            if (error) {
              console.error('❌ Error getting session:', error);
              setError('Failed to restore session');
            } else {
              console.log('📱 Initial session:', session?.user?.email || 'no session');
              setSession(session);
              setUser(session?.user ?? null);
            }
            setLoading(false);
          }
        } catch (sessionError) {
          if (mounted) {
            console.error('❌ Session check failed:', sessionError);
            setLoading(false); // Always stop loading on error
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
