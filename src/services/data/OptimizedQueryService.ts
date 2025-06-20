
import { supabase } from '@/integrations/supabase/client';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { CacheService } from '../network/CacheService';
import { RetryService } from '../network/RetryService';

export interface QueryOptions {
  useCache?: boolean;
  timeout?: number;
  batchSize?: number;
  priority?: 'low' | 'normal' | 'high';
}

class OptimizedQueryService {
  private static instance: OptimizedQueryService;
  private cache: CacheService;
  private retryService: RetryService;
  
  private constructor() {
    this.cache = CacheService.getInstance();
    this.retryService = RetryService.getInstance();
  }

  static getInstance(): OptimizedQueryService {
    if (!OptimizedQueryService.instance) {
      OptimizedQueryService.instance = new OptimizedQueryService();
    }
    return OptimizedQueryService.instance;
  }

  // Optimized batch query for dashboard data
  async getDashboardData(dogId: string, options: QueryOptions = {}): Promise<{
    dog: Dog | null;
    scheduledActivities: ScheduledActivity[];
    userActivities: UserActivity[];
    recentCompletions: any[];
  }> {
    const cacheKey = `dashboard_${dogId}`;
    
    if (options.useCache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log('📊 Using cached dashboard data');
        return cached;
      }
    }

    try {
      console.log('🔍 Fetching optimized dashboard data for:', dogId);
      
      // Use Promise.allSettled for parallel queries with error tolerance
      const [dogResult, scheduledResult, userActivitiesResult, completionsResult] = await Promise.allSettled([
        this.retryService.executeWithRetry(
          () => supabase.from('dogs').select('*').eq('id', dogId).single(),
          'dogs_query'
        ),
        this.retryService.executeWithRetry(
          () => supabase
            .from('scheduled_activities')
            .select('*')
            .eq('dog_id', dogId)
            .eq('status', 'scheduled')
            .order('scheduled_date', { ascending: true })
            .limit(50),
          'scheduled_activities_query'
        ),
        this.retryService.executeWithRetry(
          () => supabase
            .from('user_activities')
            .select('*')
            .eq('dog_id', dogId)
            .order('created_at', { ascending: false })
            .limit(20),
          'user_activities_query'
        ),
        this.retryService.executeWithRetry(
          () => supabase
            .from('activity_completions')
            .select('*')
            .eq('dog_id', dogId)
            .order('completion_time', { ascending: false })
            .limit(10),
          'activity_completions_query'
        )
      ]);

      const result = {
        dog: dogResult.status === 'fulfilled' ? dogResult.value.data : null,
        scheduledActivities: scheduledResult.status === 'fulfilled' ? (scheduledResult.value.data || []) : [],
        userActivities: userActivitiesResult.status === 'fulfilled' ? (userActivitiesResult.value.data || []) : [],
        recentCompletions: completionsResult.status === 'fulfilled' ? (completionsResult.value.data || []) : []
      };

      // Cache for 5 minutes
      this.cache.set(cacheKey, result, 5 * 60 * 1000);
      
      console.log('✅ Dashboard data fetched successfully');
      return result;
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  // Optimized query for weekly planner
  async getWeeklyPlannerData(dogId: string, startDate: Date, endDate: Date, options: QueryOptions = {}): Promise<ScheduledActivity[]> {
    const cacheKey = `weekly_${dogId}_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
    
    if (options.useCache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log('📅 Using cached weekly planner data');
        return cached;
      }
    }

    try {
      console.log('🔍 Fetching weekly planner data for:', dogId, startDate, endDate);
      
      const { data, error } = await this.retryService.executeWithRetry(
        () => supabase
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
          .order('scheduled_date', { ascending: true }),
        'weekly_planner_query'
      );

      if (error) {
        throw error;
      }

      const activities = data || [];
      
      // Cache for 2 minutes (shorter for planner data)
      this.cache.set(cacheKey, activities, 2 * 60 * 1000);
      
      console.log('✅ Weekly planner data fetched:', activities.length, 'activities');
      return activities;
    } catch (error) {
      console.error('❌ Failed to fetch weekly planner data:', error);
      throw error;
    }
  }

  // Optimized batch activity creation
  async createScheduledActivitiesBatch(activities: Omit<ScheduledActivity, 'id' | 'created_at' | 'updated_at'>[]): Promise<ScheduledActivity[]> {
    try {
      console.log('💾 Creating scheduled activities batch:', activities.length, 'activities');
      
      // Use batch insert for better performance
      const { data, error } = await this.retryService.executeWithRetry(
        () => supabase
          .from('scheduled_activities')
          .insert(activities)
          .select(),
        'batch_create_activities'
      );

      if (error) {
        throw error;
      }

      // Invalidate related cache entries
      const dogIds = [...new Set(activities.map(a => a.dogId))];
      dogIds.forEach(dogId => {
        this.cache.invalidatePattern(`dashboard_${dogId}`);
        this.cache.invalidatePattern(`weekly_${dogId}`);
      });

      console.log('✅ Batch activities created successfully:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Failed to create activities batch:', error);
      throw error;
    }
  }

  // Optimized activity library query with pagination
  async getActivityLibrary(options: {
    pillar?: string;
    difficulty?: string;
    searchTerm?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data: any[]; total: number }> {
    const { pillar, difficulty, searchTerm, limit = 20, offset = 0 } = options;
    const cacheKey = `library_${pillar || 'all'}_${difficulty || 'all'}_${searchTerm || 'none'}_${limit}_${offset}`;
    
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('📚 Using cached activity library data');
      return cached;
    }

    try {
      console.log('🔍 Fetching activity library with filters:', options);
      
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

      const { data, error, count } = await this.retryService.executeWithRetry(
        () => query,
        'activity_library_query'
      );

      if (error) {
        throw error;
      }

      const result = {
        data: data || [],
        total: count || 0
      };

      // Cache for 10 minutes (library data doesn't change often)
      this.cache.set(cacheKey, result, 10 * 60 * 1000);
      
      console.log('✅ Activity library fetched:', result.data.length, 'activities, total:', result.total);
      return result;
    } catch (error) {
      console.error('❌ Failed to fetch activity library:', error);
      throw error;
    }
  }

  // Clear cache for specific dog
  clearDogCache(dogId: string) {
    this.cache.invalidatePattern(`dashboard_${dogId}`);
    this.cache.invalidatePattern(`weekly_${dogId}`);
    console.log('🧹 Cleared cache for dog:', dogId);
  }

  // Get query performance metrics
  getPerformanceMetrics() {
    return {
      cacheStats: this.cache.getCacheStats(),
      circuitBreakerStats: {
        dogs: this.retryService.getStats('dogs_query'),
        scheduledActivities: this.retryService.getStats('scheduled_activities_query'),
        userActivities: this.retryService.getStats('user_activities_query'),
        library: this.retryService.getStats('activity_library_query')
      }
    };
  }
}

export { OptimizedQueryService };
