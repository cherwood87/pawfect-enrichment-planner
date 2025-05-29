
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Heart } from 'lucide-react';

interface ActivityCardActionsProps {
  onClose: () => void;
  onScheduleActivity: () => Promise<void>;
  onAddToFavourites: () => Promise<void>;
  disabled: boolean;
}

const ActivityCardActions: React.FC<ActivityCardActionsProps> = ({
  onClose,
  onScheduleActivity,
  onAddToFavourites,
  disabled
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 border-t">
      <Button variant="outline" onClick={onClose} className="lg:col-span-1">
        Close
      </Button>
      <Button
        onClick={onScheduleActivity}
        className="lg:col-span-2 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
        disabled={disabled}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Add to Weekly Plan
      </Button>
      <Button
        onClick={onAddToFavourites}
        className="lg:col-span-1 bg-yellow-400 text-white hover:bg-yellow-500"
        disabled={disabled}
      >
        <Heart className="w-4 h-4 mr-2" />
        Add to Favourites
      </Button>
      <Button
        variant="outline"
        className="lg:col-span-1 border-purple-300 text-purple-700 hover:bg-purple-50"
        disabled={disabled}
      >
        Need Help?
      </Button>
    </div>
  );
};

export default ActivityCardActions;
