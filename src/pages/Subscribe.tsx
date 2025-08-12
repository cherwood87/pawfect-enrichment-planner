import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lock } from 'lucide-react';

const Subscribe: React.FC = () => {
  const { user, session } = useAuth();
  const { isActive, activate, cancel } = useSubscription();
  const navigate = useNavigate();

  const handleActivate = () => {
    activate();
    navigate('/dogs', { replace: true });
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

          {!user || !session ? (
            <Link to="/auth">
              <Button className="w-full modern-button-primary">Sign up to Subscribe</Button>
            </Link>
          ) : (
            <div className="space-y-2">
              {!isActive ? (
                <Button onClick={handleActivate} className="w-full modern-button-primary">Activate Subscription</Button>
              ) : (
                <div className="space-y-2">
                  <Button onClick={() => navigate('/dogs')} className="w-full" variant="secondary">Go to Dogs</Button>
                  <Button onClick={cancel} variant="outline" className="w-full">Cancel (dev)</Button>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">Note: Billing integration coming soon. This is a temporary activation screen.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribe;
