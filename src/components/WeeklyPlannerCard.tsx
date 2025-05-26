
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import WeeklyPlannerHeader from './weekly-planner/WeeklyPlannerHeader';
import WeeklyGrid from './weekly-planner/WeeklyGrid';
import WeeklySummary from './weekly-planner/WeeklySummary';
import EmptyWeeklyPlanner from './weekly-planner/EmptyWeeklyPlanner';

const WeeklyPlannerCard = () => {
  const { scheduledActivities, toggleActivityCompletion } = useActivity();
  const { currentDog } = useDog();
  
  const [currentWeek, setCurrentWeek] = useState(getISOWeek(new Date()));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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
        setCurrentWeek(52); // Assume 52 weeks per year
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

  const totalActivities = weekActivities.length;
  const completedActivities = weekActivities.filter(a => a.completed).length;

  if (totalActivities === 0) {
    return <EmptyWeeklyPlanner />;
  }

  return (
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
        />

        <WeeklySummary
          completedActivities={completedActivities}
          totalActivities={totalActivities}
        />
      </CardContent>
    </Card>
  );
};

export default WeeklyPlannerCard;
