import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useActivity } from '@/contexts/ActivityContext';
import { Calendar, Target } from 'lucide-react';
import ActivityCardHeader from './ActivityCardHeader';
import ActivityCardStats from './ActivityCardStats';

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

  const getCurrentDayIndex = () => new Date().getDay();
  const currentDayIndex = getCurrentDayIndex();

  const reorderedDays = [
    ...dayNames.slice(currentDayIndex),
    ...dayNames.slice(0, currentDayIndex)
  ];

  const getOriginalDayIndex = (reorderedIndex: number) => {
    return (currentDayIndex + reorderedIndex) % 7;
  };

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
    <div className="space-y-6">
      {reorderedDays.map((day, reorderedIndex) => {
        const originalDayIndex = getOriginalDayIndex(reorderedIndex);
        const activities = activitiesByDay[originalDayIndex] || [];
        const completed = activities.filter(a => a.completed).length;

        return (
          <div
            key={originalDayIndex}
            className="bg-white rounded-3xl shadow-lg p-5 space-y-4 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-xl font-bold text-purple-800">{day.full}</h2>
                <p className="text-sm text-gray-500">
                  {completed}/{activities.length} activities completed
                </p>
              </div>
              <span className="text-sm text-purple-600 font-medium">{day.short}</span>
            </div>

            {activities.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No activities scheduled for this day.</p>
            ) : (
              <div className="space-y-4">
                {activities.map(activity => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 border shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() => onActivityClick?.(activity)}
                  >
                    <ActivityCardHeader activity={activity} />
                    <ActivityCardStats activity={activity} />

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-600">Mark as done</span>
                      <input
                        type="checkbox"
                        checked={activity.completed}
                        onChange={() => onToggleCompletion(activity.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyGrid;
