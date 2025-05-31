import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useActivity } from '@/contexts/ActivityContext';
import ActivityCard from '../activity/ActivityCard';
import { Calendar, Target } from 'lucide-react';

interface WeeklyGridProps {
  weekActivities: ScheduledActivity[];
  onToggleCompletion: (activityId: string) => void;
  onActivityClick?: (activity: ScheduledActivity) => void;
}

// Array of soft pastel backgrounds for days (customize as desired)
const dayBackgrounds = [
  "bg-purple-50", // Sunday
  "bg-blue-50",   // Monday
  "bg-pink-50",   // Tuesday
  "bg-yellow-50", // Wednesday
  "bg-green-50",  // Thursday
  "bg-cyan-50",   // Friday
  "bg-orange-50"  // Saturday
];

const dayNames = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const WeeklyGrid: React.FC<WeeklyGridProps> = ({
  weekActivities,
  onToggleCompletion,
  onActivityClick
}) => {
  const { getActivityDetails } = useActivity();

  // Build activities per day
  const activitiesByDay = Array(7)
    .fill(null)
    .map((_, idx) => weekActivities.filter(a => a.dayOfWeek === idx));

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
    <div className="flex flex-col gap-6 px-2 max-w-2xl mx-auto md:py-4">
      {activitiesByDay.map((activities, dayIdx) => {
        const completed = activities.filter(a => a.completed).length;

        return (
          <section
            key={dayIdx}
            className={`rounded-3xl ${dayBackgrounds[dayIdx]} shadow-md px-0 pb-4 pt-4`}
          >
            <header className="flex flex-col gap-1 px-4 pt-2 pb-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg md:text-xl font-bold text-purple-800">{dayNames[dayIdx]}</div>
                <div className="text-sm text-gray-500">{completed}/{activities.length} completed</div>
              </div>
            </header>
            <div className="flex flex-col gap-4 px-4">
              {activities.length === 0 ? (
                <div className="text-sm italic text-gray-300">No activities scheduled.</div>
              ) : (
                activities.map((activity) => {
                  const details = getActivityDetails(activity.activityId);
                  if (!details) return null;
                  return (
                    <ActivityCard
                      key={activity.id}
                      activity={details}
                      completed={activity.completed}
                      onComplete={() => onToggleCompletion(activity.id)}
                      onClick={() => onActivityClick?.(activity)}
                      // Optionally: add gradient/pastel via className
                      className="bg-gradient-to-br from-white to-purple-50"
                    />
                  );
                })
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default WeeklyGrid;