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
    <div className="overflow-x-auto py-2">
      <div
        className="
          grid grid-cols-7 gap-4
          min-w-[700px]    // wider for more breathing room
        "
      >
        {dayNames.map((dayName, dayIndex) => {
          const dayActivities = activitiesByDay[dayIndex] || [];
          const dayCompleted = dayActivities.filter(a => a.completed).length;
          const dayTotal = dayActivities.length;

          // Alternate backgrounds for days
          const bgColor = dayIndex % 2 === 0 ? "bg-blue-50" : "bg-white";

          return (
            <div
              key={dayIndex}
              className={`
                relative
                text-center
                min-w-[110px] px-3 py-3
                rounded-xl border border-gray-200 shadow-sm
                flex flex-col items-center transition
                ${bgColor}
                hover:shadow-lg hover:-translate-y-1
              `}
            >
              <div className="text-sm font-extrabold text-blue-700 mb-3 tracking-wide">
                {dayName}
              </div>

              <div className="space-y-2 w-full flex-1">
                {dayActivities.map((activity) => {
                  const activityDetails = getActivityDetails(activity.activityId);
                  if (!activityDetails) return null;

                  return (
                    <div
                      key={activity.id}
                      className={`
                        w-full px-2 py-2 rounded-lg shadow 
                        bg-gradient-to-r from-blue-400 to-purple-400
                        text-white font-semibold text-xs
                        flex items-center justify-between gap-2
                        hover:scale-105 transition
                      `}
                    >
                      <DayActivityCard
                        activity={activity}
                        activityDetails={activityDetails}
                        onToggleCompletion={onToggleCompletion}
                      />
                    </div>
                  );
                })}
                {dayActivities.length === 0 && (
                  <div className="text-gray-300 text-xs py-7 font-medium">
                    No activities
                  </div>
                )}
              </div>

              {dayTotal > 0 && (
                <div className="mt-4 flex items-center gap-1 justify-center">
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {dayCompleted}/{dayTotal} done
                  </span>
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