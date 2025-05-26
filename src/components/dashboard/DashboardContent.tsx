
import React from 'react';
import { useDog } from '@/contexts/DogContext';
import DogProfile from '@/components/DogProfile';
import EnrichmentPillars from '@/components/EnrichmentPillars';
import WeeklyPlannerCard from '@/components/WeeklyPlannerCard';
import DailyPlannerCard from '@/components/DailyPlannerCard';
import { Dog } from '@/types/dog';

interface DashboardContentProps {
  onPillarSelect: (pillar: string) => void;
  onAddDogOpen: () => void;
  onEditDogOpen: (dog: Dog) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  onPillarSelect,
  onAddDogOpen,
  onEditDogOpen
}) => {
  const { currentDog } = useDog();

  if (!currentDog) {
    return null;
  }

  // Get user preferences from current dog's quiz results
  const userPreferences = currentDog?.quizResults?.ranking;

  return (
    <div className="max-w-screen-lg mx-auto mobile-container mobile-space-y pb-20 sm:pb-6">
      {/* Dog Profile Section */}
      <DogProfile onEditDogOpen={onEditDogOpen} />

      {/* Weekly Planner - Now at the top */}
      <WeeklyPlannerCard />

      {/* Today's Schedule - Replaced with DailyPlannerCard */}
      <DailyPlannerCard />

      {/* Enrichment Pillars */}
      <EnrichmentPillars 
        onPillarSelect={onPillarSelect}
        userPreferences={userPreferences}
      />
    </div>
  );
};

export default DashboardContent;
