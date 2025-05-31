import React from 'react';
import DayActivityCard from './DayActivityCard'; // Your nicely styled activity card

const pastelBg = [
  'bg-purple-50', // Sun
  'bg-cyan-50',   // Mon
  'bg-emerald-50',// Tue
  'bg-yellow-50', // Wed
  'bg-pink-50',   // Thu
  'bg-blue-50',   // Fri
  'bg-orange-50', // Sat
];

const VerticalDayCard = ({
  label,
  date,
  activities,
  onActivityClick,
  onToggleCompletion,
  getActivityDetails,
}) => {
  // Get % complete for the day
  const completed = activities.filter(a => a.completed).length;
  const total = activities.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`rounded-3xl ${pastelBg[date.getDay()]} shadow-md border border-purple-100 p-5 flex flex-col gap-2`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-purple-800">{label}</span>
        <span className="text-xs text-purple-600">{date.toDateString()}</span>
      </div>
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-600 mb-1">{completed} of {total} activities completed</div>
        <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-300 to-cyan-300 h-2 rounded-full" style={{width: `${percent}%`}} />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {activities.length > 0 ? (
          activities.map(activity => (
            <DayActivityCard
              key={activity.id}
              activity={activity}
              activityDetails={getActivityDetails(activity.activityId)}
              onToggleCompletion={onToggleCompletion}
              onActivityClick={onActivityClick}
            />
          ))
        ) : (
          <div className="text-gray-400 text-sm italic py-6 text-center">No activities</div>
        )}
      </div>
    </div>
  );
};

export default VerticalDayCard;