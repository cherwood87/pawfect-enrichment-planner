import { supabase } from '@/integrations/supabase/client';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { CacheService } from '../network/CacheService';
import { RetryService } from '../network/RetryService';
import { DogDataMapper } from '../integration/mappers/DogDataMapper';
import { ActivityDataMapper } from '../integration/mappers/ActivityDataMapper';

export interface QueryOptions {
  useCache?: boolean;
  timeout?: number;
  batchSize?: number;
  priority?: 'low' | 'normal' | 'high';
}

interface DashboardData {
  dog: Dog | null;
  scheduledActivities: ScheduledActivity[];
  userActivities: UserActivity[];
  recentCompletions: any[];
}

class OptimizedQueryService {
  private static instance: OptimizedQueryService;
  
  private constructor() {}

  static getInstance(): OptimizedQueryService {
    if (!OptimizedQueryService.instance) {
      OptimizedQueryService.instance = new OptimizedQueryService();
    }
    return OptimizedQueryService.instance;
  }

  // Optimized batch query for dashboard data
  async getDashboardData(dogId: string, options: QueryOptions = {}): Promise<DashboardData> {
    const cacheKey = `dashboard_${dogId}`;
    
    if (options.useCache !== false) {
      const cached = CacheService.get<DashboardData>(cacheKey);
      if (cached && this.isValidDashboardData(cached)) {
        console.log('📊 Using cached dashboard data');
        return cached;
      }
    }

    // Initialize default response structure
    const defaultResponse: DashboardData = {
      dog: null,
      scheduledActivities: [],
      userActivities: [],
      recentCompletions: []
    };

    try {
      console.log('🔍 Fetching optimized dashboard data for:', dogId);
      
      // Use Promise.allSettled for parallel queries with error tolerance
      const [dogResult, scheduledResult, userActivitiesResult, completionsResult] = await Promise.allSettled([
        RetryService.executeWithRetry(
          async () => {
            const { data, error } = await supabase.from('dogs').select('*').eq('id', dogId).single();
            if (error) throw error;
            return data;
          },
          { maxAttempts: 3, baseDelay: 1000, maxDelay: 5000, backoffFactor: 2 },
          'dogs_query'
        ),
        RetryService.executeWithRetry(
          async () => {
            const { data, error } = await supabase
              .from('scheduled_activities')
              .select('*')
              .eq('dog_id', dogId)
              .eq('status', 'scheduled')
              .order('scheduled_date', { ascending: true })
              .limit(50);
            if (error) throw error;
            return data || [];
          },
          { maxAttempts: 3, baseDelay: 1000, maxDelay: 5000, backoffFactor: 2 },
          'scheduled_activities_query'
        ),
        RetryService.executeWithRetry(
          async () => {
            const { data, error } = await supabase
              .from('user_activities')
              .select('*')
              .eq('dog_id', dogId)
              .order('created_at', { ascending: false })
              .limit(20);
            if (error) throw error;
            return data || [];
          },
          { maxAttempts: 3, baseDelay: 1000, maxDelay: 5000, backoffFactor: 2 },
          'user_activities_query'
        ),
        RetryService.executeWithRetry(
          async () => {
            const { data, error } = await supabase
              .from('activity_completions')
              .select('*')
              .eq('dog_id', dogId)
              .order('completion_time', { ascending: false })
              .limit(10);
            if (error) throw error;
            return data || [];
          },
          { maxAttempts: 3, baseDelay: 1000, maxDelay: 5000, backoffFactor: 2 },
          'activity_completions_query'
        )
      ]);

      const result: DashboardData = {
        dog: dogResult.status === 'fulfilled' && dogResult.value ? DogDataMapper.mapToDog(dogResult.value) : null,
        scheduledActivities: scheduledResult.status === 'fulfilled' && scheduledResult.value ? 
          scheduledResult.value.map(ActivityDataMapper.mapToScheduledActivity) : [],
        userActivities: userActivitiesResult.status === 'fulfilled' && userActivitiesResult.value ? 
          userActivitiesResult.value.map(ActivityDataMapper.mapToUserActivity) : [],
        recentCompletions: completionsResult.status === 'fulfilled' && completionsResult.value ? 
          completionsResult.value : []
      };

      // Cache for 5 minutes
      CacheService.set(cacheKey, result, { ttl: 5 * 60 * 1000 });
      
      console.log('✅ Dashboard data fetched successfully');
      return result;
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      return defaultResponse;
    }
  }

