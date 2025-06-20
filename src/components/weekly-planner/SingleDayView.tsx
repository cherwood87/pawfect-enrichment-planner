import React from "react";
import { ScheduledActivity } from "@/types/activity";
import { useActivity } from "@/contexts/ActivityContext";
import { Calendar, Target, Plus, Clock, Trophy } from "lucide-react";
import { CheckCircle, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  onActivityClick,
}) => {
  const { getActivityDetails } = useActivity();
  const navigate = useNavigate();

  const currentDayIndex = currentDate.getDay();
  const dayActivities = weekActivities.filter(
    (activity) => activity.dayOfWeek === currentDayIndex,
  );

  const completedCount = dayActivities.filter((a) => a.completed).length;
  const totalCount = dayActivities.length;

  const getPillarBackground = (pillar: string) => {
    const backgrounds = {
      mental: "bg-purple-100",
      physical: "bg-green-100",
      social: "bg-cyan-100",
      environmental: "bg-teal-100",
      instinctual: "bg-amber-100",
    };
    return backgrounds[pillar as keyof typeof backgrounds] || "bg-gray-100";
  };

  const getPillarBorder = (pillar: string) => {
    const borders = {
      mental: "border-purple-200",
      physical: "border-green-200",
      social: "border-cyan-200",
      environmental: "border-teal-200",
      instinctual: "border-amber-200",
    };
    return borders[pillar as keyof typeof borders] || "border-gray-200";
  };

  const getPillarIcon = (pillar: string) => {
    const icons = {
      mental: "M",
      physical: "P",
      social: "S",
      environmental: "E",
      instinctual: "I",
    };
    return icons[pillar as keyof typeof icons] || "A";
  };

  const getPillarIconColor = (pillar: string) => {
    const colors = {
      mental: "bg-purple-500 text-white",
      physical: "bg-green-500 text-white",
      social: "bg-cyan-500 text-white",
      environmental: "bg-teal-500 text-white",
      instinctual: "bg-amber-500 text-white",
    };
    return colors[pillar as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getCompletionStatus = () => {
    if (totalCount === 0)
      return {
        color: "bg-gray-100",
        text: "text-gray-500",
        label: "No activities planned",
        icon: Calendar,
      };
    if (completedCount === totalCount)
      return {
        color: "bg-emerald-100",
        text: "text-emerald-700",
        label: "All activities complete!",
        icon: Trophy,
      };
    if (completedCount > 0)
      return {
        color: "bg-blue-100",
        text: "text-blue-700",
        label: `${completedCount} of ${totalCount} completed`,
        icon: Target,
      };
    return {
      color: "bg-orange-100",
      text: "text-orange-700",
      label: "Ready to start",
      icon: Clock,
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
        <h3 className="text-xl font-bold text-purple-800 mb-3">
          No Activities Today
        </h3>
        <p className="text-purple-600 mb-6 max-w-md mx-auto">
          Start planning your dog's enrichment activities for{" "}
          {currentDate.toLocaleDateString("en-US", { weekday: "long" })}!
        </p>
        <button
          onClick={() => navigate("/activity-library")}
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
      {/* Activities */}
      <div className="space-y-4">
        {dayActivities.map((activity, index) => {
          const activityDetails = getActivityDetails(activity.activityId);
          if (!activityDetails) return null;

          const pillarBg = getPillarBackground(activityDetails.pillar);
          const pillarBorder = getPillarBorder(activityDetails.pillar);
          const pillarIcon = getPillarIcon(activityDetails.pillar);
          const pillarIconColor = getPillarIconColor(activityDetails.pillar);

          return (
            <div
              key={activity.id}
              onClick={() => onActivityClick?.(activity)}
              className={`
                relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                hover:shadow-lg transform hover:scale-[1.02] border-2
                ${pillarBg} ${pillarBorder}
                shadow-sm
              `}
              style={{
                borderRadius: "16px",
                boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Pillar Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${pillarIconColor}`}
                  >
                    {pillarIcon}
                  </div>

                  {/* Activity Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-xl font-bold text-gray-800 mb-1 ${
                        activity.completed ? "line-through opacity-75" : ""
                      }`}
                    >
                      {activityDetails.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {activityDetails.duration} m
                        </span>
                      </div>
                      {activity.completed && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {activityDetails.duration}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Star for favorites (if needed) */}
                  {activity.completed && (
                    <div className="text-yellow-500">⭐</div>
                  )}

                  {/* Completion Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompletion(activity.id);
                    }}
                    className="p-2 rounded-full hover:bg-white/50 transition-colors"
                  >
                    {activity.completed ? (
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <Circle className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Completion Notes */}
              {activity.completed && activity.completionNotes && (
                <div className="mt-4 p-4 bg-white/70 rounded-xl">
                  <p className="text-gray-800 font-medium">
                    {activity.completionNotes}
                  </p>
                  <button className="mt-2 text-sm text-gray-600 underline">
                    Add Reflection
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Activity Prompt */}
      <div className="text-center py-8">
        <button
          onClick={() => navigate("/activity-library")}
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
