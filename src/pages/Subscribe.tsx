import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lock } from 'lucide-react';

const Subscribe: React.FC = () => {
  const { user, session } = useAuth();
  const { isActive, activate, cancel, isLoading, error, tier } = useSubscription();
  const navigate = useNavigate();

  const handleActivate = async () => {
    try {
      await activate();
      navigate('/settings?tab=dogs', { replace: true });
    } catch (err) {
      console.error('Activation failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg modern-card text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Unlock Premium Enrichment</CardTitle>
          <CardDescription>All features for just <span className="font-semibold text-primary">$5.99/mo</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-left space-y-2">
            <li className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-primary" /> Personalized activity library</li>
            <li className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-primary" /> Dog personality quiz + profile</li>
            <li className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-primary" /> Smart "Choose For Me" picker</li>
            <li className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-primary" /> Floating AI coach</li>
          </ul>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {!user || !session ? (
            <Link to="/auth">
              <Button className="w-full modern-button-primary">Sign up to Subscribe</Button>
            </Link>
          ) : (
            <div className="space-y-2">
              {!isActive ? (
                <Button 
                  onClick={handleActivate} 
                  className="w-full modern-button-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Activating...' : 'Activate Subscription'}
                </Button>
              ) : (
                <div className="space-y-2">
                  {tier && (
                    <div className="p-3 rounded-md bg-primary/10 text-primary text-sm text-center">
                      Current Plan: {tier}
                    </div>
                  )}
                  <Button onClick={() => navigate('/settings?tab=dogs')} className="w-full" variant="secondary">Go to Dogs</Button>
                  <Button 
                    onClick={cancel} 
                    variant="outline" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cancelling...' : 'Cancel (dev)'}
                  </Button>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">Note: This is a demo subscription system. Real Stripe integration available on request.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribe;
