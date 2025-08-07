import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
interface ActivityModalActionsProps {
  mode: 'scheduled' | 'library';
  isFavouriting: boolean;
  onAddToFavourites: () => void;
  onClose: () => void;
}
const ActivityModalActions: React.FC<ActivityModalActionsProps> = ({
  mode,
  isFavouriting,
  onAddToFavourites,
  onClose
}) => {
  return <>
      {mode === 'library' && <div className="flex justify-center pt-4 border-t border-purple-200/50">
          <Button onClick={onAddToFavourites} className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-8" disabled={isFavouriting}>
            <Heart className="w-4 h-4 mr-2" />
            {isFavouriting ? 'Adding...' : 'Add to Favorites'}
          </Button>
        </div>}

      <div className="pt-4 border-t border-purple-200/50">
        <Button variant="outline" onClick={onClose} className="w-full rounded-2xl border-purple-300 hover:bg-purple-50">
          Close
        </Button>
      </div>
    </>;
};
export default ActivityModalActions;