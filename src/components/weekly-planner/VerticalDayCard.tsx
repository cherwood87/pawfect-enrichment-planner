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
  const getPillarGradient = (pillar: string) => {
    const gradients = {
      mental: 'from-purple-400 to-purple-500',
      physical: 'from-green-400 to-green-500',
      social: 'from-blue-400 to-blue-500',
      environmental: 'from-teal-400 to-teal-500',
      instinctual: 'from-orange-400 to-orange-500'
    };
    return gradients[pillar as keyof typeof gradients] || 'from-gray-400 to-gray-500';
  };
  const getCompletionStatus = () => {
    if (totalCount === 0) return {
      color: 'bg-gray-100',
      text: 'text-gray-500',
      label: 'No activities'
    };
    if (completedCount === totalCount) return {
      color: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: 'Complete!'
    };
    if (completedCount > 0) return {
      color: 'bg-blue-100',
      text: 'text-blue-700',
      label: `${completedCount} done`
    };
    return {
      color: 'bg-orange-100',
      text: 'text-orange-700',
      label: 'Not started'
    };
  };
  const status = getCompletionStatus();
  return <div className={`
      rounded-xl border transition-all duration-300 hover:shadow-md
      ${isToday ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-200'}
    `}>
      {/* Simplified Day Header */}
      <div className={`
        flex items-center justify-between p-4 border-b border-gray-100
        ${isToday ? 'bg-blue-50/50' : 'bg-gray-50/50'}
      `}>
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
            ${isToday ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-white text-gray-700 border border-gray-200'}
          `}>
            {dayShort}
          </div>
          <div>
            <h3 className={`font-bold ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
              {dayName}
              {isToday && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Today</span>}
            </h3>
          </div>
        </div>
        
        {/* Consolidated Status */}
        <div className="flex items-center space-x-2">
          <Badge className={`${status.color} ${status.text} border-0 text-xs font-medium`}>
            {totalCount > 0 ? `${completedCount}/${totalCount}` : '0'}
          </Badge>
          <span className="text-xs text-gray-500">{status.label}</span>
        </div>
      </div>

      {/* Activities */}
      <div className="p-4 bg-slate-50">
        {totalCount === 0 ? <div className="text-center py-4 text-gray-400">
            <Calendar className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activities</p>
          </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activities.map(activity => {
          const activityDetails = getActivityDetails(activity.activityId);
          if (!activityDetails) return null;
          const pillarGradient = getPillarGradient(activityDetails.pillar);
          return <div key={activity.id} onClick={() => onActivityClick?.(activity)} className={`
                    relative p-3 rounded-lg border cursor-pointer transition-all duration-200
                    hover:shadow-md transform hover:scale-105
                    ${activity.completed ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-white hover:border-blue-200'}
                  `}>
                  {/* Enhanced Pillar Indicator */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pillarGradient} rounded-t-lg`} />
                  
                  {/* Activity Content */}
                  <div className="space-y-2">
                    {/* Header with completion toggle */}
                    <div className="flex items-start justify-between">
                      <h4 className={`font-semibold text-sm leading-tight flex-1 pr-2 ${activity.completed ? 'text-emerald-600 line-through' : 'text-gray-800'}`}>
                        {activityDetails.title}
                      </h4>
                      <button onClick={e => {
                  e.stopPropagation();
                  onToggleCompletion(activity.id);
                }} className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        {activity.completed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>

                    {/* Simplified Meta Info */}
                    <div className="flex items-center justify-between text-xs">
                      <Badge className={`bg-gradient-to-r ${pillarGradient} text-white border-0 text-xs px-2 py-1`}>
                        {activityDetails.pillar.charAt(0).toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{activityDetails.duration}m</span>
                      </div>
                    </div>

                    {/* Completion Notes Preview */}
                    {activity.completed && activity.completionNotes && <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 truncate">
                        "{activity.completionNotes}"
                      </div>}
                  </div>
                </div>;
        })}
          </div>}
      </div>
    </div>;
};
export default VerticalDayCard;