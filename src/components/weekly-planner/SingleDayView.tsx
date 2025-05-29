
import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useActivity } from '@/contexts/ActivityContext';
import { Calendar, Target, Plus, Clock, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SingleDayViewProps {
  currentDate: Date;
  weekActivities: ScheduledActivity[];
  onToggleCompletion: (activityId: string) => void;
  onActivityClick?: (activity: ScheduledActivity) => void;
}

const SingleDayView: React.FC<SingleDayViewProps> = ({
  currentDate,
  weekActivities,
  onToggleCompletion,
  onActivityClick
}) => {
  const { getActivityDetails } = useActivity();
  const navigate = useNavigate();
  
  const currentDayIndex = currentDate.getDay();
  const dayActivities = weekActivities.filter(activity => activity.dayOfWeek === currentDayIndex);
  
  const completedCount = dayActivities.filter(a => a.completed).length;
  const totalCount = dayActivities.length;

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
      label: 'No activities planned',
      icon: Calendar
    };
    if (completedCount === totalCount) return {
      color: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: 'All activities complete!',
      icon: Trophy
    };
    if (completedCount > 0) return {
      color: 'bg-blue-100',
      text: 'text-blue-700',
      label: `${completedCount} of ${totalCount} completed`,
      icon: Target
    };
    return {
      color: 'bg-orange-100',
      text: 'text-orange-700',
      label: 'Ready to start',
      icon: Clock
    };
  };

  const status = getCompletionStatus();
  const StatusIcon = status.icon;

  if (totalCount === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border-2 border-purple-200">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6">
          <Calendar className="w-12 h-12 text-white mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-purple-800 mb-3">No Activities Today</h3>
        <p className="text-purple-600 mb-6 max-w-md mx-auto">
          Start planning your dog's enrichment activities for {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}!
        </p>
        <button
          onClick={() => navigate('/activity-library')}
          className="modern-button-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Activities</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Day Status Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`${status.color} p-3 rounded-2xl`}>
              <StatusIcon className={`w-6 h-6 ${status.text}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-800">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </h3>
              <p className={`text-sm font-medium ${status.text}`}>
                {status.label}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-800">
              {completedCount}/{totalCount}
            </div>
            <p className="text-xs text-purple-600">Activities</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-purple-100 rounded-full h-3 shadow-inner">
          <div 
            className={`h-3 rounded-full transition-all duration-700 ${
              completedCount === totalCount && totalCount > 0
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' 
                : 'bg-gradient-to-r from-purple-400 to-cyan-400'
            }`} 
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }} 
          />
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {dayActivities.map((activity, index) => {
          const activityDetails = getActivityDetails(activity.activityId);
          if (!activityDetails) return null;
          
          const pillarGradient = getPillarGradient(activityDetails.pillar);
          
          return (
            <div
              key={activity.id}
              onClick={() => onActivityClick?.(activity)}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                hover:shadow-xl transform hover:scale-[1.02]
                ${activity.completed 
                  ? 'border-emerald-200 bg-emerald-50/50 shadow-lg' 
                  : 'border-purple-200 bg-white hover:border-blue-300 shadow-md'
                }
              `}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Enhanced Pillar Indicator */}
              <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${pillarGradient} rounded-t-xl`} />
              
              {/* Activity Content */}
              <div className="space-y-4 mt-2">
                {/* Header with completion toggle */}
                <div className="flex items-start justify-between">
                  <h4 className={`font-bold text-lg leading-tight flex-1 pr-3 ${
                    activity.completed ? 'text-emerald-600 line-through' : 'text-gray-800'
                  }`}>
                    {activityDetails.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompletion(activity.id);
                    }}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {activity.completed ? (
                      <CheckCircle className="w-7 h-7 text-emerald-500" />
                    ) : (
                      <Circle className="w-7 h-7 text-gray-400 hover:text-purple-500" />
                    )}
                  </button>
                </div>

                {/* Activity Meta */}
                <div className="flex items-center justify-between">
                  <Badge className={`bg-gradient-to-r ${pillarGradient} text-white border-0 px-4 py-2 font-semibold text-sm`}>
                    {activityDetails.pillar.charAt(0).toUpperCase() + activityDetails.pillar.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-2 text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold">{activityDetails.duration} min</span>
                  </div>
                </div>

                {/* Completion Notes */}
                {activity.completed && activity.completionNotes && (
                  <div className="text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-200">
                    <span className="font-semibold">Completed Notes:</span> "{activity.completionNotes}"
                  </div>
                )}

                {/* Activity Notes */}
                {activity.notes && (
                  <div className="text-sm text-purple-700 bg-purple-50 px-4 py-3 rounded-lg border border-purple-200">
                    <span className="font-semibold">Plan:</span> {activity.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Activity Prompt */}
      <div className="text-center py-8">
        <button
          onClick={() => navigate('/activity-library')}
          className="modern-button-outline inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add More Activities</span>
        </button>
      </div>
    </div>
  );
};

export default SingleDayView;
