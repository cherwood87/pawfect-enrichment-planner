import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface WeekNavigatorProps {
  currentWeek: number;
  currentYear: number;
  onNavigateWeek: (direction: "prev" | "next") => void;
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentWeek,
  currentYear,
  onNavigateWeek,
}) => {
  const getCurrentWeek = () => {
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor(
      (now.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000),
    );
    return Math.ceil(days / 7);
  };

  const isCurrentWeek =
    currentWeek === getCurrentWeek() &&
    currentYear === new Date().getFullYear();

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200 shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigateWeek("prev")}
        className="h-10 w-10 p-0 hover:bg-purple-100 transition-colors rounded-xl border border-purple-200"
      >
        <ChevronLeft className="w-5 h-5 text-purple-700" />
      </Button>

      <div className="flex items-center space-x-3">
        <Calendar className="w-5 h-5 text-purple-600" />
        <div className="text-center">
          <span className="text-lg font-bold text-purple-800 block">
            Week {currentWeek}, {currentYear}
          </span>
          {isCurrentWeek && (
            <span className="text-xs text-purple-600 font-medium">
              Current Week
            </span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigateWeek("next")}
        className="h-10 w-10 p-0 hover:bg-purple-100 transition-colors rounded-xl border border-purple-200"
      >
        <ChevronRight className="w-5 h-5 text-purple-700" />
      </Button>
    </div>
  );
};

export default WeekNavigator;
