import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem } from '@/types/activity';
import { UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

interface DayActivityCardProps {
  activity: ScheduledActivity;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity;
  onToggleCompletion: (activityId: string) => void;
}

const DayActivityCard: React.FC<DayActivityCardProps> = ({
  activity,
  activityDetails,
  onToggleCompletion
}) => {
  const getPillarColor = (pillar: string) => {
    const colors = {
      mental: 'purple',
      physical: 'green',
      social: 'blue',
      environmental: 'teal',
      instinctual: 'orange'
    };
    return colors[pillar as keyof typeof colors] || 'gray';
  };

  const pillarColor = getPillarColor(activityDetails.pillar);

  return (
    <div 
      className={`p-2 rounded border text-xs cursor-pointer transition-all ${
        activity.completed 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 bg-white hover:border-blue-200'
      }`}
      onClick={() => onToggleCompletion(activity.id)}
    >
      <div className="flex items-center justify-between mb-1">
        {activity.completed ? (
          <CheckCircle className="w-3 h-3 text-green-500" />
        ) : (
          <Circle className="w-3 h-3 text-gray-400" />
        )}
        <Badge 
          variant="secondary" 
          className={`text-xs bg-${pillarColor}-100 text-${pillarColor}-700`}
        >
          {activityDetails.pillar.charAt(0).toUpperCase()}
        </Badge>
      </div>
      <div className={`font-medium ${
        activity.completed ? 'text-gray-500 line-through' : 'text-gray-800'
      }`}>
        {activityDetails.title}
      </div>
      <div className="text-gray-500 mt-1">
        {activity.userSelectedTime || activity.scheduledTime}
      </div>
    </div>
  );
};

export default DayActivityCard;