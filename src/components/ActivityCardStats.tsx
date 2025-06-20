import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, Target } from "lucide-react";
import { ActivityLibraryItem } from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";

interface ActivityCardStatsProps {
  activity: ActivityLibraryItem | DiscoveredActivity;
}

const ActivityCardStats: React.FC<ActivityCardStatsProps> = ({ activity }) => {
  const isDiscoveredActivity = (
    activity: ActivityLibraryItem | DiscoveredActivity,
  ): activity is DiscoveredActivity => {
    return "source" in activity && activity.source === "discovered";
  };

  const isDiscovered = isDiscoveredActivity(activity);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-4 pb-3 text-center">
          <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-sm font-medium">{activity.duration} min</p>
          <p className="text-xs text-gray-600">Duration</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-3 text-center">
          <Star className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <p className="text-sm font-medium">{activity.energyLevel}</p>
          <p className="text-xs text-gray-600">Energy</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-3 text-center">
          <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-sm font-medium">{activity.difficulty}</p>
          <p className="text-xs text-gray-600">Difficulty</p>
          {isDiscovered && activity.qualityScore && (
            <p className="text-xs text-purple-600 mt-1">
              {Math.round(activity.qualityScore * 100)}% quality
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityCardStats;
