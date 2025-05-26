import { supabase } from '@/integrations/supabase/client';
import { ScheduledActivity, UserActivity } from '@/types/activity';

export interface DatabaseScheduledActivity {
  id: string;
  dog_id: string;
  activity_id: string;
  scheduled_time: string;
  user_selected_time: string;
  scheduled_date: string;
  completed: boolean;
  notes: string;
  completion_notes: string;
  reminder_enabled: boolean;
  completed_at: string;
  created_at: string;
  updated_at: string;
  week_number: number | null;
  day_of_week: number | null;
}

export interface DatabaseUserActivity {
  id: string;
  dog_id: string;
  title: string;
  pillar: 'mental' | 'physical' | 'social' | 'environmental' | 'instinctual';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  materials: string[];
  emotional_goals: string[];
  instructions: string[];
  benefits: string;
  tags: string[];
  age_group: 'Puppy' | 'Adult' | 'Senior' | 'All Ages';
  energy_level: 'Low' | 'Medium' | 'High';
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export class ActivityService {
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

    return data.map(this.mapToScheduledActivity);
  }

  static async createScheduledActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
    const { data, error } = await supabase
      .from('scheduled_activities')
      .insert({
        dog_id: activity.dogId,
        activity_id: activity.activityId,
        scheduled_time: activity.scheduledTime,
        user_selected_time: activity.userSelectedTime || activity.scheduledTime,
        scheduled_date: activity.scheduledDate,
        completed: activity.completed,
        notes: activity.notes || '',
        completion_notes: activity.completionNotes || '',
        reminder_enabled: activity.reminderEnabled || false,
        completed_at: activity.completedAt,
        week_number: activity.weekNumber || null,
        day_of_week: activity.dayOfWeek !== undefined ? activity.dayOfWeek : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating scheduled activity:', error);
      throw new Error('Failed to create scheduled activity');
    }

    return this.mapToScheduledActivity(data);
  }

  static async updateScheduledActivity(activity: ScheduledActivity): Promise<ScheduledActivity> {
    const { data, error } = await supabase
      .from('scheduled_activities')
      .update({
        activity_id: activity.activityId,
        scheduled_time: activity.scheduledTime,
        user_selected_time: activity.userSelectedTime || activity.scheduledTime,
        scheduled_date: activity.scheduledDate,
        completed: activity.completed,
        notes: activity.notes || '',
        completion_notes: activity.completionNotes || '',
        reminder_enabled: activity.reminderEnabled || false,
        completed_at: activity.completedAt,
        week_number: activity.weekNumber || null,
        day_of_week: activity.dayOfWeek !== undefined ? activity.dayOfWeek : null
      })
      .eq('id', activity.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating scheduled activity:', error);
      throw new Error('Failed to update scheduled activity');
    }

    return this.mapToScheduledActivity(data);
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

  // User Activities (Custom Activities)
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

    return data.map(this.mapToUserActivity);
  }

  static async createUserActivity(activity: Omit<UserActivity, 'id' | 'createdAt'>): Promise<UserActivity> {
    const { data, error } = await supabase
      .from('user_activities')
      .insert({
        dog_id: activity.dogId,
        title: activity.title,
        pillar: activity.pillar,
        difficulty: activity.difficulty,
        duration: activity.duration,
        materials: activity.materials,
        emotional_goals: activity.emotionalGoals,
        instructions: activity.instructions,
        benefits: activity.benefits,
        tags: activity.tags,
        age_group: activity.ageGroup,
        energy_level: activity.energyLevel,
        is_custom: activity.isCustom
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user activity:', error);
      throw new Error('Failed to create user activity');
    }

    return this.mapToUserActivity(data);
  }

  private static mapToScheduledActivity(dbActivity: DatabaseScheduledActivity): ScheduledActivity {
    return {
      id: dbActivity.id,
      dogId: dbActivity.dog_id,
      activityId: dbActivity.activity_id,
      scheduledTime: dbActivity.scheduled_time,
      userSelectedTime: dbActivity.user_selected_time,
      scheduledDate: dbActivity.scheduled_date,
      completed: dbActivity.completed,
      notes: dbActivity.notes,
      completionNotes: dbActivity.completion_notes,
      reminderEnabled: dbActivity.reminder_enabled,
      completedAt: dbActivity.completed_at,
      weekNumber: dbActivity.week_number,
      dayOfWeek: dbActivity.day_of_week
    };
  }

  private static mapToUserActivity(dbActivity: DatabaseUserActivity): UserActivity {
    return {
      id: dbActivity.id,
      dogId: dbActivity.dog_id,
      title: dbActivity.title,
      pillar: dbActivity.pillar,
      difficulty: dbActivity.difficulty,
      duration: dbActivity.duration,
      materials: dbActivity.materials,
      emotionalGoals: dbActivity.emotional_goals,
      instructions: dbActivity.instructions,
      benefits: dbActivity.benefits,
      tags: dbActivity.tags,
      ageGroup: dbActivity.age_group,
      energyLevel: dbActivity.energy_level,
      isCustom: dbActivity.is_custom,
      createdAt: dbActivity.created_at
    };
  }

  // Migration helpers
  static async migrateScheduledActivitiesFromLocalStorage(dogId: string): Promise<void> {
    try {
      const localActivities = localStorage.getItem(`scheduledActivities-${dogId}`);
      if (!localActivities) return;

      const activities: ScheduledActivity[] = JSON.parse(localActivities);
      console.log(`Migrating ${activities.length} scheduled activities for dog ${dogId}...`);

      for (const activity of activities) {
        try {
          await this.createScheduledActivity(activity);
        } catch (error) {
          console.error(`Failed to migrate scheduled activity:`, error);
        }
      }

      console.log('Scheduled activities migration completed');
    } catch (error) {
      console.error('Error during scheduled activities migration:', error);
    }
  }

  static async migrateUserActivitiesFromLocalStorage(dogId: string): Promise<void> {
    try {
      const localActivities = localStorage.getItem(`userActivities-${dogId}`);
      if (!localActivities) return;

      const activities: UserActivity[] = JSON.parse(localActivities);
      console.log(`Migrating ${activities.length} user activities for dog ${dogId}...`);

      for (const activity of activities) {
        try {
          await this.createUserActivity(activity);
        } catch (error) {
          console.error(`Failed to migrate user activity:`, error);
        }
      }

      console.log('User activities migration completed');
    } catch (error) {
      console.error('Error during user activities migration:', error);
    }
  }
}
