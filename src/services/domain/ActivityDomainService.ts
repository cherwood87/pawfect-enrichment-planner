
import { ScheduledActivity, UserActivity, ActivityLibraryItem, StreakData, WeeklyProgress, PillarGoals } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { ActivityRepository } from '../data/ActivityRepository';
import { getActivityById } from '@/data/activityLibrary';

export class ActivityDomainService {
  // Business logic for activity operations
  static async getScheduledActivitiesForDog(dogId: string): Promise<ScheduledActivity[]> {
    return await ActivityRepository.getScheduledActivities(dogId);
  }

  static async createScheduledActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<ScheduledActivity> {
    // Add business logic validation here if needed
    const newActivity: ScheduledActivity = {
      ...activity,
      id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notes: activity.notes || '',
      completionNotes: activity.completionNotes || '',
      reminderEnabled: activity.reminderEnabled ?? false,
    };

    return await ActivityRepository.createScheduledActivity(newActivity);
  }

  static async toggleActivityCompletion(
    activityId: string, 
    dogId: string, 
    completionNotes?: string
  ): Promise<ScheduledActivity> {
    const activities = await ActivityRepository.getScheduledActivities(dogId);
    const activity = activities.find(a => a.id === activityId);
    
    if (!activity) {
      throw new Error('Activity not found');
    }

    const updatedActivity: ScheduledActivity = {
      ...activity,
      completed: !activity.completed,
      completedAt: !activity.completed ? new Date().toISOString() : undefined,
      completionNotes: !activity.completed ? (completionNotes || '') : activity.completionNotes,
    };

    return await ActivityRepository.updateScheduledActivity(updatedActivity);
  }

  static async updateScheduledActivity(
    activityId: string, 
    dogId: string, 
    updates: Partial<ScheduledActivity>
  ): Promise<ScheduledActivity> {
    const activities = await ActivityRepository.getScheduledActivities(dogId);
    const activity = activities.find(a => a.id === activityId);
    
    if (!activity) {
      throw new Error('Activity not found');
    }

    const updatedActivity = { ...activity, ...updates };
    return await ActivityRepository.updateScheduledActivity(updatedActivity);
  }

  static async createUserActivity(activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>, dogId: string): Promise<UserActivity> {
    const newActivity: UserActivity = {
      ...activity,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dogId,
      createdAt: new Date().toISOString(),
    };

    return await ActivityRepository.createUserActivity(newActivity);
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
