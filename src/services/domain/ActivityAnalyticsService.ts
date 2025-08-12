import { ScheduledActivity, UserActivity, ActivityLibraryItem, StreakData, WeeklyProgress, PillarGoals } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { getActivityById } from '@/data/activityLibrary';
import { WeekUtils } from '@/utils/weekUtils';

export class ActivityAnalyticsService {
  static getTodaysActivities(
    scheduledActivities: ScheduledActivity[], 
    currentDog: Dog | null
  ): ScheduledActivity[] {
    if (!currentDog) return [];
    
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const currentWeek = WeekUtils.getISOWeek(today);
    
    console.log('📅 [ActivityAnalyticsService] Getting today\'s activities:', {
      currentDayOfWeek,
      currentWeek,
      dogId: currentDog.id
    });
    
    const todaysActivities = scheduledActivities.filter(activity => 
      activity.dogId === currentDog.id &&
      activity.dayOfWeek === currentDayOfWeek &&
      activity.weekNumber === currentWeek
    );
    
    console.log('📋 [ActivityAnalyticsService] Found today\'s activities:', todaysActivities.length);
    return todaysActivities;
  }

  static getActivityDetails(
    activityId: string,
    userActivities: UserActivity[],
    discoveredActivities: DiscoveredActivity[],
    currentDog: Dog | null
  ): ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined {
    console.log('🔍 [ActivityAnalyticsService] Looking up activity details:', {
      activityId,
      userActivitiesCount: userActivities.length,
      discoveredActivitiesCount: discoveredActivities.length,
      currentDog: currentDog?.name || 'None'
    });

    // First check library activities
    const libraryActivity = getActivityById(activityId);
    if (libraryActivity) {
      console.log('✅ [ActivityAnalyticsService] Found in library:', libraryActivity.title);
      return libraryActivity;
    }
    
    // Then check user activities for current dog
    const userActivity = userActivities.find(activity => 
      activity.id === activityId && activity.dogId === currentDog?.id
    );
    if (userActivity) {
      console.log('✅ [ActivityAnalyticsService] Found in user activities:', userActivity.title);
      return userActivity;
    }

    // Finally check discovered activities
    const discoveredActivity = discoveredActivities.find(activity => activity.id === activityId);
    if (discoveredActivity) {
      console.log('✅ [ActivityAnalyticsService] Found in discovered activities:', discoveredActivity.title);
      return discoveredActivity;
    }

    console.warn('❌ [ActivityAnalyticsService] Activity not found:', activityId);
    return undefined;
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
      // Default goals for dogs without quiz results
      return { mental: 1, physical: 1, social: 1, environmental: 1, instinctual: 1 };
    }
    
    const ranking = currentDog.quizResults.ranking;
    const goals: PillarGoals = { mental: 1, physical: 1, social: 1, environmental: 1, instinctual: 1 };
    
    // Dynamic goal setting based on quiz scores and dog attributes
    if (ranking.length >= 2) {
      // Top 2 pillars get higher goals
      goals[ranking[0].pillar as keyof PillarGoals] = this.calculateDynamicGoal(ranking[0].score, currentDog);
      goals[ranking[1].pillar as keyof PillarGoals] = this.calculateDynamicGoal(ranking[1].score, currentDog, true);
    }
    
    // Adjust for dog age and activity level
    if (currentDog.age >= 84) {
      // Senior dogs - slightly lower physical goals
      goals.physical = Math.max(1, goals.physical - 1);
    } else if (currentDog.age < 12) {
      // Puppies - focus on mental and social development
      goals.mental = Math.max(goals.mental, 2);
      goals.social = Math.max(goals.social, 2);
    }
    
    if (currentDog.activityLevel === 'high') {
      goals.physical = Math.max(goals.physical, 2);
    } else if (currentDog.activityLevel === 'low') {
      goals.physical = Math.max(1, goals.physical - 1);
      goals.mental = Math.max(goals.mental, 2); // Compensate with mental stimulation
    }
    
    return goals;
  }

  private static calculateDynamicGoal(score: number, dog: Dog, isSecondary: boolean = false): number {
    // Base goal calculation from quiz score
    let goal = Math.ceil(score / 2); // Score of 4-5 = 2-3 goals, score of 2-3 = 1-2 goals
    
    // Secondary pillar gets slightly lower goals
    if (isSecondary) {
      goal = Math.max(1, goal - 1);
    }
    
    // Cap based on dog's overall capacity
    const maxGoal = dog.activityLevel === 'high' ? 4 : dog.activityLevel === 'moderate' ? 3 : 2;
    return Math.min(goal, maxGoal);
  }
}
