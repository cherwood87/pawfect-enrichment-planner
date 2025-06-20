import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Users, TreePine, Target } from "lucide-react";

interface ActivityListItemProps {
  activity: any;
  onSelect: (activity: any) => void;
  buttonText?: string;
}

const ActivityListItem: React.FC<ActivityListItemProps> = ({
  activity,
  onSelect,
  buttonText = "Select",
}) => {
  const pillars = [
    { id: "mental", name: "Mental", icon: Brain, color: "purple" },
    { id: "physical", name: "Physical", icon: Zap, color: "green" },
    { id: "social", name: "Social", icon: Users, color: "blue" },
    {
      id: "environmental",
      name: "Environmental",
      icon: TreePine,
      color: "teal",
    },
    { id: "instinctual", name: "Instinctual", icon: Target, color: "orange" },
  ];

  const pillarInfo = pillars.find((p) => p.id === activity.pillar);
  const IconComponent = pillarInfo?.icon || Brain;

  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3">
        <div
          className={`w-8 h-8 bg-${pillarInfo?.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <IconComponent className={`w-4 h-4 text-${pillarInfo?.color}-600`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-800 truncate">
            {activity.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {activity.benefits}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {activity.duration} min
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {activity.difficulty}
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={() => onSelect(activity)}
              className="text-xs"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityListItem;
