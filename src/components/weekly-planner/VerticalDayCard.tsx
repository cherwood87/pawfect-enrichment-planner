
import React from 'react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Calendar } from 'lucide-react';

interface VerticalDayCardProps {
  dayName: string;
  dayShort: string;
  dayIndex: number;
  activities: ScheduledActivity[];
  getActivityDetails: (id: string) => ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
  onToggleCompletion: (activityId: string) => void;
  onActivityClick?: (activity: ScheduledActivity) => void;
}

const VerticalDayCard: React.FC<VerticalDayCardProps> = ({
  dayName,
  dayShort,
  dayIndex,
  activities,
  getActivityDetails,
  onToggleCompletion,
  onActivityClick
}) => {
  const completedCount = activities.filter(a => a.completed).length;
  const totalCount = activities.length;
  const isToday = new Date().getDay() === dayIndex;

  const getPillarBackgroundColor = (pillar: string, completed: boolean) => {
    const colors = {
      mental: completed ? 'bg-purple-200' : 'bg-purple-100',
      physical: completed ? 'bg-emerald-200' : 'bg-emerald-100',
      social: completed ? 'bg-blue-200' : 'bg-blue-100',
      environmental: completed ? 'bg-teal-200' : 'bg-teal-100',
      instinctual: completed ? 'bg-orange-200' : 'bg-orange-100'
    };
    return colors[pillar as keyof typeof colors] || (completed ? 'bg-gray-200' : 'bg-gray-100');
  };

  const getPillarIcon = (pillar: string) => {
    const icons = {
      mental: 'M',
      physical: 'P',
      social: 'S',
      environmental: 'E',
      instinctual: 'I'
    };
    return icons[pillar as keyof typeof icons] || 'A';
  };

  const getPillarIconColor = (pillar: string) => {
    const colors = {
      mental: 'bg-purple-500 text-white',
      physical: 'bg-emerald-500 text-white',
      social: 'bg-blue-500 text-white',
      environmental: 'bg-teal-500 text-white',
      instinctual: 'bg-orange-500 text-white'
    };
    return colors[pillar as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Day Header */}
      <div className={`
        flex items-center justify-between p-4 border-b border-gray-100
        ${isToday ? 'bg-blue-50' : 'bg-gray-50'}
      `}>
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
            ${isToday ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-200'}
          `}>
            {dayShort}
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
              {dayName}
              {isToday && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Today</span>}
            </h3>
            <p className="text-sm text-gray-600">{completedCount}/{totalCount} completed</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-lg font-bold text-orange-600">{completedCount}/{totalCount}</span>
          <p className="text-xs text-gray-500">
            {totalCount === 0 ? 'Not started' : 
             completedCount === totalCount ? 'Complete!' : 
             completedCount > 0 ? 'In progress' : 'Not started'}
          </p>
        </div>
      </div>

      {/* Activities */}
      <div className="p-4 space-y-3">
        {totalCount === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activities planned</p>
          </div>
        ) : (
          activities.map(activity => {
            const activityDetails = getActivityDetails(activity.activityId);
            if (!activityDetails) return null;
            
            const pillarBg = getPillarBackgroundColor(activityDetails.pillar, activity.completed);
            const pillarIcon = getPillarIcon(activityDetails.pillar);
            const pillarIconColor = getPillarIconColor(activityDetails.pillar);
            
            return (
              <div 
                key={activity.id} 
                onClick={() => onActivityClick?.(activity)} 
                className={`
                  relative p-4 rounded-2xl cursor-pointer transition-all duration-200
                  hover:shadow-md transform hover:scale-[1.02] border border-gray-100
                  ${pillarBg}
                `}
              >
                {/* Activity Content */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {/* Pillar Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${pillarIconColor}`}>
                      {pillarIcon}
                    </div>
                    
                    {/* Activity Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-gray-800 truncate ${
                        activity.completed ? 'line-through opacity-75' : ''
                      }`}>
                        {activityDetails.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{activityDetails.duration}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Completion Toggle */}
                  <button 
                    onClick={e => {
                      e.stopPropagation();
                      onToggleCompletion(activity.id);
                    }} 
                    className="flex-shrink-0 p-1 rounded-full hover:bg-white/50 transition-colors"
                  >
                    {activity.completed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Completion Notes */}
                {activity.completed && activity.completionNotes && (
                  <div className="mt-3 text-xs text-gray-700 bg-white/50 px-3 py-2 rounded-lg">
                    "{activity.completionNotes}"
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VerticalDayCard;
