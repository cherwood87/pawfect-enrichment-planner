
import React from 'react';

interface WeeklyProgressBarProps {
  completedActivities: number;
  totalActivities: number;
}

const WeeklyProgressBar: React.FC<WeeklyProgressBarProps> = ({
  completedActivities,
  totalActivities
}) => {
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <div className="mt-3">
      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
        <div 
          className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>Progress</span>
        <span className="font-semibold">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
    </div>
  );
};

export default WeeklyProgressBar;
