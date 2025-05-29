
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem } from '@/types/activity';
import { UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

interface DayActivityCardProps {
  activity: ScheduledActivity;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity;
  onToggleCompletion: (activityId: string) => void;
  onActivityClick?: (activity: ScheduledActivity) => void;
  isStacked?: boolean;
  stackIndex?: number;
}

const DayActivityCard: React.FC<DayActivityCardProps> = ({
  activity,
  activityDetails,
  onToggleCompletion,
  onActivityClick,
  isStacked = false,
  stackIndex = 0
}) => {
  const getPillarBackground = (pillar: string) => {
    const backgrounds = {
      mental: 'bg-purple-100',
      physical: 'bg-green-100',
      social: 'bg-cyan-100', 
      environmental: 'bg-teal-100',
      instinctual: 'bg-amber-100'
    };
    return backgrounds[pillar as keyof typeof backgrounds] || 'bg-gray-100';
  };

  const getPillarBorder = (pillar: string) => {
    const borders = {
      mental: 'border-purple-200',
      physical: 'border-green-200',
      social: 'border-cyan-200',
      environmental: 'border-teal-200', 
      instinctual: 'border-amber-200'
    };
    return borders[pillar as keyof typeof borders] || 'border-gray-200';
  };

  const getPillarGradient = (pillar: string) => {
    const gradients = {
      mental: 'from-purple-400 to-purple-500',
      physical: 'from-green-400 to-green-500',
      social: 'from-cyan-400 to-cyan-500',
      environmental: 'from-teal-400 to-teal-500',
      instinctual: 'from-amber-400 to-amber-500'
    };
    return gradients[pillar as keyof typeof gradients] || 'from-gray-400 to-gray-500';
  };

  const pillarBackground = getPillarBackground(activityDetails.pillar);
  const pillarBorder = getPillarBorder(activityDetails.pillar);
  const pillarGradient = getPillarGradient(activityDetails.pillar);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompletion(activity.id);
  };

  const handleCardClick = () => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  return (
    <div 
      className={`
        relative w-full p-4 rounded-2xl cursor-pointer
        transition-all duration-200 hover:shadow-lg border-2
        ${activity.completed 
          ? 'border-emerald-200 bg-emerald-50 shadow-sm' 
          : `${pillarBackground} ${pillarBorder} shadow-sm`
        }
        ${isStacked ? 'shadow-lg' : ''}
      `}
      onClick={handleCardClick}
      style={{
        transform: isStacked ? `rotate(${(stackIndex - 1) * 2}deg)` : 'none',
        borderRadius: '16px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
      }}
    >
      {/* Content */}
      <div className="space-y-2">
        {/* Header with completion toggle */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className={`text-xs font-semibold leading-tight ${
              activity.completed ? 'text-emerald-600 line-through' : 'text-gray-800'
            }`}>
              {activityDetails.title}
            </h4>
          </div>
          <button
            onClick={handleToggleClick}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {activity.completed ? (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Activity details */}
        <div className="flex items-center justify-between text-xs">
          <Badge 
            variant="secondary" 
            className={`text-xs bg-gradient-to-r ${pillarGradient} text-white border-0 px-2 py-1`}
          >
            {activityDetails.pillar.charAt(0).toUpperCase()}
          </Badge>
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{activityDetails.duration}m</span>
          </div>
        </div>

        {/* Completion indicator */}
        {activity.completed && (
          <div className="text-center">
            <div className="w-full h-1 bg-emerald-300 rounded-full" />
            {activity.completionNotes && (
              <div className="text-xs text-emerald-600 mt-1 truncate">
                "{activity.completionNotes}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stack indicator */}
      {isStacked && stackIndex === 0 && (
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {stackIndex + 1}
        </div>
      )}
    </div>
  );
};

export default DayActivityCard;
