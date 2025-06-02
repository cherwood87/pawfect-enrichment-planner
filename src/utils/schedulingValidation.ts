
import { ScheduledActivity } from '@/types/activity';
import { Dog } from '@/types/dog';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class SchedulingValidator {
  /**
   * Validate date scheduling constraints
   */
  static validateScheduledDate(scheduledDate: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!scheduledDate) {
      errors.push('Scheduled date is required');
      return { isValid: false, errors, warnings };
    }

    const date = new Date(scheduledDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
      return { isValid: false, errors, warnings };
    }

    // Don't allow scheduling too far in the past (more than 1 day)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (date < yesterday) {
      errors.push('Cannot schedule activities for past dates');
    }

    // Warn if scheduling too far in the future (more than 3 months)
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    if (date > threeMonthsFromNow) {
      warnings.push('Scheduling activities more than 3 months in advance');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate week and day calculations
   */
  static validateWeekAndDay(weekNumber?: number, dayOfWeek?: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (weekNumber !== undefined) {
      if (weekNumber < 1 || weekNumber > 53) {
        errors.push('Week number must be between 1 and 53');
      }
    }

    if (dayOfWeek !== undefined) {
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        errors.push('Day of week must be between 0 (Sunday) and 6 (Saturday)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate dog context for scheduling
   */
  static validateDogContext(dog: Dog | null): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!dog) {
      errors.push('No dog selected for scheduling');
      return { isValid: false, errors, warnings };
    }

    if (!dog.id) {
      errors.push('Dog ID is missing');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Comprehensive validation for scheduled activity
   */
  static validateScheduledActivity(
    activity: Partial<ScheduledActivity>,
    dog: Dog | null
  ): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    // Validate dog context
    const dogValidation = this.validateDogContext(dog);
    allErrors.push(...dogValidation.errors);
    allWarnings.push(...dogValidation.warnings);

    // Validate required fields
    if (!activity.activityId?.trim()) {
      allErrors.push('Activity ID is required');
    }

    if (!activity.scheduledDate) {
      allErrors.push('Scheduled date is required');
    } else {
      // Validate date
      const dateValidation = this.validateScheduledDate(activity.scheduledDate);
      allErrors.push(...dateValidation.errors);
      allWarnings.push(...dateValidation.warnings);
    }

    // Validate week and day if provided
    const weekDayValidation = this.validateWeekAndDay(activity.weekNumber, activity.dayOfWeek);
    allErrors.push(...weekDayValidation.errors);
    allWarnings.push(...weekDayValidation.warnings);

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }
}
