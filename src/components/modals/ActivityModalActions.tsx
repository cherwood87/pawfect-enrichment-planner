import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Play, Eye } from 'lucide-react';

interface ActivityModalActionsProps {
  mode: 'scheduled' | 'library';
  isFavouriting: boolean;
  onAddToFavourites: () => void;
  onClose: () => void;
  isStartActivity?: boolean;
  onToggleStartActivity?: () => void;
  canStartActivity?: boolean;
}
const ActivityModalActions: React.FC<ActivityModalActionsProps> = ({
  mode,
  isFavouriting,
  onAddToFavourites,
  onClose,
  isStartActivity = false,
  onToggleStartActivity,
  canStartActivity = true
}) => {
  return (
    <>
      {/* Start Activity / View Instructions Toggle - Only show when NOT in Start Activity mode */}
      {!isStartActivity && canStartActivity && onToggleStartActivity && (
        <div className="flex justify-center gap-3 pt-4 border-t border-purple-200/50">
          <Button 
            onClick={onToggleStartActivity}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-6"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Activity
          </Button>
          
          {mode === 'library' && (
            <Button 
              onClick={onAddToFavourites} 
              variant="outline"
              className="rounded-2xl border-purple-300 hover:bg-purple-50 px-6" 
              disabled={isFavouriting}
            >
              <Heart className="w-4 h-4 mr-2" />
              {isFavouriting ? 'Adding...' : 'Favorite'}
            </Button>
          )}
        </div>
      )}

      {/* Fallback for non-activity mode - Only show when NOT in Start Activity mode */}
      {!isStartActivity && (!canStartActivity || !onToggleStartActivity) && mode === 'library' && (
        <div className="flex justify-center pt-4 border-t border-purple-200/50">
          <Button 
            onClick={onAddToFavourites} 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-8" 
            disabled={isFavouriting}
          >
            <Heart className="w-4 h-4 mr-2" />
            {isFavouriting ? 'Adding...' : 'Add to Favorites'}
          </Button>
        </div>
      )}

      <div className="pt-4 border-t border-purple-200/50">
        <Button variant="outline" onClick={onClose} className="w-full rounded-2xl border-purple-300 hover:bg-purple-50">
          Close
        </Button>
      </div>
    </>
  );
};
export default ActivityModalActions;