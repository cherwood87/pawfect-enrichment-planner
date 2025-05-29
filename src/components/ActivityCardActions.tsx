
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, HelpCircle } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-6 border-t border-purple-100">
      <Button 
        variant="outline" 
        onClick={onClose} 
        className="lg:col-span-1 btn-outline"
      >
        Close
      </Button>
      <Button
        onClick={onScheduleActivity}
        className="lg:col-span-2 btn-primary"
        disabled={disabled}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Add to Weekly Plan
      </Button>
      <Button
        onClick={onAddToFavourites}
        className="lg:col-span-1 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl transition-all duration-200"
        disabled={disabled}
      >
        <Heart className="w-4 h-4 mr-2" />
        Add to Favourites
      </Button>
      <Button
        variant="outline"
        className="lg:col-span-1 btn-outline"
        disabled={disabled}
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Need Help?
      </Button>
    </div>
  );
};

export default ActivityCardActions;
