
import React, { useState } from 'react';
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
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const { retry, isRetrying, attempt } = useRetry({
    maxAttempts: 3,
    delay: 1000,
    onRetry: (attemptNum, error) => {
      console.log(`Auth retry attempt ${attemptNum}:`, error.message);
    }
  });

  const validateForm = (): string | null => {
    if (!email || !password) {
      return "Please fill in all fields";
    }
    
    if (!email.includes('@')) {
      return "Please enter a valid email address";
    }
    
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    
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
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
        navigate('/app');
      });
    } catch (error: any) {
      const friendlyMessage = getUserFriendlyMessage(error);
      setError(friendlyMessage);
      
      handleError(error, {
        component: 'Auth',
        action: 'signIn',
        metadata: { email, attempt }
      }, false);
      
      toast({
        title: "Sign In Error",
        description: friendlyMessage,
        variant: "destructive"
      });
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
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account, then sign in."
        });
      });
    } catch (error: any) {
      const friendlyMessage = getUserFriendlyMessage(error);
      setError(friendlyMessage);
      
      handleError(error, {
        component: 'Auth',
        action: 'signUp',
        metadata: { email, attempt }
      }, false);
      
      toast({
        title: "Sign Up Error",
        description: friendlyMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-cyan-400 to-purple-600 flex items-center justify-center p-4">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl"></div>
        </div>

        <Card className="w-full max-w-md modern-card shadow-2xl relative z-10 bg-white/95 backdrop-blur-lg border-2 border-white/30">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-4 rounded-3xl shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Beyond Busy
            </CardTitle>
            <CardDescription className="text-purple-700 font-medium text-base mt-2">
              Welcome to Your Dog's Enrichment Journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isRetrying && (
              <Alert className="mb-4">
                <AlertDescription>
                  Retrying... (Attempt {attempt}/3)
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-100 rounded-2xl p-1">
                <TabsTrigger 
                  value="signin" 
                  className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold"
                  onClick={clearError}
                >
                  Log in
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white font-semibold"
                  onClick={clearError}
                >
                  Sign up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-800">Login</h3>
                  <p className="text-sm text-purple-600">Hello, welcome back</p>
                </div>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearError();
                        }}
                        className="pl-12 h-14 rounded-2xl border-2 border-purple-200 focus:border-purple-500 bg-white/80 backdrop-blur-sm text-purple-800 placeholder:text-purple-400"
                        disabled={loading || isRetrying}
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          clearError();
                        }}
                        className="pl-12 h-14 rounded-2xl border-2 border-purple-200 focus:border-purple-500 bg-white/80 backdrop-blur-sm text-purple-800 placeholder:text-purple-400"
                        disabled={loading || isRetrying}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={loading || isRetrying}
                  >
                    {loading || isRetrying ? "Signing in..." : "Log in"}
                  </Button>
                </form>
                <p className="text-center text-sm text-purple-600 mt-4">
                  Don't have an account?{' '}
                  <span className="text-cyan-600 font-semibold cursor-pointer">Sign Up</span>
                </p>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-800">Sign up</h3>
                  <p className="text-sm text-purple-600">Just a few quick things to get started</p>
                </div>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearError();
                        }}
                        className="pl-12 h-14 rounded-2xl border-2 border-cyan-200 focus:border-cyan-500 bg-white/80 backdrop-blur-sm text-purple-800 placeholder:text-cyan-400"
                        disabled={loading || isRetrying}
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          clearError();
                        }}
                        className="pl-12 h-14 rounded-2xl border-2 border-cyan-200 focus:border-cyan-500 bg-white/80 backdrop-blur-sm text-purple-800 placeholder:text-cyan-400"
                        disabled={loading || isRetrying}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={loading || isRetrying}
                  >
                    {loading || isRetrying ? "Creating account..." : "Create account"}
                  </Button>
                </form>
                <p className="text-center text-sm text-purple-600 mt-4">
                  Already have an account?{' '}
                  <span className="text-purple-600 font-semibold cursor-pointer">Log In</span>
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default Auth;
