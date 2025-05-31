import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Star } from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

interface DayActivityCardProps {
  activity: ScheduledActivity;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity;
  onToggleCompletion: (activityId: string) => void;
  onActivityClick?: (activity: ScheduledActivity) => void;
  isStacked?: boolean;
  stackIndex?: number;
}

const getPillarChip = (pillar: string) => {
  switch (pillar) {
    case 'mental':
      return <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">Mental</span>;
    case 'physical':
      return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Physical</span>;
    case 'social':
      return <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold">Social</span>;
    case 'environmental':
      return <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">Environmental</span>;
    case 'instinctual':
      return <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">Instinctual</span>;
    default:
      return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">{pillar}</span>;
  }
};

const getDifficultyBadge = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Easy</span>;
    case 'medium':
      return <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">Medium</span>;
    case 'hard':
      return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Hard</span>;
    default:
      return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">{difficulty}</span>;
  }
};

const DayActivityCard: React.FC<DayActivityCardProps> = ({
  activity,
  activityDetails,
  onToggleCompletion,
  onActivityClick,
  isStacked = false,
  stackIndex = 0
}) => {
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompletion(activity.id);
  };

  const handleCardClick = () => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  // Show the first letter of the pillar as a round icon avatar (optional)
  const avatarBg = {
    mental: "bg-purple-400",
    physical: "bg-emerald-400",
    social: "bg-cyan-400",
    environmental: "bg-teal-400",
    instinctual: "bg-orange-400",
  }[activityDetails.pillar] || "bg-gray-300";

  return (
    <div
      className={`relative p-6 bg-white rounded-3xl shadow-lg border border-purple-100 flex flex-col gap-3 transition hover:shadow-xl cursor-pointer`}
      style={{
        transform: isStacked ? `rotate(${(stackIndex - 1) * 2}deg)` : 'none'
      }}
      onClick={handleCardClick}
    >
      {/* Pillar and difficulty badges */}
      <div className="flex gap-2 items-center mb-2">
        {getPillarChip(activityDetails.pillar)}
        {getDifficultyBadge(activityDetails.difficulty)}
        <div className="ml-auto">
          <button
            onClick={handleToggleClick}
            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
            tabIndex={0}
            aria-label={activity.completed ? "Mark as incomplete" : "Mark as completed"}
          >
            {activity.completed ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      {/* Title and duration */}
      <div className="flex items-center gap-3">
        {/* Round avatar for pillar */}
        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-lg ${avatarBg} shadow`}>
          {activityDetails.pillar.charAt(0).toUpperCase()}
        </span>
        <span className="font-semibold text-purple-900 text-lg">{activityDetails.title}</span>
      </div>
      {/* Description */}
      {activityDetails.benefits && (
        <div className="text-gray-600 text-sm">{activityDetails.benefits}</div>
      )}
      {/* Duration */}
      <div className="flex gap-2 mt-2">
        <span className="text-xs flex items-center text-purple-700 bg-purple-100 rounded-2xl px-3 py-1">
          <Clock className="w-4 h-4 mr-1" />
          {activityDetails.duration} min
        </span>
        {/* Add more info if desired */}
      </div>
      {/* CompletionNotes if completed */}
      {activity.completed && activity.completionNotes && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-xs text-emerald-900 mt-2">
          {activity.completionNotes}
        </div>
      )}
    </div>
  );
};

export default DayActivityCard;