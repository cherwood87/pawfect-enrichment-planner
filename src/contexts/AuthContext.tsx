
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState, robustSignOut, robustSignIn, robustSignUp } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 Initializing auth state...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'no user');
        
        // Update state synchronously
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          // Clean up auth state on sign out
          cleanupAuthState();
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('👋 User signed in:', session.user.email);
          // Defer any additional data fetching to prevent deadlocks
          setTimeout(() => {
            console.log('🎯 Auth initialization complete for user:', session.user.email);
          }, 0);
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed for user:', session?.user?.email);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
        // Clean up on session error
        cleanupAuthState();
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
    const { error } = await robustSignUp(email, password);
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Sign in requested for:', email);
    const { error } = await robustSignIn(email, password);
    if (error) throw error;
  };

  const signOut = async () => {
    console.log('👋 Sign out requested');
    await robustSignOut();
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
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
