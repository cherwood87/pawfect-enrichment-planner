
import React from 'react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Star } from 'lucide-react';

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

  const getPillarGradient = (pillar: string) => {
    const gradients = {
      mental: 'from-purple-400 to-purple-600',
      physical: 'from-green-400 to-green-600', 
      social: 'from-blue-400 to-blue-600',
      environmental: 'from-teal-400 to-teal-600',
      instinctual: 'from-orange-400 to-orange-600'
    };
    return gradients[pillar as keyof typeof gradients] || 'from-gray-400 to-gray-600';
  };

  const getCompletionStatus = () => {
    if (totalCount === 0) return { color: 'bg-gray-100', text: 'text-gray-500', label: 'No activities' };
    if (completedCount === totalCount) return { color: 'bg-green-100', text: 'text-green-700', label: 'Complete!' };
    if (completedCount > 0) return { color: 'bg-blue-100', text: 'text-blue-700', label: 'In progress' };
    return { color: 'bg-orange-100', text: 'text-orange-700', label: 'Not started' };
  };

  const status = getCompletionStatus();

  return (
    <div className={`
      relative rounded-xl border-2 transition-all duration-300 hover:shadow-lg
      ${isToday 
        ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md' 
        : 'border-gray-200 bg-white hover:border-blue-200'
      }
    `}>
      {/* Day Header */}
      <div className={`
        flex items-center justify-between p-4 border-b border-gray-100
        ${isToday ? 'bg-gradient-to-r from-blue-100 to-indigo-100' : 'bg-gray-50'}
        rounded-t-xl
      `}>
        <div className="flex items-center space-x-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center font-bold
            ${isToday 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
              : 'bg-white text-gray-700 border border-gray-200'
            }
          `}>
            {dayShort}
          </div>
          <div>
            <h3 className={`font-bold ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
              {dayName}
              {isToday && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Today</span>}
            </h3>
            <p className="text-sm text-gray-600">
              {totalCount} activit{totalCount === 1 ? 'y' : 'ies'}
            </p>
          </div>
        </div>
        
        {/* Day Status */}
        <div className="text-right">
          <Badge className={`${status.color} ${status.text} border-0`}>
            {completedCount}/{totalCount}
          </Badge>
          <div className="text-xs text-gray-500 mt-1">{status.label}</div>
        </div>
      </div>

      {/* Activities */}
      <div className="p-4">
        {totalCount === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activities planned</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activities.map((activity) => {
              const activityDetails = getActivityDetails(activity.activityId);
              if (!activityDetails) return null;

              const pillarGradient = getPillarGradient(activityDetails.pillar);

              return (
                <div
                  key={activity.id}
                  onClick={() => onActivityClick?.(activity)}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    transform hover:scale-105 hover:shadow-md
                    ${activity.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-white bg-white hover:border-blue-200'
                    }
                  `}
                >
                  {/* Pillar Gradient Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pillarGradient} rounded-t-lg`} />
                  
                  {/* Activity Content */}
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <h4 className={`font-semibold text-sm leading-tight ${
                        activity.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                      }`}>
                        {activityDetails.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompletion(activity.id);
                        }}
                        className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        {activity.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Activity Meta */}
                    <div className="flex items-center justify-between text-xs">
                      <Badge 
                        className={`bg-gradient-to-r ${pillarGradient} text-white border-0 text-xs`}
                      >
                        {activityDetails.pillar.charAt(0).toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <span>{activityDetails.duration}m</span>
                        <span>•</span>
                        <span>{activityDetails.difficulty}</span>
                      </div>
                    </div>

                    {/* Difficulty Indicator */}
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= (activityDetails.difficulty === 'Easy' ? 1 : activityDetails.difficulty === 'Medium' ? 2 : 3)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalDayCard;
