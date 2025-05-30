import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Heart, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { useRetry } from '@/hooks/useRetry';
import { handleError, getUserFriendlyMessage } from '@/utils/errorUtils';
import { supabase } from '@/lib/supabase';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, user, session } = useAuth();
  const navigate = useNavigate();

  const { retry, isRetrying, attempt } = useRetry({
    maxAttempts: 3,
    delay: 1000,
    onRetry: (attemptNum, error) => {
      console.log(`Auth retry attempt ${attemptNum}:`, error.message);
    },
  });

  useEffect(() => {
    if (user && session) {
      console.log('[Auth] 🎯 Detected active session, redirecting to dog tab:', new Date());
      navigate('/account/settings?tab=dog', { replace: true });
    }
  }, [user, session, navigate]);

  const validateForm = (): string | null => {
    if (!email || !password) return 'Please fill in all fields';
    if (!email.includes('@')) return 'Please enter a valid email address';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return null;
  };

  const preloadUserData = async () => {
    try {
      console.time('🐶 preloadUserData()');
      const { data, error } = await supabase.from('dogs').select('*').limit(1);
      if (error) throw error;
      console.log('[Preload] 🐾 Dog data fetched:', data);
      console.timeEnd('🐶 preloadUserData()');
    } catch (err) {
      console.warn('[Preload] ⚠️ Failed to fetch user data:', err);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    console.time('🔐 Total signIn flow');
    console.log('[Auth] ⏳ SignIn clicked at:', new Date());

    try {
      await retry(async () => {
        console.time('🔑 signIn()');
        await signIn(email, password);
        console.timeEnd('🔑 signIn()');
        toast({ title: 'Welcome back!', description: 'You have successfully signed in.' });
      });
      await preloadUserData();

      let waitCount = 0;
      while (!session && waitCount < 10) {
        await new Promise((res) => setTimeout(res, 250));
        waitCount++;
      }
      console.log('[Auth] ✅ Ready to redirect at:', new Date());
      navigate('/account/settings?tab=dog', { replace: true });
    } catch (error: any) {
      const friendlyMessage = getUserFriendlyMessage(error);
      setError(friendlyMessage);
      handleError(error, { component: 'Auth', action: 'signIn', metadata: { email, attempt } }, false);
      toast({ title: 'Sign In Error', description: friendlyMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
      console.timeEnd('🔐 Total signIn flow');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await retry(async () => {
        await signUp(email, password);
        toast({ title: 'Account Created!', description: 'Please check your email to verify your account, then sign in.' });
      });
    } catch (error: any) {
      const friendlyMessage = getUserFriendlyMessage(error);
      setError(friendlyMessage);
      handleError(error, { component: 'Auth', action: 'signUp', metadata: { email, attempt } }, false);
      toast({ title: 'Sign Up Error', description: friendlyMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    // ... UI code remains unchanged (same as provided above)
    <ErrorBoundary>
      {/* Form UI here */}
    </ErrorBoundary>
  );
};

export default Auth;
