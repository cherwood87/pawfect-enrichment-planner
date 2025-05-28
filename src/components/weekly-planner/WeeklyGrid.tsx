
import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useActivity } from '@/contexts/ActivityContext';
import { Calendar, Target } from 'lucide-react';
import VerticalDayCard from './VerticalDayCard';

interface WeeklyGridProps {
  weekActivities: ScheduledActivity[];
  onToggleCompletion: (activityId: string) => void;
  onActivityClick?: (activity: ScheduledActivity) => void;
}

const WeeklyGrid: React.FC<WeeklyGridProps> = ({
  weekActivities,
  onToggleCompletion,
  onActivityClick
}) => {
  const { getActivityDetails } = useActivity();
  
  const dayNames = [
    { short: 'Sun', full: 'Sunday' },
    { short: 'Mon', full: 'Monday' }, 
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' }
  ];

  // Get current day and reorder starting from today
  const getCurrentDayIndex = () => new Date().getDay();
  const currentDayIndex = getCurrentDayIndex();
  
  // Create reordered days array starting from today
  const reorderedDays = [
    ...dayNames.slice(currentDayIndex),
    ...dayNames.slice(0, currentDayIndex)
  ];

  // Map original day indices to reordered positions
  const getOriginalDayIndex = (reorderedIndex: number) => {
    return (currentDayIndex + reorderedIndex) % 7;
  };

  // Group activities by day of week
  const activitiesByDay = dayNames.reduce((acc, _, dayIndex) => {
    acc[dayIndex] = weekActivities.filter(activity => activity.dayOfWeek === dayIndex);
    return acc;
  }, {} as Record<number, ScheduledActivity[]>);

  const totalActivities = weekActivities.length;

  if (totalActivities === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border border-purple-200">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl w-16 h-16 mx-auto mb-4">
          <Calendar className="w-10 h-10 text-white mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-purple-800 mb-2">No Activities This Week</h3>
        <p className="text-purple-600 mb-4">Start planning your dog's enrichment journey!</p>
        <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-xl border border-purple-200">
          <Target className="w-4 h-4" />
          <span className="font-medium">Add activities to get started</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reorderedDays.map((day, reorderedIndex) => {
        const originalDayIndex = getOriginalDayIndex(reorderedIndex);
        const dayActivities = activitiesByDay[originalDayIndex] || [];
        
        return (
          <VerticalDayCard
            key={originalDayIndex}
            dayName={day.full}
            dayShort={day.short}
            dayIndex={originalDayIndex}
            activities={dayActivities}
            getActivityDetails={getActivityDetails}
            onToggleCompletion={onToggleCompletion}
            onActivityClick={onActivityClick}
          />
        );
      })}
    </div>
  );
};

export default WeeklyGrid;
