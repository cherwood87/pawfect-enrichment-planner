
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { BaseSupabaseAdapter } from './BaseSupabaseAdapter';
import { CacheService } from '../network/CacheService';
import { ActivityDataMapper } from './mappers/ActivityDataMapper';

export class ActivitySupabaseAdapter extends BaseSupabaseAdapter {
  static async getScheduledActivities(dogId: string, useCache = true): Promise<ScheduledActivity[]> {
    console.log('📅 Loading scheduled activities with enhanced adapter for dog:', dogId);

    // Check cache first
    if (useCache) {
      const cached = CacheService.getCachedActivities(dogId);
      if (cached) {
        console.log('📋 Returning cached scheduled activities:', cached.length);
        return cached;
      }
    }

    const activities = await this.executeWithRetry(
      async () => {
        console.log('🔍 Querying scheduled activities from Supabase...');
        const { data, error } = await this.getSupabaseClient()
          .from('scheduled_activities')
          .select('*')
          .eq('dog_id', dogId)
          .eq('status', 'scheduled')
          .order('scheduled_date', { ascending: false })
          .limit(100);

        if (error) {
          console.error('❌ Supabase scheduled activities query error:', error);
          throw new Error(`Failed to fetch scheduled activities: ${error.message}`);
        }

        return data || [];
      },
      {
        maxAttempts: 3,
        baseDelay: 800,
        maxDelay: 4000,
        backoffFactor: 2,
        timeout: 8000
      },
      'scheduled_activities_query'
    );

    // Cache successful result
    if (activities.length >= 0) {
      CacheService.cacheActivities(`scheduled_${dogId}`, activities, this.CACHE_DURATION.ACTIVITIES);
    }

    console.log('✅ Enhanced scheduled activities loaded:', activities.length);
    return activities.map(ActivityDataMapper.mapToScheduledActivity);
  }

  static async getUserActivities(dogId: string, useCache = true): Promise<UserActivity[]> {
    console.log('👤 Loading user activities with enhanced adapter for dog:', dogId);

    // Check cache first
    if (useCache) {
      const cached = CacheService.get(`user_activities_${dogId}`);
      if (cached && Array.isArray(cached)) {
        console.log('📋 Returning cached user activities:', cached.length);
        return cached;
      }
    }

    const activities = await this.executeWithRetry(
      async () => {
        console.log('🔍 Querying user activities from Supabase...');
        const { data, error } = await this.getSupabaseClient()
          .from('user_activities')
          .select('*')
          .eq('dog_id', dogId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('❌ Supabase user activities query error:', error);
          throw new Error(`Failed to fetch user activities: ${error.message}`);
        }

        return data || [];
      },
      {
        maxAttempts: 3,
        baseDelay: 800,
        maxDelay: 4000,
        backoffFactor: 2,
        timeout: 8000
      },
      'user_activities_query'
    );

    // Cache successful result  
    if (activities.length >= 0) {
      CacheService.set(`user_activities_${dogId}`, activities.map(ActivityDataMapper.mapToUserActivity), {
        ttl: this.CACHE_DURATION.USER_ACTIVITIES,
        persistent: true
      });
    }

    console.log('✅ Enhanced user activities loaded:', activities.length);
    return activities.map(ActivityDataMapper.mapToUserActivity);
  }

  static async createScheduledActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
    console.log('📅 Creating scheduled activity with enhanced adapter:', {
      dogId: activity.dogId,
      activityId: activity.activityId,
      scheduledDate: activity.scheduledDate
    });

    const result = await this.executeWithRetry(
      async () => {
        const { data, error } = await this.getSupabaseClient().rpc('safe_upsert_scheduled_activity', {
          p_dog_id: activity.dogId,
          p_activity_id: activity.activityId,
          p_scheduled_date: activity.scheduledDate,
          p_week_number: activity.weekNumber || null,
          p_day_of_week: activity.dayOfWeek || null,
          p_notes: activity.notes || '',
          p_completion_notes: activity.completionNotes || '',
          p_reminder_enabled: activity.reminderEnabled || false,
          p_source: 'manual'
        });

        if (error) {
          console.error('❌ Scheduled activity creation error:', error);
          throw new Error(`Failed to create scheduled activity: ${error.message}`);
        }

        return data;
      },
      {
        maxAttempts: 2,
        baseDelay: 1000,
        maxDelay: 3000,
        backoffFactor: 2,
        timeout: 8000
      },
      'scheduled_activity_create'
    );

    // Invalidate cache
    CacheService.delete(`scheduled_${activity.dogId}`);

    // Fetch the created activity
    const { data: createdActivity } = await this.getSupabaseClient()
      .from('scheduled_activities')
      .select('*')
      .eq('id', result)
      .single();

    console.log('✅ Enhanced scheduled activity created:', result);
    return ActivityDataMapper.mapToScheduledActivity(createdActivity);
  }
}
