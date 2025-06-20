import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Sparkles } from "lucide-react";
import { ActivityLibraryItem } from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";

interface ActivityCardHeaderProps {
  activity: ActivityLibraryItem | DiscoveredActivity;
}

const ActivityCardHeader: React.FC<ActivityCardHeaderProps> = ({
  activity,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isDiscoveredActivity = (
    activity: ActivityLibraryItem | DiscoveredActivity,
  ): activity is DiscoveredActivity => {
    return "source" in activity && activity.source === "discovered";
  };

  const isDiscovered = isDiscoveredActivity(activity);

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {activity.title}
        </h2>
        <div className="flex items-center space-x-2 mb-3">
          <Badge
            variant="secondary"
            className={`text-xs ${getDifficultyColor(activity.difficulty)}`}
          >
            {activity.difficulty}
          </Badge>
          <Badge
            variant="secondary"
            className="text-xs bg-blue-100 text-blue-700"
          >
            {activity.pillar}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {activity.ageGroup}
          </Badge>
          {isDiscovered && (
            <Badge
              variant="secondary"
              className="text-xs bg-purple-100 text-purple-700"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Discovered
            </Badge>
          )}
        </div>
        {isDiscovered && activity.sourceUrl && (
          <div className="mb-3">
            <a
              href={activity.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View original source</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCardHeader;
