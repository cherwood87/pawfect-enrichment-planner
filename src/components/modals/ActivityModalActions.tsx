import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Heart } from "lucide-react";
interface ActivityModalActionsProps {
  mode: "scheduled" | "library";
  isScheduling: boolean;
  isFavouriting: boolean;
  onSchedule: () => void;
  onAddToFavourites: () => void;
  onClose: () => void;
}
const ActivityModalActions: React.FC<ActivityModalActionsProps> = ({
  mode,
  isScheduling,
  isFavouriting,
  onSchedule,
  onAddToFavourites,
  onClose,
}) => {
  return (
    <>
      {mode === "library" && (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-200/50">
          <Button
            onClick={onSchedule}
            disabled={isScheduling}
            className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-zinc-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {isScheduling ? "Scheduling..." : "Add to Weekly Plan"}
          </Button>
          <Button
            onClick={onAddToFavourites}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isFavouriting}
          >
            <Heart className="w-4 h-4 mr-2" />
            {isFavouriting ? "Adding..." : "Add to Favourites"}
          </Button>
        </div>
      )}

      <div className="pt-4 border-t border-purple-200/50">
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full rounded-2xl border-purple-300 hover:bg-purple-50"
        >
          Close
        </Button>
      </div>
    </>
  );
};
export default ActivityModalActions;
