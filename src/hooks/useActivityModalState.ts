
import { useState } from 'react';
import { useDog } from '@/contexts/DogContext';
import { useFavourites } from '@/hooks/useFavourites';
import { useChat } from '@/contexts/ChatContext';
import { ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

export const useActivityModalState = (
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity | null,
  onClose: () => void
) => {
  const { currentDog } = useDog();
  const { addToFavourites } = useFavourites(currentDog?.id || null);
  const { loadConversation } = useChat();

  const [isFavouriting, setIsFavouriting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleNeedHelp = () => {
    if (!activityDetails) return;
    
    loadConversation(currentDog?.id || '', 'activity-help');
    setIsChatOpen(true);
  };

  const handleAddToFavourites = async () => {
    if (!activityDetails) return;
    
    setIsFavouriting(true);
    
    try {
      let activityType: 'library' | 'user' | 'discovered' = 'library';
      if ('isCustom' in activityDetails && activityDetails.isCustom) {
        activityType = 'user';
      } else if ('source' in activityDetails && activityDetails.source === 'discovered') {
        activityType = 'discovered';
      }
      
      await addToFavourites(activityDetails, activityType);
    } catch (error) {
      console.error('Error adding to favourites:', error);
    } finally {
      setIsFavouriting(false);
    }
  };

  return {
    isFavouriting,
    isChatOpen,
    setIsChatOpen,
    handleNeedHelp,
    handleAddToFavourites
  };
};
