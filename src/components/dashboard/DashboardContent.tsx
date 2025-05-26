
import React from 'react';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import DogProfile from '@/components/DogProfile';
import EnrichmentPillars from '@/components/EnrichmentPillars';
import TodaySchedule from '@/components/TodaySchedule';
import StreakTracker from '@/components/StreakTracker';
import QuickStats from './QuickStats';

interface DashboardContentProps {
  onPillarSelect: (pillar: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ onPillarSelect }) => {
  const { currentDog } = useDog();
  const { getStreakData, getPillarBalance } = useActivity();

  if (!currentDog) {
    return null;
  }

  // Get user preferences from current dog's quiz results
  const userPreferences = currentDog?.quizResults?.ranking;
  
  // Get real data for stats
  const streakData = getStreakData();
  const pillarBalance = getPillarBalance();
  const activeDays = streakData?.weeklyProgress.filter(d => d.completed).length || 0;

  return (
    <div className="max-w-screen-lg mx-auto mobile-container mobile-space-y pb-20 sm:pb-6">
      {/* Dog Profile Section */}
      <DogProfile />

      {/* Quick Stats */}
      <QuickStats 
        activeDays={activeDays}
        completionRate={streakData?.completionRate || 0}
        currentStreak={streakData?.currentStreak || 0}
      />

      {/* Today's Schedule */}
      <TodaySchedule />

      {/* Enrichment Pillars */}
      <EnrichmentPillars 
        onPillarSelect={onPillarSelect}
        userPreferences={userPreferences}
      />

      {/* Streak Tracker */}
      <StreakTracker />
    </div>
  );
};

export default DashboardContent;
