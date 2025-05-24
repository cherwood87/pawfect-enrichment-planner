
import React from 'react';
import Hero_Intro from '@/components/landing/Hero_Intro';
import Benefits_Overview from '@/components/landing/Benefits_Overview';
import PillarPreview_Grid from '@/components/landing/PillarPreview_Grid';
import CTA_AddDog from '@/components/landing/CTA_AddDog';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Hero_Intro />
      <Benefits_Overview />
      <PillarPreview_Grid />
      <CTA_AddDog />
    </div>
  );
};

export default Landing;
