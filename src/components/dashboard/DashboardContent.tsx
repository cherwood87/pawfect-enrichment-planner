
import React from 'react';
import { useDog } from '@/contexts/DogContext';
import DogProfile from '@/components/DogProfile';
import WeeklyPlannerCard from '@/components/WeeklyPlannerCard';
import DailyPlannerCard from '@/components/DailyPlannerCard';
import ReflectionJournal from '@/components/ReflectionJournal';
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

  return (
    <div className="max-w-screen-lg mx-auto mobile-container mobile-space-y pb-20 sm:pb-6">
      {/* Dog Profile Section */}
      <DogProfile onEditDogOpen={onEditDogOpen} />

      {/* Weekly Planner - Now at the top */}
      <WeeklyPlannerCard />

      {/* Today's Schedule - Replaced with DailyPlannerCard */}
      <DailyPlannerCard />

      {/* Reflection Journal - New section */}
      <ReflectionJournal />
    </div>
  );
};

export default DashboardContent;
