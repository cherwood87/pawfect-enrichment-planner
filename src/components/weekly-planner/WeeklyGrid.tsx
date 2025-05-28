
import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useActivity } from '@/contexts/ActivityContext';
import { Calendar, CheckCircle2, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

  // Group activities by day of week
  const activitiesByDay = dayNames.reduce((acc, _, dayIndex) => {
    acc[dayIndex] = weekActivities.filter(activity => activity.dayOfWeek === dayIndex);
    return acc;
  }, {} as Record<number, ScheduledActivity[]>);

  const totalActivities = weekActivities.length;
  const completedActivities = weekActivities.filter(a => a.completed).length;

  if (totalActivities === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-300" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Activities This Week</h3>
        <p className="text-gray-500 mb-4">Start planning your dog's enrichment journey!</p>
        <Badge variant="outline" className="bg-white">
          <Target className="w-3 h-3 mr-1" />
          Add activities to get started
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Week Overview */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-xl p-4 border border-green-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Week Progress</h3>
              <p className="text-sm text-gray-600">
                {completedActivities} of {totalActivities} activities completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">
              {totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-white rounded-full h-2 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-3">
        {dayNames.map((day, dayIndex) => {
          const dayActivities = activitiesByDay[dayIndex] || [];
          
          return (
            <VerticalDayCard
              key={dayIndex}
              dayName={day.full}
              dayShort={day.short}
              dayIndex={dayIndex}
              activities={dayActivities}
              getActivityDetails={getActivityDetails}
              onToggleCompletion={onToggleCompletion}
              onActivityClick={onActivityClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyGrid;
