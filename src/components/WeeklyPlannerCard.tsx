
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import WeeklyPlannerHeader from './weekly-planner/WeeklyPlannerHeader';
import WeeklyGrid from './weekly-planner/WeeklyGrid';
import WeeklySummary from './weekly-planner/WeeklySummary';
import EmptyWeeklyPlanner from './weekly-planner/EmptyWeeklyPlanner';
import ActivityDetailModal from './weekly-planner/ActivityDetailModal';
import { ScheduledActivity } from '@/types/activity';

interface WeeklyPlannerCardProps {
  onPillarSelect?: (pillar: string) => void;
}

const WeeklyPlannerCard: React.FC<WeeklyPlannerCardProps> = ({ onPillarSelect }) => {
  const { scheduledActivities, toggleActivityCompletion, getActivityDetails } = useActivity();
  const { currentDog } = useDog();
  
  const [currentWeek, setCurrentWeek] = useState(getISOWeek(new Date()));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedActivity, setSelectedActivity] = useState<ScheduledActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get ISO week number
  function getISOWeek(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  // Get activities for the current week
  const weekActivities = scheduledActivities.filter(activity => 
    activity.weekNumber === currentWeek && 
    activity.dogId === currentDog?.id
  );

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentWeek === 1) {
        setCurrentYear(currentYear - 1);
        setCurrentWeek(52);
      } else {
        setCurrentWeek(currentWeek - 1);
      }
    } else {
      if (currentWeek === 52) {
        setCurrentYear(currentYear + 1);
        setCurrentWeek(1);
      } else {
        setCurrentWeek(currentWeek + 1);
      }
    }
  };

  const handleActivityClick = (activity: ScheduledActivity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const totalActivities = weekActivities.length;
  const completedActivities = weekActivities.filter(a => a.completed).length;

  if (totalActivities === 0) {
    return <EmptyWeeklyPlanner onPillarSelect={onPillarSelect} />;
  }

  return (
    <>
      <Card className="overflow-hidden">
        <WeeklyPlannerHeader
          completedActivities={completedActivities}
          totalActivities={totalActivities}
          currentWeek={currentWeek}
          currentYear={currentYear}
          onNavigateWeek={navigateWeek}
        />
        
        <CardContent className="mobile-space-y mobile-card">
          <WeeklyGrid
            weekActivities={weekActivities}
            onToggleCompletion={toggleActivityCompletion}
            onActivityClick={handleActivityClick}
          />

          <WeeklySummary
            completedActivities={completedActivities}
            totalActivities={totalActivities}
          />
        </CardContent>
      </Card>

      <ActivityDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        activity={selectedActivity}
        activityDetails={selectedActivity ? getActivityDetails(selectedActivity.activityId) : null}
        onToggleCompletion={toggleActivityCompletion}
      />
    </>
  );
};

export default WeeklyPlannerCard;
