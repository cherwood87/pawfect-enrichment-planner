import React from "react";
import { CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDog } from "@/contexts/DogContext";

interface WeeklySummaryProps {
  completedActivities: number;
  totalActivities: number;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  completedActivities,
  totalActivities,
}) => {
  const isMobile = useIsMobile();
  const { currentDog } = useDog();

  if (completedActivities !== totalActivities || totalActivities === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg mobile-card text-center mt-4">
      <CheckCircle
        className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} text-green-500 mx-auto mb-1`}
      />
      <p className="text-sm font-medium text-green-800">
        Amazing Week Complete!
      </p>
      <p className="text-xs text-green-600">
        {currentDog?.name} had a fantastic week of enrichment!
      </p>
    </div>
  );
};

export default WeeklySummary;
