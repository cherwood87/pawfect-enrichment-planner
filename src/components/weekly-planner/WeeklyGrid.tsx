
import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useActivity } from '@/contexts/ActivityContext';
import { Calendar, CheckCircle2, Target, Sparkles } from 'lucide-react';
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
  const completedActivities = weekActivities.filter(a => a.completed).length;

  if (totalActivities === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 rounded-3xl border-2 border-purple-200 modern-card">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-4 rounded-3xl w-20 h-20 mx-auto mb-6">
          <Calendar className="w-12 h-12 text-white mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-purple-800 mb-3">No Activities This Week</h3>
        <p className="text-purple-600 mb-6 max-w-sm mx-auto">Start planning your dog's enrichment journey with activities from our library!</p>
        <Badge className="bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 border-2 border-purple-200 rounded-2xl px-6 py-3">
          <Target className="w-4 h-4 mr-2" />
          Add activities to get started
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Week Overview */}
      <div className="bg-gradient-to-r from-purple-50 via-cyan-50 to-amber-50 rounded-3xl p-6 border-2 border-purple-200 modern-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-800 flex items-center space-x-2">
                <span>Week Progress</span>
                {completedActivities === totalActivities && (
                  <Sparkles className="w-5 h-5 text-amber-500" />
                )}
              </h3>
              <p className="text-purple-600 font-medium">
                {completedActivities} of {totalActivities} activities completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0}%
            </div>
            <div className="text-sm text-purple-600 font-semibold">Complete</div>
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="mt-4 w-full bg-purple-100 rounded-full h-4 shadow-inner border border-purple-200">
          <div 
            className="bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 h-4 rounded-full transition-all duration-700 ease-out relative overflow-hidden" 
            style={{ width: `${totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0}%` }}
          >
            {/* Enhanced shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>
        <div className="flex justify-between text-sm text-purple-600 mt-2 font-medium">
          <span>Weekly Goal</span>
          <span className={`${completedActivities === totalActivities ? 'text-emerald-600' : ''}`}>
            {Math.round((completedActivities / totalActivities) * 100)}% Complete
            {completedActivities === totalActivities && " 🎉"}
          </span>
        </div>
      </div>

      {/* Enhanced Days List */}
      <div className="space-y-4">
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
    </div>
  );
};

export default WeeklyGrid;
