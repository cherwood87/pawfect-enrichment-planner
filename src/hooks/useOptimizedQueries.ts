
import { useState, useEffect, useCallback } from 'react';
import { OptimizedQueryService } from '@/services/data/OptimizedQueryService';
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';

interface DashboardData {
  dog: Dog | null;
  scheduledActivities: ScheduledActivity[];
  userActivities: UserActivity[];
  recentCompletions: any[];
}

export const useOptimizedQueries = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryService = OptimizedQueryService.getInstance();

  const fetchDashboardData = useCallback(async (dogId: string): Promise<DashboardData | null> => {
    if (!dogId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await queryService.getDashboardData(dogId, { useCache: true });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('Dashboard data fetch error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [queryService]);

  const fetchWeeklyPlannerData = useCallback(async (
    dogId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<ScheduledActivity[]> => {
    if (!dogId) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await queryService.getWeeklyPlannerData(dogId, startDate, endDate, { useCache: true });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weekly planner data';
      setError(errorMessage);
      console.error('Weekly planner data fetch error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [queryService]);

  const fetchActivityLibrary = useCallback(async (options: {
    pillar?: string;
    difficulty?: string;
    searchTerm?: string;
    limit?: number;
    offset?: number;
  } = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await queryService.getActivityLibrary(options);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activity library';
      setError(errorMessage);
      console.error('Activity library fetch error:', err);
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [queryService]);

  const createActivitiesBatch = useCallback(async (
    activities: Omit<ScheduledActivity, 'id' | 'created_at' | 'updated_at'>[]
  ): Promise<ScheduledActivity[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await queryService.createScheduledActivitiesBatch(activities);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create activities';
      setError(errorMessage);
      console.error('Batch create error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [queryService]);

  const clearDogCache = useCallback((dogId: string) => {
    queryService.clearDogCache(dogId);
  }, [queryService]);

  const getPerformanceMetrics = useCallback(() => {
    return queryService.getPerformanceMetrics();
  }, [queryService]);

  return {
    loading,
    error,
    fetchDashboardData,
    fetchWeeklyPlannerData,
    fetchActivityLibrary,
    createActivitiesBatch,
    clearDogCache,
    getPerformanceMetrics
  };
};
