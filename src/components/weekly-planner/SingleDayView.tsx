
import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useActivity } from '@/contexts/ActivityContext';
import { Calendar, Target, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock } from 'lucide-react';
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

  if (totalCount === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border border-purple-200">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6">
          <Calendar className="w-12 h-12 text-white mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-purple-800 mb-3">No Activities Today</h3>
        <p className="text-purple-600 mb-6">Start planning your dog's enrichment for today!</p>
        <button
          onClick={() => navigate('/activity-library')}
          className="inline-flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Activities</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Day Status Header */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"></div>
          <h3 className="font-bold text-gray-800">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={`${status.color} ${status.text} border-0 text-sm font-medium px-3 py-1`}>
            {totalCount > 0 ? `${completedCount}/${totalCount}` : '0'}
          </Badge>
          <span className="text-sm text-gray-500">{status.label}</span>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dayActivities.map(activity => {
          const activityDetails = getActivityDetails(activity.activityId);
          if (!activityDetails) return null;
          
          const pillarGradient = getPillarGradient(activityDetails.pillar);
          
          return (
            <div
              key={activity.id}
              onClick={() => onActivityClick?.(activity)}
              className={`
                relative p-6 rounded-xl border cursor-pointer transition-all duration-200
                hover:shadow-lg transform hover:scale-105
                ${activity.completed 
                  ? 'border-emerald-200 bg-emerald-50/50' 
                  : 'border-gray-200 bg-white hover:border-blue-200'
                }
              `}
            >
              {/* Pillar Indicator */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${pillarGradient} rounded-t-xl`} />
              
              {/* Activity Content */}
              <div className="space-y-4">
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
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Activity Meta */}
                <div className="flex items-center justify-between">
                  <Badge className={`bg-gradient-to-r ${pillarGradient} text-white border-0 px-3 py-1 font-medium`}>
                    {activityDetails.pillar.charAt(0).toUpperCase() + activityDetails.pillar.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{activityDetails.duration}m</span>
                  </div>
                </div>

                {/* Completion Notes */}
                {activity.completed && activity.completionNotes && (
                  <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                    <span className="font-medium">Notes:</span> "{activity.completionNotes}"
                  </div>
                )}

                {/* Activity Notes */}
                {activity.notes && (
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <span className="font-medium">Plan:</span> {activity.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SingleDayView;
