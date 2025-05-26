
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
      <div className="w-full bg-white rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default WeeklyProgressBar;
