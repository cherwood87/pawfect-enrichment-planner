
import React from 'react';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import DogProfile from '@/components/DogProfile';
import DailyPlannerCard from '@/components/DailyPlannerCard';
import WeeklyPlannerCard from '@/components/WeeklyPlannerCard';
import QuickStats from './QuickStats';
import ReflectionJournal from '@/components/ReflectionJournal';
import EmptyDashboard from '@/components/EmptyDashboard';
import DataMigrationBanner from '@/components/DataMigrationBanner';
import { Dog } from '@/types/dog';

interface DashboardContentProps {
  onEditDogOpen: (dog: Dog) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ onEditDogOpen }) => {
  const { currentDog, state } = useDog();
  const { getStreakData } = useActivity();

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dogs...</p>
        </div>
      </div>
    );
  }

  if (!currentDog) {
    return <EmptyDashboard />;
  }

  const streakData = getStreakData();

  return (
    <div className="space-y-6">
      {/* Data Migration Banner */}
      <DataMigrationBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Dog Profile */}
        <div className="lg:col-span-1">
          <DogProfile onEditDogOpen={onEditDogOpen} />
        </div>

        {/* Right Columns - Activities and Stats */}
        <div className="lg:col-span-2 space-y-6">
          <QuickStats streakData={streakData} />
          <DailyPlannerCard />
          <WeeklyPlannerCard />
        </div>
      </div>

      {/* Full Width - Journal */}
      <ReflectionJournal />
    </div>
  );
};

export default DashboardContent;
