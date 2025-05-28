
import { supabase } from '@/integrations/supabase/client';
import { ScheduledActivity, UserActivity, ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { ActivityMappers } from '../mappers/activityMappers';

export class SupabaseAdapter {
  // Scheduled Activities
  static async getScheduledActivities(dogId: string): Promise<ScheduledActivity[]> {
    const { data, error } = await supabase
      .from('scheduled_activities')
      .select('*')
      .eq('dog_id', dogId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching scheduled activities:', error);
      throw new Error('Failed to fetch scheduled activities');
    }

    return data.map(ActivityMappers.toScheduledActivity);
  }

  static async createScheduledActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
    const { data, error } = await supabase
      .from('scheduled_activities')
      .insert(ActivityMappers.fromScheduledActivity(activity))
      .select()
      .single();

    if (error) {
      console.error('Error creating scheduled activity:', error);
      throw new Error('Failed to create scheduled activity');
    }

    return ActivityMappers.toScheduledActivity(data);
  }

  static async updateScheduledActivity(activity: ScheduledActivity): Promise<ScheduledActivity> {
    const { data, error } = await supabase
      .from('scheduled_activities')
      .update(ActivityMappers.fromScheduledActivity(activity))
      .eq('id', activity.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating scheduled activity:', error);
      throw new Error('Failed to update scheduled activity');
    }

    return ActivityMappers.toScheduledActivity(data);
  }

  static async deleteScheduledActivity(id: string): Promise<void> {
    const { error } = await supabase
      .from('scheduled_activities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting scheduled activity:', error);
      throw new Error('Failed to delete scheduled activity');
    }
  }

  // User Activities
  static async getUserActivities(dogId: string): Promise<UserActivity[]> {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('dog_id', dogId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user activities:', error);
      throw new Error('Failed to fetch user activities');
    }

    return data.map(ActivityMappers.toUserActivity);
  }

  static async createUserActivity(activity: Omit<UserActivity, 'id' | 'createdAt'>): Promise<UserActivity> {
    const { data, error } = await supabase
      .from('user_activities')
      .insert(ActivityMappers.fromUserActivity(activity))
      .select()
      .single();

    if (error) {
      console.error('Error creating user activity:', error);
      throw new Error('Failed to create user activity');
    }

    return ActivityMappers.toUserActivity(data);
  }

  // Activity Sync
  static async syncActivitiesToSupabase(
    activities: (ActivityLibraryItem | DiscoveredActivity | UserActivity)[],
    source: 'curated' | 'discovered' | 'user',
    dogId?: string
  ): Promise<{ success: boolean; error?: string; synced: number }> {
    try {
      const activitiesToSync = activities.map(activity => ({
        id: activity.id,
        title: activity.title,
        pillar: activity.pillar,
        difficulty: activity.difficulty,
        duration: activity.duration,
        materials: activity.materials || [],
        emotional_goals: activity.emotionalGoals || [],
        instructions: activity.instructions || [],
        benefits: activity.benefits || '',
        tags: activity.tags || [],
        age_group: activity.ageGroup || 'All Ages',
        energy_level: activity.energyLevel || 'Medium',
        source,
        is_custom: source === 'user',
        dog_id: dogId,
        verified: true,
        quality_score: 1.0,
        approved: true,
        ...(source === 'discovered' && {
          source_url: (activity as DiscoveredActivity).sourceUrl,
          discovered_at: (activity as DiscoveredActivity).discoveredAt || new Date().toISOString(),
          verified: (activity as DiscoveredActivity).verified || false,
          quality_score: (activity as DiscoveredActivity).qualityScore || 0.5,
          approved: (activity as DiscoveredActivity).approved || false
        })
      }));

      const { error } = await supabase
        .from('activities')
        .upsert(activitiesToSync, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error syncing activities:', error);
        return { success: false, error: error.message, synced: 0 };
      }

      return { success: true, synced: activitiesToSync.length };
    } catch (error) {
      console.error('Failed to sync activities:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        synced: 0 
      };
    }
  }

  // Discovery Config
  static async saveDiscoveryConfig(config: ContentDiscoveryConfig, dogId: string): Promise<void> {
    // Implementation for saving discovery config
    console.log('Saving discovery config to Supabase:', config, dogId);
  }

  static async getDiscoveryConfig(dogId: string): Promise<ContentDiscoveryConfig | null> {
    // Implementation for getting discovery config
    console.log('Getting discovery config from Supabase:', dogId);
    return null;
  }

  // Discovered Activities
  static async getDiscoveredActivities(dogId: string): Promise<DiscoveredActivity[]> {
    // Implementation for getting discovered activities
    console.log('Getting discovered activities from Supabase:', dogId);
    return [];
  }

  static async createDiscoveredActivities(activities: DiscoveredActivity[], dogId: string): Promise<void> {
    // Implementation for creating discovered activities
    console.log('Creating discovered activities in Supabase:', activities.length, dogId);
  }
}
