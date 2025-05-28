
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Hero_Intro from '@/components/landing/Hero_Intro';
import Benefits_Overview from '@/components/landing/Benefits_Overview';
import PillarPreview_Grid from '@/components/landing/PillarPreview_Grid';
import CTA_AddDog from '@/components/landing/CTA_AddDog';
import { LogIn } from 'lucide-react';

const Landing: React.FC = () => {
  const { user, loading } = useAuth();

  // Redirect authenticated users to the app
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header with Sign In button */}
      <header className="absolute top-0 right-0 p-4 z-10">
        <Link to="/auth">
          <Button variant="outline" className="flex items-center space-x-2">
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Button>
        </Link>
      </header>
      
      <Hero_Intro />
      <Benefits_Overview />
      <PillarPreview_Grid />
      <CTA_AddDog />
    </div>
  );
};

export default Landing;
