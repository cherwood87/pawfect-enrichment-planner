
import { supabase } from '@/integrations/supabase/client';
import { RetryService, CircuitBreakerState } from '../network/RetryService';
import { CacheService } from '../network/CacheService';
import { Dog } from '@/types/dog';
import { ScheduledActivity, UserActivity } from '@/types/activity';

export class EnhancedSupabaseAdapter {
  private static readonly CACHE_KEYS = {
    DOGS: 'enhanced_dogs',
    SCHEDULED_ACTIVITIES: 'enhanced_scheduled_activities',
    USER_ACTIVITIES: 'enhanced_user_activities'
  };

  // Enhanced dog loading with retry logic and caching
  static async getDogs(userId: string, useCache = true): Promise<Dog[]> {
    console.log('🐕 Loading dogs with enhanced adapter for user:', userId);

    // Try cache first if enabled
    if (useCache) {
      const cached = CacheService.getCachedDogs(userId);
      if (cached) {
        console.log('📋 Returning cached dogs:', cached.length);
        return cached;
      }
    }

    // Use retry with circuit breaker
    const dogs = await RetryService.executeWithRetry(
      async () => {
        console.log('🔍 Querying dogs from Supabase...');
        const { data, error } = await supabase
          .from('dogs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Supabase dogs query error:', error);
          throw new Error(`Failed to fetch dogs: ${error.message}`);
        }

        return data || [];
      },
      {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 5000,
        backoffFactor: 2,
        timeout: 10000
      },
      'dogs_query'
    );

    // Cache successful result
    if (dogs.length > 0) {
      CacheService.cacheDogs(userId, dogs);
    }

