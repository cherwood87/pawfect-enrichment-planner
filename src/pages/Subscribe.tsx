import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lock, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Subscribe: React.FC = () => {
  const { user, session, signOut } = useAuth();
  const { isActive, cancel, isLoading, error, tier } = useSubscription();
  const navigate = useNavigate();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const handleCreateCheckout = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsCreatingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        // Open Stripe Checkout in new tab
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      console.error('Checkout failed:', err);
      toast({
        title: 'Checkout Error',
        description: err.message || 'Failed to create checkout session',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsCreatingCheckout(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      console.error('Error opening customer portal:', err);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await signOut();
      navigate('/auth', { replace: true });
    } catch (e) {
      console.error('Switch account failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Unlock Premium Enrichment</CardTitle>
          <CardDescription>All features for just <span className="font-semibold text-primary">$9.99/mo</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-left space-y-2">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4 text-primary" /> 
              160+ enrichment activities across 5 pillars
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4 text-primary" /> 
              AI-powered activity discovery
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4 text-primary" /> 
              Smart "Choose For Me" recommendations
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4 text-primary" /> 
              24/7 AI enrichment coach
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4 text-primary" /> 
              Activity filtering and search
            </li>
          </ul>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {!user || !session ? (
            <Link to="/auth">
              <Button className="w-full">Sign up to Subscribe</Button>
            </Link>
          ) : (
            <div className="space-y-2">
              {!isActive ? (
                <Button 
                  onClick={handleCreateCheckout} 
                  className="w-full"
                  disabled={isCreatingCheckout}
                >
                  {isCreatingCheckout ? 'Creating Checkout...' : 'Subscribe Now - $9.99/mo'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-md bg-primary/10 text-primary text-sm text-center">
                    ✅ You're subscribed! Enjoy premium enrichment.
                  </div>
                  <Button onClick={() => navigate('/activity-library')} className="w-full" variant="secondary">
                    Go to Activity Library
                  </Button>
                  <Button 
                    onClick={handleManageSubscription}
                    disabled={isCreatingCheckout}
                    variant="outline" 
                    className="w-full"
                  >
                    {isCreatingCheckout ? 'Opening portal...' : 'Manage Subscription'}
                  </Button>
                </div>
              )}
              <div className="pt-1">
                <Button variant="link" onClick={handleSwitchAccount} className="text-muted-foreground p-0 h-auto">
                  Not you? Switch account
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Cancel anytime. Secure payment powered by Stripe.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribe;
