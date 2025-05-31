import { supabase } from '@/integrations/supabase/client';
import { ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
export interface FavouriteActivity {
  id: string;
  user_id: string;
  dog_id: string;
  activity_id: string;
  activity_type: 'library' | 'user' | 'discovered';
  created_at: string;
  updated_at: string;
  // Activity details (not stored in DB, populated when fetched)
  title?: string;
  pillar?: string;
  difficulty?: string;
  duration?: number;
}
export const favouritesService = {
  // Get all favourites for a dog
  async getFavourites(dogId: string): Promise<FavouriteActivity[]> {
    const { data, error } = await supabase
      .from('favourites')
      .select('*')
      .eq('dog_id', dogId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching favourites:', error);
      throw error;
    }
    // Type assertion to ensure activity_type is properly typed
    return (data || []) as FavouriteActivity[];
  },
  // Add activity to favourites
  async addToFavourites(
    dogId: string,
    activity: ActivityLibraryItem | UserActivity | DiscoveredActivity,
    activityType: 'library' | 'user' | 'discovered' = 'library'
  ): Promise<FavouriteActivity> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to add favourites');
    }
    const { data, error } = await supabase
      .from('favourites')
      .insert({
        user_id: user.id,
        dog_id: dogId,
        activity_id: activity.id,
        activity_type: activityType
      })
      .select()
      .single();
    if (error) {
      console.error('Error adding to favourites:', error);
      throw error;
    }
    // Type assertion to ensure activity_type is properly typed
    return data as FavouriteActivity;
  },
  // Remove from favourites
  async removeFromFavourites(favouriteId: string): Promise<void> {
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('id', favouriteId);
    if (error) {
      console.error('Error removing from favourites:', error);
      throw error;
    }
  },
  // Check if activity is favourited
  async isFavourited(dogId: string, activityId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favourites')
      .select('id')
      .eq('dog_id', dogId)
      .eq('activity_id', activityId)
      .maybeSingle();
    if (error) {
      console.error('Error checking favourite status:', error);
      return false;
    }
    return !!data;
  }
};