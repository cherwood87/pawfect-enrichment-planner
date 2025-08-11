
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
      navigate('/activity-library', { replace: true });
    }
  }, [user, session, navigate]);

  const validateForm = (): string | null => {
    if (!email || !password) return 'Please fill in all fields';
    if (!email.includes('@')) return 'Please enter a valid email address';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return null;
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
      

      let waitCount = 0;
      while (!session && waitCount < 10) {
        await new Promise((res) => setTimeout(res, 250));
        waitCount++;
      }
      console.log('[Auth] ✅ Ready to redirect at:', new Date());
      navigate('/activity-library', { replace: true });
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              Welcome to Beyond Busy Dog Enrichment Planner!
            </h1>
            <p className="text-gray-600">
              Sign in to continue your dog's enrichment journey
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center text-purple-800">
                Get Started
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {error && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                      <button
                        onClick={clearError}
                        className="ml-2 text-red-600 hover:text-red-800 underline"
                      >
                        Dismiss
                      </button>
                    </AlertDescription>
                  </Alert>
                )}

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-purple-200 focus:border-purple-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-purple-200 focus:border-purple-400"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                      disabled={loading || isRetrying}
                    >
                      {loading || isRetrying ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-purple-200 focus:border-purple-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Create a password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-purple-200 focus:border-purple-400"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                      disabled={loading || isRetrying}
                    >
                      {loading || isRetrying ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  By continuing, you agree to our Terms of Service
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Auth;
