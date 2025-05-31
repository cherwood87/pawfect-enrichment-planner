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

// ✅ NEW: Weekly plan interface
export interface WeeklyPlanItem {
  id: string;
  user_id: string;
  dog_id: string;
  activity_id: string;
  activity_type: 'library' | 'user' | 'discovered';
  planned_date: string; // YYYY-MM-DD format
  day_of_week: number; // 0-6 (Sunday-Saturday)
  completed: boolean;
  created_at: string;
  updated_at: string;
  // Activity details (populated when fetched)
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
  },

  // ✅ NEW: Add activity to weekly plan
  async addToWeeklyPlan(
    dogId: string,
    activity: ActivityLibraryItem | UserActivity | DiscoveredActivity,
    plannedDate: string, // YYYY-MM-DD format
    activityType: 'library' | 'user' | 'discovered' = 'library'
  ): Promise<WeeklyPlanItem> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to add to weekly plan');
    }

    // Calculate day of week (0-6, where 0 is Sunday)
    const date = new Date(plannedDate);
    const dayOfWeek = date.getDay();

    const { data, error } = await supabase
      .from('weekly_plan')
      .insert({
        user_id: user.id,
        dog_id: dogId,
        activity_id: activity.id,
        activity_type: activityType,
        planned_date: plannedDate,
        day_of_week: dayOfWeek,
        completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to weekly plan:', error);
      throw error;
    }

    return data as WeeklyPlanItem;
  },

  // ✅ NEW: Get weekly plan for a dog
  async getWeeklyPlan(dogId: string, startDate?: string, endDate?: string): Promise<WeeklyPlanItem[]> {
    let query = supabase
      .from('weekly_plan')
      .select('*')
      .eq('dog_id', dogId);

    if (startDate) {
      query = query.gte('planned_date', startDate);
    }
    if (endDate) {
      query = query.lte('planned_date', endDate);
    }

    const { data, error } = await query.order('planned_date', { ascending: true });

    if (error) {
      console.error('Error fetching weekly plan:', error);
      throw error;
    }

    return (data || []) as WeeklyPlanItem[];
  },

  // ✅ NEW: Get weekly plan for current week
  async getCurrentWeekPlan(dogId: string): Promise<WeeklyPlanItem[]> {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    return this.getWeeklyPlan(dogId, startDate, endDate);
  },

  // ✅ NEW: Mark weekly plan item as completed
  async markWeeklyPlanCompleted(planItemId: string, completed: boolean = true): Promise<WeeklyPlanItem> {
    const { data, error } = await supabase
      .from('weekly_plan')
      .update({ 
        completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', planItemId)
      .select()
      .single();

    if (error) {
      console.error('Error updating weekly plan item:', error);
      throw error;
    }

    return data as WeeklyPlanItem;
  },

  // ✅ NEW: Remove from weekly plan
  async removeFromWeeklyPlan(planItemId: string): Promise<void> {
    const { error } = await supabase
      .from('weekly_plan')
      .delete()
      .eq('id', planItemId);

    if (error) {
      console.error('Error removing from weekly plan:', error);
      throw error;
    }
  },

  // ✅ NEW: Check if activity is in weekly plan for a specific date
  async isInWeeklyPlan(dogId: string, activityId: string, plannedDate: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('weekly_plan')
      .select('id')
      .eq('dog_id', dogId)
      .eq('activity_id', activityId)
      .eq('planned_date', plannedDate)
      .maybeSingle();

    if (error) {
      console.error('Error checking weekly plan status:', error);
      return false;
    }

    return !!data;
  },

  // ✅ NEW: Add favourite directly to weekly plan (convenience method)
  async addFavouriteToWeeklyPlan(
    dogId: string,
    favouriteId: string,
    plannedDate: string
  ): Promise<WeeklyPlanItem> {
    // First get the favourite
    const { data: favourite, error } = await supabase
      .from('favourites')
      .select('*')
      .eq('id', favouriteId)
      .single();

    if (error || !favourite) {
      throw new Error('Favourite not found');
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const date = new Date(plannedDate);
    const dayOfWeek = date.getDay();

    const { data, error: insertError } = await supabase
      .from('weekly_plan')
      .insert({
        user_id: user.id,
        dog_id: dogId,
        activity_id: favourite.activity_id,
        activity_type: favourite.activity_type,
        planned_date: plannedDate,
        day_of_week: dayOfWeek,
        completed: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding favourite to weekly plan:', insertError);
      throw insertError;
    }

    return data as WeeklyPlanItem;
  }
};