
import React, { useEffect } from 'react';
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
  const { user, loading, session } = useAuth();

  // Debug logging for landing page behavior
  useEffect(() => {
    console.log('🏠 Landing page mounted');
    console.log('👤 User:', user?.email || 'none');
    console.log('📱 Session:', session ? 'exists' : 'none');
    console.log('⏳ Loading:', loading);
  }, [user, session, loading]);

  // Show loading spinner while auth is initializing
  if (loading) {
    console.log('⏳ Landing: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to the app
  if (user && session) {
    console.log('🚀 Landing: Redirecting authenticated user to /app');
    return <Navigate to="/app" replace />;
  }

  console.log('🏠 Landing: Showing landing page for unauthenticated user');

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