    console.log('✅ Enhanced dogs loaded:', dogs.length);
    return dogs;
  }

  // Enhanced scheduled activities loading
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

    const activities = await RetryService.executeWithRetry(
      async () => {
        console.log('🔍 Querying scheduled activities from Supabase...');
        const { data, error } = await supabase
          .from('scheduled_activities')
          .select('*')
          .eq('dog_id', dogId)
          .eq('status', 'scheduled')
          .order('scheduled_date', { ascending: false })
          .limit(100); // Limit to prevent large queries

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
    if (activities.length >= 0) { // Cache even empty results
      CacheService.cacheActivities(`scheduled_${dogId}`, activities, 10 * 60 * 1000); // 10 min TTL
    }

    console.log('✅ Enhanced scheduled activities loaded:', activities.length);
    return activities.map(this.mapToScheduledActivity);
  }

  // Enhanced user activities loading
  static async getUserActivities(dogId: string, useCache = true): Promise<UserActivity[]> {
    console.log('👤 Loading user activities with enhanced adapter for dog:', dogId);

    // Check cache first
    if (useCache) {
      const cached = CacheService.get(`user_activities_${dogId}`);
      if (cached) {
        console.log('📋 Returning cached user activities:', cached.length);
        return cached;
      }
    }

    const activities = await RetryService.executeWithRetry(
      async () => {
        console.log('🔍 Querying user activities from Supabase...');
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('dog_id', dogId)
          .order('created_at', { ascending: false })
          .limit(50); // Limit to prevent large queries

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
    if (activities.length >= 0) { // Cache even empty results
      CacheService.set(`user_activities_${dogId}`, activities, {
        ttl: 8 * 60 * 1000, // 8 min TTL
        persistent: true
      });
    }

    console.log('✅ Enhanced user activities loaded:', activities.length);
    return activities.map(this.mapToUserActivity);
  }

  // Create operations with retry logic
  static async createDog(dogData: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Dog> {
    console.log('➕ Creating dog with enhanced adapter:', dogData.name);

    const dog = await RetryService.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('dogs')
          .insert([{
            ...dogData,
            date_added: new Date().toISOString(),
            last_updated: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
          console.error('❌ Dog creation error:', error);
          throw new Error(`Failed to create dog: ${error.message}`);
        }

        return data;
      },
      {
        maxAttempts: 2,
        baseDelay: 1000,
        maxDelay: 3000,
        backoffFactor: 2,
        timeout: 10000
      },
      'dog_create'
    );

    // Invalidate dogs cache for this user
    if (dogData.userId) {
      CacheService.delete(`dogs_${dogData.userId}`);
    }

    console.log('✅ Enhanced dog created:', dog.id);
    return this.mapToDog(dog);
  }

  // Enhanced scheduled activity creation with safe upsert
  static async createScheduledActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
    console.log('📅 Creating scheduled activity with enhanced adapter:', {
      dogId: activity.dogId,
      activityId: activity.activityId,
      scheduledDate: activity.scheduledDate
    });

    const result = await RetryService.executeWithRetry(
      async () => {
        const { data, error } = await supabase.rpc('safe_upsert_scheduled_activity', {
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
    const { data: createdActivity } = await supabase
      .from('scheduled_activities')
      .select('*')
      .eq('id', result)
      .single();

    console.log('✅ Enhanced scheduled activity created:', result);
    return this.mapToScheduledActivity(createdActivity);
  }

  // Utility method to check circuit breaker states
  static getNetworkHealth(): {
    dogs: CircuitBreakerState | null;
    scheduledActivities: CircuitBreakerState | null;
    userActivities: CircuitBreakerState | null;
  } {
    return {
      dogs: RetryService.getCircuitBreakerState('dogs_query'),
      scheduledActivities: RetryService.getCircuitBreakerState('scheduled_activities_query'),
      userActivities: RetryService.getCircuitBreakerState('user_activities_query')
    };
  }

  // Clear all caches
  static clearCache(): void {
    CacheService.clear();
    console.log('🧹 Enhanced adapter cache cleared');
  }

  // Mapping functions
  private static mapToDog(dbDog: any): Dog {
    return {
      id: dbDog.id,
      name: dbDog.name,
      breed: dbDog.breed,
      age: dbDog.age,
      weight: dbDog.weight,
      activityLevel: dbDog.activity_level,
      specialNeeds: dbDog.special_needs || '',
      notes: dbDog.notes || '',
      image: dbDog.image,
      userId: dbDog.user_id,
      dateAdded: dbDog.date_added || dbDog.created_at,
      lastUpdated: dbDog.last_updated || dbDog.updated_at,
      gender: dbDog.gender,
      breedGroup: dbDog.breed_group,
      mobilityIssues: dbDog.mobility_issues || [],
      quizResults: dbDog.quiz_results
    };
  }

  private static mapToScheduledActivity(dbActivity: any): ScheduledActivity {
    return {
      id: dbActivity.id,
      dogId: dbActivity.dog_id,
      activityId: dbActivity.activity_id,
      scheduledDate: dbActivity.scheduled_date,
      completed: dbActivity.completed,
      notes: dbActivity.notes || '',
      completionNotes: dbActivity.completion_notes || '',
      reminderEnabled: dbActivity.reminder_enabled || false,
      weekNumber: dbActivity.week_number,
      dayOfWeek: dbActivity.day_of_week
    };
  }

  private static mapToUserActivity(dbActivity: any): UserActivity {
    return {
      id: dbActivity.id,
      dogId: dbActivity.dog_id,
      title: dbActivity.title,
      pillar: dbActivity.pillar,
      difficulty: dbActivity.difficulty,
      duration: dbActivity.duration,
      materials: dbActivity.materials || [],
      emotionalGoals: dbActivity.emotional_goals || [],
      instructions: dbActivity.instructions || [],
      benefits: dbActivity.benefits || '',
      tags: dbActivity.tags || [],
      ageGroup: dbActivity.age_group,
      energyLevel: dbActivity.energy_level,
      isCustom: dbActivity.is_custom,
      createdAt: dbActivity.created_at
    };
  }
}
