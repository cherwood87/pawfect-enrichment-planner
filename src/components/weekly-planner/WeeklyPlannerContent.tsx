
import React from 'react';
import { CardContent } from '@/components/ui/card';
import AccordionWeeklyGrid from './AccordionWeeklyGrid';
import SingleDayView from './SingleDayView';
import WeeklySummary from './WeeklySummary';
import { ScheduledActivity } from '@/types/activity';

interface WeeklyPlannerContentProps {
  viewMode: 'week' | 'day';
  currentDate: Date;
  weekActivities: ScheduledActivity[];
  completedActivities: number;
  totalActivities: number;
  onToggleCompletion: (activityId: string) => void;
  onActivityClick: (activity: ScheduledActivity) => void;
}

const WeeklyPlannerContent: React.FC<WeeklyPlannerContentProps> = ({
  viewMode,
  currentDate,
  weekActivities,
  completedActivities,
  totalActivities,
  onToggleCompletion,
  onActivityClick
}) => {
  return (
    <CardContent className="p-6 bg-gradient-to-br from-purple-50/50 to-cyan-50/50">
      {viewMode === 'week' ? (
        <>
          <AccordionWeeklyGrid 
            weekActivities={weekActivities} 
            onToggleCompletion={onToggleCompletion} 
            onActivityClick={onActivityClick} 
          />

          <WeeklySummary 
            completedActivities={completedActivities} 
            totalActivities={totalActivities} 
          />
        </>
      ) : (
        <SingleDayView
          currentDate={currentDate}
          weekActivities={weekActivities}
          onToggleCompletion={onToggleCompletion}
          onActivityClick={onActivityClick}
        />
      )}
    </CardContent>
  );
};

export default WeeklyPlannerContent;
