
import React from 'react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { CheckCircle, Circle, Clock, Calendar } from 'lucide-react';

interface AccordionDayCardProps {
  activities: ScheduledActivity[];
  getActivityDetails: (id: string) => ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
  onToggleCompletion: (activityId: string) => void;
  onActivityClick?: (activity: ScheduledActivity) => void;
}

const AccordionDayCard: React.FC<AccordionDayCardProps> = ({
  activities,
  getActivityDetails,
  onToggleCompletion,
  onActivityClick
}) => {
  const getPillarGradientBackground = (pillar: string, completed: boolean) => {
    const baseOpacity = completed ? '0.8' : '0.6';
    const gradients = {
      mental: `bg-gradient-to-br from-purple-200/${baseOpacity} to-purple-300/${baseOpacity}`,
      physical: `bg-gradient-to-br from-emerald-200/${baseOpacity} to-emerald-300/${baseOpacity}`,
      social: `bg-gradient-to-br from-blue-200/${baseOpacity} to-blue-300/${baseOpacity}`,
      environmental: `bg-gradient-to-br from-teal-200/${baseOpacity} to-teal-300/${baseOpacity}`,
      instinctual: `bg-gradient-to-br from-orange-200/${baseOpacity} to-orange-300/${baseOpacity}`
    };
    return gradients[pillar as keyof typeof gradients] || `bg-gradient-to-br from-gray-200/${baseOpacity} to-gray-300/${baseOpacity}`;
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

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <Calendar className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No activities planned</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map(activity => {
        const activityDetails = getActivityDetails(activity.activityId);
        if (!activityDetails) return null;
        
        const pillarGradient = getPillarGradientBackground(activityDetails.pillar, activity.completed);
        const pillarIcon = getPillarIcon(activityDetails.pillar);
        const pillarIconColor = getPillarIconColor(activityDetails.pillar);
        
        return (
          <div 
            key={activity.id} 
            onClick={() => onActivityClick?.(activity)} 
            className={`
              relative p-5 rounded-2xl cursor-pointer transition-all duration-200
              hover:shadow-lg transform hover:scale-[1.02] border-3 border-gray-300
              ${pillarGradient} backdrop-blur-sm
            `}
          >
            {/* Activity Content */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Pillar Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${pillarIconColor}`}>
                  {pillarIcon}
                </div>
                
                {/* Activity Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-gray-800 truncate text-lg ${
                    activity.completed ? 'line-through opacity-75' : ''
                  }`}>
                    {activityDetails.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">{activityDetails.duration}m</span>
                  </div>
                </div>
              </div>

              {/* Completion Toggle */}
              <button 
                onClick={e => {
                  e.stopPropagation();
                  onToggleCompletion(activity.id);
                }} 
                className="flex-shrink-0 p-2 rounded-full hover:bg-white/40 transition-colors"
              >
                {activity.completed ? (
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                ) : (
                  <Circle className="w-7 h-7 text-gray-500" />
                )}
              </button>
            </div>

            {/* Completion Notes */}
            {activity.completed && activity.completionNotes && (
              <div className="mt-4 text-sm text-gray-800 bg-white/70 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/50">
                <span className="font-medium">Note:</span> "{activity.completionNotes}"
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AccordionDayCard;
