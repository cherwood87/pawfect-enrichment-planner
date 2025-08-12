import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DogProfileHero } from './DogProfileHero';
import { WeeklyProgressSummary } from './WeeklyProgressSummary';
import { QuickActionGrid } from './QuickActionGrid';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import EmptyDashboard from '@/components/EmptyDashboard';
import ReflectionJournal from '@/components/ReflectionJournal';

interface SimplifiedDashboardContentProps {
  onAddDogOpen?: () => void;
  onChatOpen?: () => void;
}

export const SimplifiedDashboardContent: React.FC<SimplifiedDashboardContentProps> = ({
  onAddDogOpen,
  onChatOpen
}) => {
  const navigate = useNavigate();
  const { currentDog } = useDog();
  const { scheduledActivities } = useActivity();

  if (!currentDog) {
    return <EmptyDashboard onAddDogOpen={onAddDogOpen} />;
  }

  // Calculate this week's progress
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const thisWeekActivities = scheduledActivities.filter(activity => {
    const activityDate = new Date(activity.scheduledDate);
    return activityDate >= startOfWeek && activityDate <= endOfWeek;
  });

  const completedThisWeek = thisWeekActivities.filter(activity => activity.completed).length;
  const totalPlannedThisWeek = thisWeekActivities.length;

  const handleGetTodaysActivities = () => {
    navigate('/activity-library');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      <div className="container mx-auto mobile-container mobile-space-y">
        
        {/* Hero Section with Dog Profile */}
        <DogProfileHero dog={currentDog} />
        
        {/* Primary Call-to-Action */}
        <div className="text-center">
          <Button
            onClick={handleGetTodaysActivities}
            className="w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500 hover:from-purple-600 hover:via-cyan-600 hover:to-amber-600 text-white font-semibold py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] touch-target"
          >
            Get Today's Activities for {currentDog.name}
          </Button>
        </div>

        {/* Weekly Progress Summary */}
        <WeeklyProgressSummary 
          completedActivities={completedThisWeek}
          totalPlannedActivities={totalPlannedThisWeek}
        />

        {/* Quick Action Grid */}
        <QuickActionGrid onChatOpen={onChatOpen} />

        {/* Journal Section */}
        <div id="journal">
          <ReflectionJournal />
        </div>

      </div>
    </div>
  );
};