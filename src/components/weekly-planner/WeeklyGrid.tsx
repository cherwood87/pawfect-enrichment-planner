
import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import DayActivityCard from './DayActivityCard';
import { useActivity } from '@/contexts/ActivityContext';

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
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group activities by day of week
  const activitiesByDay = dayNames.reduce((acc, _, dayIndex) => {
    acc[dayIndex] = weekActivities.filter(activity => activity.dayOfWeek === dayIndex);
    return acc;
  }, {} as Record<number, ScheduledActivity[]>);

  return (
    <div className="overflow-x-auto py-2">
      <div className="grid grid-cols-7 gap-3 min-w-[800px]">
        {dayNames.map((dayName, dayIndex) => {
          const dayActivities = activitiesByDay[dayIndex] || [];
          const dayCompleted = dayActivities.filter(a => a.completed).length;
          const dayTotal = dayActivities.length;

          return (
            <div
              key={dayIndex}
              className="relative text-center min-w-[110px] px-3 py-4 rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all"
            >
              {/* Day Header */}
              <div className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                {dayName}
              </div>

              {/* Activities Stack */}
              <div className="space-y-2 min-h-[120px]">
                {dayActivities.map((activity, index) => {
                  const activityDetails = getActivityDetails(activity.activityId);
                  if (!activityDetails) return null;

                  return (
                    <div
                      key={activity.id}
                      className="relative transform transition-all duration-200 hover:scale-105"
                      style={{
                        zIndex: dayActivities.length - index,
                        marginTop: index > 0 ? '-8px' : '0'
                      }}
                    >
                      <DayActivityCard
                        activity={activity}
                        activityDetails={activityDetails}
                        onToggleCompletion={onToggleCompletion}
                        onActivityClick={onActivityClick}
                        isStacked={dayActivities.length > 1}
                        stackIndex={index}
                      />
                    </div>
                  );
                })}
                
                {dayActivities.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-gray-300 text-xs">
                    No activities
                  </div>
                )}
              </div>

              {/* Day Summary */}
              {dayTotal > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    dayCompleted === dayTotal 
                      ? 'bg-green-100 text-green-700' 
                      : dayCompleted > 0 
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {dayCompleted}/{dayTotal} done
                  </div>
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
