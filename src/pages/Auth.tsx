
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from '@/hooks/use-toast';
import { Heart, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import UnifiedErrorBoundary from '@/components/error/UnifiedErrorBoundary';
import { useRetry } from '@/hooks/useRetry';
import { handleError, getUserFriendlyMessage } from '@/utils/errorUtils';


const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // 'reset' for password reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp, user, session, resetPassword, updateUserPassword } = useAuth();
  const { isActive } = useSubscription();
  const navigate = useNavigate();

  const { retry, isRetrying, attempt } = useRetry({
    maxAttempts: 3,
    delay: 1000,
  });

  useEffect(() => {
    if (user && session) {
      navigate(isActive ? '/settings?tab=dogs' : '/subscribe', { replace: true });
    }
  }, [user, session, isActive, navigate]);

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

    try {
      await retry(async () => {
        await signIn(email, password);
        toast({ title: 'Welcome back!', description: 'You have successfully signed in.' });
      });
      

      let waitCount = 0;
      while (!session && waitCount < 10) {
        await new Promise((res) => setTimeout(res, 250));
        waitCount++;
      }
      navigate(isActive ? '/settings?tab=dogs' : '/subscribe', { replace: true });
    } catch (error: any) {
      const friendlyMessage = getUserFriendlyMessage(error);
      setError(friendlyMessage);
      handleError(error, { component: 'Auth', action: 'signIn', metadata: { email, attempt } }, false);
      toast({ title: 'Sign In Error', description: friendlyMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await retry(async () => {
        await resetPassword(email);
        setResetEmailSent(true);
        toast({ 
          title: 'Reset Email Sent!', 
          description: 'Check your email for a password reset link.' 
        });
      });
    } catch (error: any) {
      const friendlyMessage = getUserFriendlyMessage(error);
      setError(friendlyMessage);
      toast({ title: 'Reset Error', description: friendlyMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await retry(async () => {
        await updateUserPassword(newPassword);
        toast({ 
          title: 'Password Updated!', 
          description: 'Your password has been successfully updated.' 
        });
        navigate('/settings?tab=dogs', { replace: true });
      });
    } catch (error: any) {
      const friendlyMessage = getUserFriendlyMessage(error);
      setError(friendlyMessage);
      toast({ title: 'Update Error', description: friendlyMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Password Reset Mode UI
  if (mode === 'reset') {
    return (
      <UnifiedErrorBoundary context="Password Reset">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl text-center text-purple-800">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Enter your new password
                </CardDescription>
              </CardHeader>
              <CardContent>
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

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your new password (min 6 characters)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                    disabled={loading || isRetrying}
                  >
                    {loading || isRetrying ? 'Updating Password...' : 'Update Password'}
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center justify-center mx-auto"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Sign In
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </UnifiedErrorBoundary>
    );
  }

  // Forgot Password Mode UI
  if (resetEmailSent) {
    return (
      <UnifiedErrorBoundary context="Password Reset Sent">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl text-center text-purple-800">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  We've sent a password reset link to {email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Click the link in your email to reset your password. The link will expire in 1 hour.
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => setResetEmailSent(false)}
                      variant="outline"
                      className="w-full"
                    >
                      Send Another Email
                    </Button>
                    <button
                      onClick={() => navigate('/auth')}
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center justify-center mx-auto w-full"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Sign In
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </UnifiedErrorBoundary>
    );
  }

  return (
    <UnifiedErrorBoundary context="Auth Page">
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
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="forgot">Forgot?</TabsTrigger>
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

                <TabsContent value="forgot">
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-purple-200 focus:border-purple-400"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={loading || isRetrying}
                    >
                      {loading || isRetrying ? 'Sending Reset Email...' : 'Send Reset Email'}
                    </Button>
                  </form>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      We'll send you a secure link to reset your password
                    </p>
                  </div>
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
    </UnifiedErrorBoundary>
  );
};

export default Auth;
