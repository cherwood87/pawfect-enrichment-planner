import {
  ScheduledActivity,
  UserActivity,
  ActivityLibraryItem,
  StreakData,
  WeeklyProgress,
  PillarGoals,
} from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";
import { Dog } from "@/types/dog";
import { getActivityById } from "@/data/activityLibrary";
import { WeekUtils } from "@/utils/weekUtils";

export class ActivityAnalyticsService {
  static getTodaysActivities(
    scheduledActivities: ScheduledActivity[],
    currentDog: Dog | null,
  ): ScheduledActivity[] {
    if (!currentDog) return [];

    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const currentWeek = WeekUtils.getISOWeek(today);

    console.log("📅 [ActivityAnalyticsService] Getting today's activities:", {
      currentDayOfWeek,
      currentWeek,
      dogId: currentDog.id,
    });

    const todaysActivities = scheduledActivities.filter(
      (activity) =>
        activity.dogId === currentDog.id &&
        activity.dayOfWeek === currentDayOfWeek &&
        activity.weekNumber === currentWeek,
    );

    console.log(
      "📋 [ActivityAnalyticsService] Found today's activities:",
      todaysActivities.length,
    );
    return todaysActivities;
  }

  static getActivityDetails(
    activityId: string,
    userActivities: UserActivity[],
    discoveredActivities: DiscoveredActivity[],
    currentDog: Dog | null,
  ): ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined {
    console.log("🔍 [ActivityAnalyticsService] Looking up activity details:", {
      activityId,
      userActivitiesCount: userActivities.length,
      discoveredActivitiesCount: discoveredActivities.length,
      currentDog: currentDog?.name || "None",
    });

    // First check library activities
    const libraryActivity = getActivityById(activityId);
    if (libraryActivity) {
      console.log(
        "✅ [ActivityAnalyticsService] Found in library:",
        libraryActivity.title,
      );
      return libraryActivity;
    }

    // Then check user activities for current dog
    const userActivity = userActivities.find(
      (activity) =>
        activity.id === activityId && activity.dogId === currentDog?.id,
    );
    if (userActivity) {
      console.log(
        "✅ [ActivityAnalyticsService] Found in user activities:",
        userActivity.title,
      );
      return userActivity;
    }

    // Finally check discovered activities
    const discoveredActivity = discoveredActivities.find(
      (activity) => activity.id === activityId,
    );
    if (discoveredActivity) {
      console.log(
        "✅ [ActivityAnalyticsService] Found in discovered activities:",
        discoveredActivity.title,
      );
      return discoveredActivity;
    }

    console.warn(
      "❌ [ActivityAnalyticsService] Activity not found:",
      activityId,
    );
    return undefined;
  }

  static calculateStreakData(
    scheduledActivities: ScheduledActivity[],
    currentDog: Dog | null,
  ): StreakData {
    if (!currentDog) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        completionRate: 0,
        activeDays: 0,
        weeklyProgress: [],
      };
    }

    const weeklyProgress = this.calculateWeeklyProgress(
      scheduledActivities,
      currentDog,
    );

    let currentStreak = 0;
    for (let i = weeklyProgress.length - 1; i >= 0; i--) {
      if (weeklyProgress[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    const bestStreak = Math.max(currentStreak, 12);

    const completedDays = weeklyProgress.filter((day) => day.completed).length;
    const completionRate =
      weeklyProgress.length > 0
        ? (completedDays / weeklyProgress.length) * 100
        : 0;

    const activeDays = completedDays;

    return {
      currentStreak,
      bestStreak,
      completionRate: Math.round(completionRate),
      activeDays,
      weeklyProgress,
    };
  }

  static calculateWeeklyProgress(
    scheduledActivities: ScheduledActivity[],
    currentDog: Dog,
  ): WeeklyProgress[] {
    const today = new Date();
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const progress: WeeklyProgress[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayIndex = (date.getDay() + 6) % 7;

      const dayActivities = scheduledActivities.filter(
        (activity) =>
          activity.scheduledDate === dateStr &&
          activity.dogId === currentDog.id,
      );

      const completedCount = dayActivities.filter((a) => a.completed).length;

      progress.push({
        day: weekDays[dayIndex],
        completed: completedCount > 0,
        activities: completedCount,
        date: dateStr,
      });
    }

    return progress;
  }

  static calculatePillarBalance(
    scheduledActivities: ScheduledActivity[],
    userActivities: UserActivity[],
    discoveredActivities: DiscoveredActivity[],
    currentDog: Dog | null,
  ): Record<string, number> {
    if (!currentDog) return {};

    const today = new Date().toISOString().split("T")[0];
    const completedToday = scheduledActivities.filter(
      (activity) =>
        activity.scheduledDate === today &&
        activity.completed &&
        activity.dogId === currentDog.id,
    );

    const pillarCounts: Record<string, number> = {
      mental: 0,
      physical: 0,
      social: 0,
      environmental: 0,
      instinctual: 0,
    };

    completedToday.forEach((activity) => {
      const details = this.getActivityDetails(
        activity.activityId,
        userActivities,
        discoveredActivities,
        currentDog,
      );
      if (details) {
        pillarCounts[details.pillar] = (pillarCounts[details.pillar] || 0) + 1;
      }
    });

    return pillarCounts;
  }

  static getDailyGoals(currentDog: Dog | null): PillarGoals {
    if (!currentDog?.quizResults) {
      return {
        mental: 1,
        physical: 1,
        social: 1,
        environmental: 1,
        instinctual: 1,
      };
    }

    const ranking = currentDog.quizResults.ranking;
    const goals: PillarGoals = {
      mental: 1,
      physical: 1,
      social: 1,
      environmental: 1,
      instinctual: 1,
    };

    if (ranking.length >= 2) {
      goals[ranking[0].pillar as keyof PillarGoals] = 2;
      goals[ranking[1].pillar as keyof PillarGoals] = 2;
    }

    return goals;
  }
}
