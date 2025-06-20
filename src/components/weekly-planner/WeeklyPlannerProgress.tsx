import React from "react";
import { Progress } from "@/components/ui/progress";

interface WeeklyPlannerProgressProps {
  weekCompletion: number;
}

const WeeklyPlannerProgress: React.FC<WeeklyPlannerProgressProps> = ({
  weekCompletion,
}) => {
  return (
    <Progress value={weekCompletion} className="h-4 rounded-xl bg-purple-200" />
  );
};

export default WeeklyPlannerProgress;
