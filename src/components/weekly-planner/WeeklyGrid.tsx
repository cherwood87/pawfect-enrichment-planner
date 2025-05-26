
import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import DayActivityCard from './DayActivityCard';
import { useActivity } from '@/contexts/ActivityContext';

interface WeeklyGridProps {
  weekActivities: ScheduledActivity[];
  onToggleCompletion: (activityId: string) => void;
}

const WeeklyGrid: React.FC<WeeklyGridProps> = ({
  weekActivities,
  onToggleCompletion
}) => {
  const { getActivityDetails } = useActivity();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group activities by day of week
  const activitiesByDay = dayNames.reduce((acc, _, dayIndex) => {
    acc[dayIndex] = weekActivities.filter(activity => activity.dayOfWeek === dayIndex);
    return acc;
  }, {} as Record<number, ScheduledActivity[]>);

  return (
    <div className="overflow-x-auto">
      <div
        className="
          grid grid-cols-7 gap-2
          min-w-[630px]    // 90px per day, adjust as needed
        "
      >
        {dayNames.map((dayName, dayIndex) => {
          const dayActivities = activitiesByDay[dayIndex] || [];
          const dayCompleted = dayActivities.filter(a => a.completed).length;
          const dayTotal = dayActivities.length;

          return (
            <div
              key={dayIndex}
              className="
                text-center
                min-w-[90px] sm:min-w-[120px] px-2 py-2
                bg-white rounded-md border
                flex flex-col items-center
              "
            >
              <div className="text-xs font-medium text-gray-600 mb-2">
                {dayName}
              </div>
              <div className="space-y-1 w-full">
                {dayActivities.map((activity) => {
                  const activityDetails = getActivityDetails(activity.activityId);
                  if (!activityDetails) return null;

                  return (
                    <DayActivityCard
                      key={activity.id}
                      activity={activity}
                      activityDetails={activityDetails}
                      onToggleCompletion={onToggleCompletion}
                    />
                  );
                })}
                {dayActivities.length === 0 && (
                  <div className="text-gray-400 text-xs py-4 truncate">
                    No activities
                  </div>
                )}
              </div>
              {dayTotal > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {dayCompleted}/{dayTotal}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyGrid;