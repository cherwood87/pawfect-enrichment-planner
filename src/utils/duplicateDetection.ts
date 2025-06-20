import { ScheduledActivity } from "@/types/activity";

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingActivity?: ScheduledActivity;
  message?: string;
}

/**
 * Enhanced duplicate detection with multiple strategies
 */
export class DuplicateDetector {
  /**
   * Check for exact duplicates (same activity, dog, and date)
   */
  static checkExactDuplicate(
    newActivity: Partial<ScheduledActivity>,
    existingActivities: ScheduledActivity[],
  ): DuplicateCheckResult {
    const duplicate = existingActivities.find(
      (existing) =>
        existing.activityId === newActivity.activityId &&
        existing.dogId === newActivity.dogId &&
        existing.scheduledDate === newActivity.scheduledDate,
    );

    if (duplicate) {
      return {
        isDuplicate: true,
        existingActivity: duplicate,
        message: "This activity is already scheduled for this date",
      };
    }

    return { isDuplicate: false };
  }

  /**
   * Check for potential conflicts (same day, overlapping times)
   */
  static checkTimeConflicts(
    newActivity: Partial<ScheduledActivity>,
    existingActivities: ScheduledActivity[],
  ): DuplicateCheckResult {
    // For now, we only do day-based scheduling, so no time conflicts
    // This method is prepared for future time-based scheduling
    return { isDuplicate: false };
  }

  /**
   * Check for excessive activities on the same day
   */
  static checkDailyLimit(
    newActivity: Partial<ScheduledActivity>,
    existingActivities: ScheduledActivity[],
    maxPerDay: number = 5,
  ): DuplicateCheckResult {
    if (!newActivity.scheduledDate || !newActivity.dogId) {
      return { isDuplicate: false };
    }

    const activitiesOnSameDay = existingActivities.filter(
      (existing) =>
        existing.dogId === newActivity.dogId &&
        existing.scheduledDate === newActivity.scheduledDate,
    );

    if (activitiesOnSameDay.length >= maxPerDay) {
      return {
        isDuplicate: true,
        message: `Maximum of ${maxPerDay} activities allowed per day. Consider scheduling on a different day.`,
      };
    }

    return { isDuplicate: false };
  }

  /**
   * Comprehensive duplicate check combining all strategies
   */
  static performComprehensiveCheck(
    newActivity: Partial<ScheduledActivity>,
    existingActivities: ScheduledActivity[],
    options: { maxPerDay?: number } = {},
  ): DuplicateCheckResult {
    // Check exact duplicates first
    const exactCheck = this.checkExactDuplicate(
      newActivity,
      existingActivities,
    );
    if (exactCheck.isDuplicate) {
      return exactCheck;
    }

    // Check daily limits
    const dailyCheck = this.checkDailyLimit(
      newActivity,
      existingActivities,
      options.maxPerDay,
    );
    if (dailyCheck.isDuplicate) {
      return dailyCheck;
    }

    // Check time conflicts (for future use)
    const timeCheck = this.checkTimeConflicts(newActivity, existingActivities);
    if (timeCheck.isDuplicate) {
      return timeCheck;
    }

    return { isDuplicate: false };
  }
}
