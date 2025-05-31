import { ScheduledActivity, UserActivity, ActivityLibraryItem, StreakData, WeeklyProgress, PillarGoals } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { ActivityRepository } from '../data/ActivityRepository';
import { getActivityById } from '@/data/activityLibrary';
import { AppError, handleError } from '@/utils/errorUtils';

export class ActivityDomainService {
  // Business logic for activity operations with enhanced error handling
  static async getScheduledActivitiesForDog(dogId: string): Promise<ScheduledActivity[]> {
    try {
      if (!dogId?.trim()) {
        throw new AppError('Dog ID is required', 'INVALID_DOG_ID');
      }
      
      return await ActivityRepository.getScheduledActivities(dogId);
    } catch (error) {
      handleError(error as Error, { operation: 'getScheduledActivitiesForDog', dogId });
      throw error;
    }
  }

  static async createScheduledActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
    try {
      // Enhanced validation
      this.validateScheduledActivityData(activity);
      
      // Check for duplicates
      await this.checkForDuplicateActivity(activity);
      
      const newActivity: ScheduledActivity = {
        ...activity,
        id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        notes: activity.notes || '',
        completionNotes: activity.completionNotes || '',
        reminderEnabled: activity.reminderEnabled ?? false,
      };

      return await ActivityRepository.createScheduledActivity(newActivity);
    } catch (error) {
      handleError(error as Error, { operation: 'createScheduledActivity', activity });
      throw error;
    }
  }

  static async toggleActivityCompletion(
    activityId: string, 
    dogId: string, 
    completionNotes?: string
  ): Promise<ScheduledActivity> {
    try {
      if (!activityId?.trim() || !dogId?.trim()) {
        throw new AppError('Activity ID and Dog ID are required', 'MISSING_REQUIRED_FIELDS');
      }

      const activities = await ActivityRepository.getScheduledActivities(dogId);
      const activity = activities.find(a => a.id === activityId);
      
      if (!activity) {
        throw new AppError('Activity not found', 'ACTIVITY_NOT_FOUND', { activityId, dogId });
      }

      const updatedActivity: ScheduledActivity = {
        ...activity,
        completed: !activity.completed,
        completedAt: !activity.completed ? new Date().toISOString() : undefined,
        completionNotes: !activity.completed ? (completionNotes || '') : activity.completionNotes,
      };

      return await ActivityRepository.updateScheduledActivity(updatedActivity);
    } catch (error) {
      handleError(error as Error, { operation: 'toggleActivityCompletion', activityId, dogId });
      throw error;
    }
  }

  static async updateScheduledActivity(
    activityId: string, 
    dogId: string, 
    updates: Partial<ScheduledActivity>
  ): Promise<ScheduledActivity> {
    try {
      if (!activityId?.trim() || !dogId?.trim()) {
        throw new AppError('Activity ID and Dog ID are required', 'MISSING_REQUIRED_FIELDS');
      }

      const activities = await ActivityRepository.getScheduledActivities(dogId);
      const activity = activities.find(a => a.id === activityId);
      
      if (!activity) {
        throw new AppError('Activity not found', 'ACTIVITY_NOT_FOUND', { activityId, dogId });
      }

      // Validate updates
      if (updates.scheduledDate) {
        this.validateScheduledDate(updates.scheduledDate);
      }

      const updatedActivity = { ...activity, ...updates };
      return await ActivityRepository.updateScheduledActivity(updatedActivity);
    } catch (error) {
      handleError(error as Error, { operation: 'updateScheduledActivity', activityId, dogId, updates });
      throw error;
    }
  }

  static async createUserActivity(activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>, dogId: string): Promise<UserActivity> {
    try {
      if (!dogId?.trim()) {
        throw new AppError('Dog ID is required', 'INVALID_DOG_ID');
      }

      this.validateUserActivityData(activity);

      const newActivity: UserActivity = {
        ...activity,
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        dogId,
        createdAt: new Date().toISOString(),
      };

      return await ActivityRepository.createUserActivity(newActivity);
    } catch (error) {
      handleError(error as Error, { operation: 'createUserActivity', activity, dogId });
      throw error;
    }
  }

  // Validation methods
  private static validateScheduledActivityData(activity: Omit<ScheduledActivity, 'id'>): void {
    if (!activity.activityId?.trim()) {
      throw new AppError('Activity ID is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.dogId?.trim()) {
      throw new AppError('Dog ID is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.scheduledDate) {
      throw new AppError('Scheduled date is required', 'VALIDATION_ERROR');
    }

    this.validateScheduledDate(activity.scheduledDate);
  }

  private static validateScheduledDate(scheduledDate: string): void {
    const date = new Date(scheduledDate);
    if (isNaN(date.getTime())) {
      throw new AppError('Invalid scheduled date format', 'VALIDATION_ERROR');
    }

    // Don't allow scheduling too far in the past
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date < yesterday) {
      throw new AppError('Cannot schedule activities for past dates', 'VALIDATION_ERROR');
    }
  }

  private static validateUserActivityData(activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>): void {
    if (!activity.title?.trim()) {
      throw new AppError('Activity title is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.pillar) {
      throw new AppError('Activity pillar is required', 'VALIDATION_ERROR');
    }
    
    if (!activity.duration || activity.duration <= 0) {
      throw new AppError('Valid duration is required', 'VALIDATION_ERROR');
    }
  }

  private static async checkForDuplicateActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<void> {
    try {
      const existingActivities = await ActivityRepository.getScheduledActivities(activity.dogId);
      const duplicate = existingActivities.find(existing => 
        existing.activityId === activity.activityId &&
        existing.scheduledDate === activity.scheduledDate &&
        existing.dogId === activity.dogId
      );

      if (duplicate) {
        throw new AppError(
          'This activity is already scheduled for this date', 
          'DUPLICATE_ACTIVITY',
          { existingActivityId: duplicate.id }
        );
      }
    } catch (error) {
      if (error instanceof AppError && error.code === 'DUPLICATE_ACTIVITY') {
        throw error;
      }
      // If we can't check for duplicates, log but don't block the operation
      console.warn('Could not check for duplicate activities:', error);
    }
  }

  // Business logic for analytics and calculations
  static getTodaysActivities(
    scheduledActivities: ScheduledActivity[], 
    currentDog: Dog | null
  ): ScheduledActivity[] {
    if (!currentDog) return [];
    
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const currentWeek = this.getISOWeek(today);
    
    return scheduledActivities.filter(activity => 
      activity.dogId === currentDog.id &&
      activity.dayOfWeek === currentDayOfWeek &&
      activity.weekNumber === currentWeek
    );
  }

  static getActivityDetails(
    activityId: string,
    userActivities: UserActivity[],
    discoveredActivities: DiscoveredActivity[],
    currentDog: Dog | null
  ): ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined {
    // First check library activities
    const libraryActivity = getActivityById(activityId);
    if (libraryActivity) return libraryActivity;
    
    // Then check user activities for current dog
    const userActivity = userActivities.find(activity => 
      activity.id === activityId && activity.dogId === currentDog?.id
    );
    if (userActivity) return userActivity;

    // Finally check discovered activities
    return discoveredActivities.find(activity => activity.id === activityId);
  }

  static calculateStreakData(
    scheduledActivities: ScheduledActivity[],
    currentDog: Dog | null
  ): StreakData {
    if (!currentDog) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        completionRate: 0,
        activeDays: 0,
        weeklyProgress: []
      };
    }

    const weeklyProgress = this.calculateWeeklyProgress(scheduledActivities, currentDog);
    
    let currentStreak = 0;
    for (let i = weeklyProgress.length - 1; i >= 0; i--) {
      if (weeklyProgress[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    const bestStreak = Math.max(currentStreak, 12);
    
    const completedDays = weeklyProgress.filter(day => day.completed).length;
    const completionRate = weeklyProgress.length > 0 ? (completedDays / weeklyProgress.length) * 100 : 0;
    
    const activeDays = completedDays;
    
    return {
      currentStreak,
      bestStreak,
      completionRate: Math.round(completionRate),
      activeDays,
      weeklyProgress
    };
  }

  static calculateWeeklyProgress(
    scheduledActivities: ScheduledActivity[],
    currentDog: Dog
  ): WeeklyProgress[] {
    const today = new Date();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const progress: WeeklyProgress[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayIndex = (date.getDay() + 6) % 7;
      
      const dayActivities = scheduledActivities.filter(activity => 
        activity.scheduledDate === dateStr && 
        activity.dogId === currentDog.id
      );
      
      const completedCount = dayActivities.filter(a => a.completed).length;
      
      progress.push({
        day: weekDays[dayIndex],
        completed: completedCount > 0,
        activities: completedCount,
        date: dateStr
      });
    }
    
    return progress;
  }

  static calculatePillarBalance(
    scheduledActivities: ScheduledActivity[],
    userActivities: UserActivity[],
    discoveredActivities: DiscoveredActivity[],
    currentDog: Dog | null
  ): Record<string, number> {
    if (!currentDog) return {};
    
    const today = new Date().toISOString().split('T')[0];
    const completedToday = scheduledActivities.filter(activity => 
      activity.scheduledDate === today && 
      activity.completed && 
      activity.dogId === currentDog.id
    );
    
    const pillarCounts: Record<string, number> = {
      mental: 0,
      physical: 0,
      social: 0,
      environmental: 0,
      instinctual: 0
    };
    
    completedToday.forEach(activity => {
      const details = this.getActivityDetails(activity.activityId, userActivities, discoveredActivities, currentDog);
      if (details) {
        pillarCounts[details.pillar] = (pillarCounts[details.pillar] || 0) + 1;
      }
    });
    
    return pillarCounts;
  }

  static getDailyGoals(currentDog: Dog | null): PillarGoals {
    if (!currentDog?.quizResults) {
      return { mental: 1, physical: 1, social: 1, environmental: 1, instinctual: 1 };
    }
    
    const ranking = currentDog.quizResults.ranking;
    const goals: PillarGoals = { mental: 1, physical: 1, social: 1, environmental: 1, instinctual: 1 };
    
    if (ranking.length >= 2) {
      goals[ranking[0].pillar as keyof PillarGoals] = 2;
      goals[ranking[1].pillar as keyof PillarGoals] = 2;
    }
    
    return goals;
  }

  // Helper methods
  private static getISOWeek(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }
}
