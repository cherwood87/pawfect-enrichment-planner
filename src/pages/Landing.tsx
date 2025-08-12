
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Hero_Intro from '@/components/landing/Hero_Intro';
import Benefits_Overview from '@/components/landing/Benefits_Overview';
import PillarPreview_Grid from '@/components/landing/PillarPreview_Grid';
import CTA_AddDog from '@/components/landing/CTA_AddDog';
import DashboardBanner from '@/components/landing/DashboardBanner';
import { LogIn } from 'lucide-react';

const Landing: React.FC = () => {
  const { user, loading, session } = useAuth();


  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
        <div className="text-center modern-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-700 font-medium">Loading your enrichment journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      {/* Dashboard Banner for Authenticated Users */}
      <DashboardBanner />

      {/* Header with Sign In button (only for unauthenticated users) */}
      {!user && !session && (
        <header className="absolute top-0 right-0 p-6 z-10">
          <Link to="/auth">
            <Button className="modern-button-outline flex items-center space-x-2 shadow-lg hover:shadow-xl">
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
          </Link>
        </header>
      )}
      
      {/* Simple pricing ribbon */}
      <div className="container mx-auto px-6 pt-20">
        <div className="rounded-xl border border-primary/20 bg-white/70 backdrop-blur p-3 text-center text-sm">
          Premium enrichment for your dog — just <span className="font-semibold text-primary">$5.99/mo</span>
        </div>
      </div>
      
      <Hero_Intro />
      <Benefits_Overview />
      <PillarPreview_Grid />
      <CTA_AddDog />
    </div>
  );
};

export default Landing;
