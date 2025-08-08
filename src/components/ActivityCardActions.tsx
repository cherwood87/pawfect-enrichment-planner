
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, MessageCircle } from 'lucide-react';

interface ActivityCardActionsProps {
  onClose: () => void;
  onScheduleActivity: () => Promise<void>;
  onAddToFavourites: () => Promise<void>;
  disabled: boolean;
  onNeedHelp?: () => void;
}

const ActivityCardActions: React.FC<ActivityCardActionsProps> = ({
  onClose,
  onScheduleActivity,
  onAddToFavourites,
  disabled,
  onNeedHelp
}) => {
  const handleScheduleClick = async () => {
    try {
      await onScheduleActivity();
    } catch (error) {
      console.error('Error scheduling activity:', error);
    }
  };

  const handleFavouritesClick = async () => {
    try {
      await onAddToFavourites();
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-purple-200/50">
      <Button 
        variant="outline" 
        onClick={onClose} 
        className="rounded-2xl border-purple-300 hover:bg-purple-50"
      >
        Close
      </Button>
      <Button
        onClick={handleFavouritesClick}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={disabled}
      >
        <Heart className="w-4 h-4 mr-2" />
        Add to Favourites
      </Button>
      {onNeedHelp && (
        <Button
          onClick={onNeedHelp}
          variant="outline"
          className="rounded-2xl border-purple-300 text-purple-700 hover:bg-purple-50"
          disabled={disabled}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Need Help?
        </Button>
      )}
    </div>
  );
};

export default ActivityCardActions;
