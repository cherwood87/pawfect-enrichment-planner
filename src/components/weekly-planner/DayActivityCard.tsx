
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Plus } from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem } from '@/types/activity';
import { UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

interface DayActivityCardProps {
  activity: ScheduledActivity;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity;
  onToggleCompletion: (activityId: string) => void;
  onAddActivity: () => void; // <-- New prop for Add button
}

const DayActivityCard: React.FC<DayActivityCardProps> = ({
  activity,
  activityDetails,
  onToggleCompletion,
  onAddActivity,
}) => {
  const getPillarColor = (pillar: string) => {
    const colors = {
      mental: 'purple',
      physical: 'green',
      social: 'blue',
      environmental: 'teal',
      instinctual: 'orange',
    };
    return colors[pillar as keyof typeof colors] || 'gray';
  };

  const pillarColor = getPillarColor(activityDetails.pillar);

  return (
    <div
      className={`relative p-2 rounded border text-xs transition-all ${
        activity.completed
          ? 'border-green-200 bg-green-50'
          : 'border-gray-200 bg-white hover:border-blue-200'
      }`}
    >
      {/* Add Button */}
      <button
        type="button"
        aria-label="Add Activity"
        onClick={onAddActivity}
        className="
          absolute right-2 top-2 z-10
          w-8 h-8 flex items-center justify-center
          rounded-full bg-blue-500 text-white shadow-lg
          hover:bg-blue-600 active:scale-95 transition
          border-2 border-white
        "
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Completion and Pillar */}
      <div className="flex items-center justify-between mb-1 pr-10" onClick={() => onToggleCompletion(activity.id)}>
        <div
          className={`
            flex items-center justify-center 
            w-7 h-7 rounded-full 
            bg-white shadow border-2
            ${activity.completed ? 'border-green-400' : 'border-gray-300'}
            transition
            cursor-pointer
          `}
        >
          {activity.completed ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Circle className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <Badge
          variant="secondary"
          className={`text-xs bg-${pillarColor}-100 text-${pillarColor}-700`}
        >
          {activityDetails.pillar.charAt(0).toUpperCase()}
        </Badge>
      </div>
      <div
        className={`font-medium ${
          activity.completed ? 'text-gray-500 line-through' : 'text-gray-800'
        }`}
        onClick={() => onToggleCompletion(activity.id)}
      >
        {activityDetails.title}
      </div>
      <div className="text-gray-500 mt-1" onClick={() => onToggleCompletion(activity.id)}>
        {activity.userSelectedTime || activity.scheduledTime}
      </div>
    </div>
  );
};

export default DayActivityCard;