  // Optimized query for weekly planner
  async getWeeklyPlannerData(dogId: string, startDate: Date, endDate: Date, options: QueryOptions = {}): Promise<ScheduledActivity[]> {
    const cacheKey = `weekly_${dogId}_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
    
    if (options.useCache !== false) {
      const cached = CacheService.get<ScheduledActivity[]>(cacheKey);
      if (cached && Array.isArray(cached)) {
        console.log('📅 Using cached weekly planner data');
        return cached;
      }
    }

    try {
      console.log('🔍 Fetching weekly planner data for:', dogId, startDate, endDate);
      
      const result = await RetryService.executeWithRetry(
        async () => {
          const { data, error } = await supabase
            .from('scheduled_activities')
            .select(`
              id,
              activity_id,
              dog_id,
              scheduled_date,
              week_number,
              day_of_week,
              completed,
              status,
              notes,
              completion_notes,
              created_at,
              updated_at
            `)
            .eq('dog_id', dogId)
            .gte('scheduled_date', startDate.toISOString().split('T')[0])
            .lte('scheduled_date', endDate.toISOString().split('T')[0])
            .in('status', ['scheduled', 'completed'])
            .order('scheduled_date', { ascending: true });

          if (error) throw error;
          return data || [];
        },
        { maxAttempts: 3, baseDelay: 1000, maxDelay: 5000, backoffFactor: 2 },
        'weekly_planner_query'
      );

      const activities = result.map(ActivityDataMapper.mapToScheduledActivity);
      
      // Cache for 2 minutes (shorter for planner data)
      CacheService.set(cacheKey, activities, { ttl: 2 * 60 * 1000 });
      
      console.log('✅ Weekly planner data fetched:', activities.length, 'activities');
      return activities;
    } catch (error) {
      console.error('❌ Failed to fetch weekly planner data:', error);
      return [];
    }
  }

  // Optimized batch activity creation
  async createScheduledActivitiesBatch(activities: Omit<ScheduledActivity, 'id' | 'created_at' | 'updated_at'>[]): Promise<ScheduledActivity[]> {
    try {
      console.log('💾 Creating scheduled activities batch:', activities.length, 'activities');
      
      // Transform the activities to match the database schema (camelCase to snake_case)
      const transformedActivities = activities.map(activity => ({
        activity_id: activity.activityId,
        dog_id: activity.dogId,
        scheduled_date: activity.scheduledDate,
        week_number: activity.weekNumber,
        day_of_week: activity.dayOfWeek,
        completed: activity.completed || false,
        status: activity.status || 'scheduled',
        notes: activity.notes || '',
        completion_notes: activity.completionNotes || '',
        reminder_enabled: activity.reminderEnabled || false,
        source: activity.source || 'manual'
      }));
      
      // Use batch insert for better performance
      const result = await RetryService.executeWithRetry(
        async () => {
          const { data, error } = await supabase
            .from('scheduled_activities')
            .insert(transformedActivities)
            .select();
          if (error) throw error;
          return data || [];
        },
        { maxAttempts: 3, baseDelay: 1000, maxDelay: 5000, backoffFactor: 2 },
        'batch_create_activities'
      );

      // Clear related cache entries
      const dogIds = [...new Set(activities.map(a => a.dogId))];
      dogIds.forEach(dogId => {
        this.clearDogCache(dogId);
      });

      const createdActivities = result.map(ActivityDataMapper.mapToScheduledActivity);
      console.log('✅ Batch activities created successfully:', createdActivities.length);
      return createdActivities;
    } catch (error) {
      console.error('❌ Failed to create activities batch:', error);
      return [];
    }
  }

  // Optimized activity library query with pagination
  async getActivityLibrary(options: {
    pillar?: string;
    difficulty?: string;
    searchTerm?: string;
    limit?: number;
    offset?: number;
  } & QueryOptions = {}): Promise<{ data: any[]; total: number }> {
    const { pillar, difficulty, searchTerm, limit = 20, offset = 0 } = options;
    const cacheKey = `library_${pillar || 'all'}_${difficulty || 'all'}_${searchTerm || 'none'}_${limit}_${offset}`;
    
    if (options.useCache !== false) {
      const cached = CacheService.get<{ data: any[]; total: number }>(cacheKey);
      if (cached && this.isValidLibraryData(cached)) {
        console.log('📚 Using cached activity library data');
        return cached;
      }
    }

    // Initialize default response
    const defaultResponse = { data: [], total: 0 };

    try {
      console.log('🔍 Fetching activity library with filters:', options);
      
      const result = await RetryService.executeWithRetry(
        async () => {
          let query = supabase
            .from('activities')
            .select('*', { count: 'exact' })
            .eq('approved', true)
            .order('title', { ascending: true })
            .range(offset, offset + limit - 1);

          if (pillar) {
            query = query.eq('pillar', pillar);
          }

          if (difficulty) {
            query = query.eq('difficulty', difficulty);
          }

          if (searchTerm) {
            query = query.or(`title.ilike.%${searchTerm}%,benefits.ilike.%${searchTerm}%`);
          }

          const { data, error, count } = await query;
          if (error) throw error;
          return { data: data || [], count: count || 0 };
        },
        { maxAttempts: 3, baseDelay: 1000, maxDelay: 5000, backoffFactor: 2 },
        'activity_library_query'
      );

      const libraryResult = {
        data: result.data,
        total: result.count
      };

      // Cache for 10 minutes (library data doesn't change often)
      CacheService.set(cacheKey, libraryResult, { ttl: 10 * 60 * 1000 });
      
      console.log('✅ Activity library fetched:', libraryResult.data.length, 'activities, total:', libraryResult.total);
      return libraryResult;
    } catch (error) {
      console.error('❌ Failed to fetch activity library:', error);
      return defaultResponse;
    }
  }

  // Helper methods for validation
  private isValidDashboardData(data: any): data is DashboardData {
    return data && 
           typeof data === 'object' &&
           'dog' in data &&
           'scheduledActivities' in data &&
           'userActivities' in data &&
           'recentCompletions' in data &&
           Array.isArray(data.scheduledActivities) &&
           Array.isArray(data.userActivities) &&
           Array.isArray(data.recentCompletions);
  }

  private isValidLibraryData(data: any): data is { data: any[]; total: number } {
    return data && 
           typeof data === 'object' &&
           'data' in data &&
           'total' in data &&
           Array.isArray(data.data) &&
           typeof data.total === 'number';
  }

  // Clear cache for specific dog
  clearDogCache(dogId: string) {
    // Clear dashboard cache
    CacheService.delete(`dashboard_${dogId}`);
    
    // Clear weekly cache entries (we'll need to implement a pattern-based clear or track keys)
    const stats = CacheService.getCacheStats();
    stats.memoryKeys.forEach(key => {
      if (key.startsWith(`weekly_${dogId}`)) {
        CacheService.delete(key);
      }
    });
    
    console.log('🧹 Cleared cache for dog:', dogId);
  }

  // Get query performance metrics
  getPerformanceMetrics() {
    return {
      cacheStats: CacheService.getCacheStats(),
      circuitBreakerStats: {
        dogs: RetryService.getCircuitBreakerState('dogs_query'),
        scheduledActivities: RetryService.getCircuitBreakerState('scheduled_activities_query'),
        userActivities: RetryService.getCircuitBreakerState('user_activities_query'),
        library: RetryService.getCircuitBreakerState('activity_library_query')
      }
    };
  }
}

export { OptimizedQueryService };
