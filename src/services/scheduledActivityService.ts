
import { supabase } from '@/integrations/supabase/client';
import { ScheduledActivity } from '@/types/activity';
import { ActivityMappers, DatabaseScheduledActivity } from './mappers/activityMappers';

export class ScheduledActivityService {
  static async getAll(dogId: string): Promise<ScheduledActivity[]> {
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

  static async create(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
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

  static async update(activity: ScheduledActivity): Promise<ScheduledActivity> {
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

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('scheduled_activities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting scheduled activity:', error);
      throw new Error('Failed to delete scheduled activity');
    }
  }
}
