
import React from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import DailyPlannerCard from '@/components/DailyPlannerCard';
import WeeklyPlannerCard from '@/components/WeeklyPlannerCard';
import QuickStats from './QuickStats';
import ReflectionJournal from '@/components/ReflectionJournal';
import EmptyDashboard from '@/components/EmptyDashboard';

const DashboardContent = () => {
  const { getTodaysActivities } = useActivity();
  const { currentDog } = useDog();
  
  const todaysActivities = getTodaysActivities();

  if (!currentDog) {
    return <EmptyDashboard />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Quick Stats */}
      <QuickStats />
      
      {/* Planning Cards - Side by Side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyPlannerCard />
        <WeeklyPlannerCard />
      </div>

      {/* Reflection Journal */}
      <ReflectionJournal />
    </div>
  );
};

export default DashboardContent;
