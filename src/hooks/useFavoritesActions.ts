import { useState, useCallback } from 'react';
import { favouritesService } from '@/services/favouritesService';
import { ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useToast } from '@/hooks/use-toast';
import { useDog } from '@/contexts/DogContext';

export const useFavoritesActions = () => {
  const { currentDog } = useDog();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const addToFavorites = useCallback(async (
    activity: ActivityLibraryItem | UserActivity | DiscoveredActivity,
    activityType: 'library' | 'user' | 'discovered' = 'library'
  ) => {
    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await favouritesService.addToFavourites(currentDog.id, activity, activityType);
      
      toast({
        title: "Added to favorites!",
        description: `${activity.title} has been saved to your favorites`,
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      toast({
        title: "Failed to add favorite",
        description: "This activity may already be in your favorites",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentDog, toast]);

  const removeFromFavorites = useCallback(async (favoriteId: string) => {
    try {
      setLoading(true);
      await favouritesService.removeFromFavourites(favoriteId);
      
      toast({
        title: "Removed from favorites",
        description: "Activity has been removed from your favorites",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      toast({
        title: "Failed to remove favorite",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    addToFavorites,
    removeFromFavorites,
    loading
  };
};