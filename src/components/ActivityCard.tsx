import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Star,
  CheckCircle,
  Sparkles,
  Brain,
  Zap,
  Users,
  TreePine,
  Target,
} from "lucide-react";
import { ActivityLibraryItem } from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";

interface ActivityCardProps {
  activity: ActivityLibraryItem | DiscoveredActivity;
  onSelect?: (activity: ActivityLibraryItem | DiscoveredActivity) => void;
  completed?: boolean;
  onComplete?: () => void;
  className?: string;
}

const pillars = [
  {
    id: "mental",
    name: "Mental",
    icon: Brain,
    color: "purple",
    gradient: "from-purple-100 to-purple-50",
  },
  {
    id: "physical",
    name: "Physical",
    icon: Zap,
    color: "green",
    gradient: "from-emerald-100 to-emerald-50",
  },
  {
    id: "social",
    name: "Social",
    icon: Users,
    color: "blue",
    gradient: "from-cyan-100 to-cyan-50",
  },
  {
    id: "environmental",
    name: "Environmental",
    icon: TreePine,
    color: "teal",
    gradient: "from-teal-100 to-teal-50",
  },
  {
    id: "instinctual",
    name: "Instinctual",
    icon: Target,
    color: "orange",
    gradient: "from-amber-100 to-amber-50",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-emerald-100 text-emerald-700 border-emerald-300";
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-300";
    case "Hard":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const getPillarData = (pillar: string) => {
  return pillars.find((p) => p.id === pillar) || pillars[0];
};

const isDiscoveredActivity = (
  activity: ActivityLibraryItem | DiscoveredActivity,
): activity is DiscoveredActivity => {
  return "source" in activity && activity.source === "discovered";
};

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onSelect,
  completed,
  onComplete,
  className = "",
}) => {
  const pillarData = getPillarData(activity.pillar);
  const PillarIcon = pillarData.icon;
  const isDiscovered = isDiscoveredActivity(activity);

  return (
    <Card
      className={`modern-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer relative group ${className}`}
      onClick={() => onSelect?.(activity)}
      tabIndex={0}
      aria-pressed={!!onSelect}
    >
      {/* Mark as Done Checkbox (Planner Mode Only) */}
      {typeof completed === "boolean" && onComplete && (
        <button
          type="button"
          aria-checked={completed}
          aria-label={completed ? "Mark incomplete" : "Mark as done"}
          className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center border-2 outline-none transition
            ${
              completed
                ? "bg-gradient-to-br from-purple-400 to-cyan-400 border-purple-400 text-white"
                : "bg-gray-100 border-gray-300 hover:bg-purple-100 text-gray-300"
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
        >
          {completed ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <span className="block w-3 h-3 rounded-full bg-white" />
          )}
        </button>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${pillarData.gradient} rounded-2xl flex items-center justify-center border-2 border-${pillarData.color}-200 group-hover:scale-110 transition-transform duration-300`}
            >
              <PillarIcon className={`w-5 h-5 text-${pillarData.color}-600`} />
            </div>
            <Badge
              className={`text-xs border-2 font-semibold ${getDifficultyColor(activity.difficulty)}`}
            >
              {activity.difficulty}
            </Badge>
          </div>
          <Badge
            variant="secondary"
            className="text-xs bg-purple-100 text-purple-700 border border-purple-200"
          >
            {activity.ageGroup}
          </Badge>
        </div>

        {isDiscovered && (
          <div className="flex items-center space-x-2 mb-2">
            <Badge
              className={`text-xs border font-semibold ${
                activity.approved
                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                  : "bg-purple-100 text-purple-700 border-purple-300"
              }`}
            >
              {activity.approved ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Auto-Added
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Discovered
                </>
              )}
            </Badge>
            {activity.qualityScore && (
              <Badge className="text-xs bg-gray-100 text-gray-600 border border-gray-200">
                {Math.round(activity.qualityScore * 100)}% quality
              </Badge>
            )}
          </div>
        )}

        <CardTitle className="text-lg font-bold text-purple-800 group-hover:text-purple-900 transition-colors leading-tight">
          {activity.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="font-medium">{activity.duration} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="font-medium">{activity.energyLevel}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {activity.benefits}
        </p>

        <div className="space-y-3">
          <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-3 border border-purple-200">
            <p className="text-xs font-semibold text-purple-700 mb-1">
              Materials needed:
            </p>
            <p className="text-xs text-purple-600">
              {activity.materials.slice(0, 2).join(", ")}
              {activity.materials.length > 2 ? "..." : ""}
            </p>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-amber-50 rounded-xl p-3 border border-cyan-200">
            <p className="text-xs font-semibold text-cyan-700 mb-1">
              Emotional goals:
            </p>
            <p className="text-xs text-cyan-600">
              {activity.emotionalGoals.slice(0, 2).join(", ")}
              {activity.emotionalGoals.length > 2 ? "..." : ""}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
