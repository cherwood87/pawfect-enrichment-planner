import { ScheduledActivity, UserActivity, ActivityLibraryItem } from '@/types/activity';
import { Dog } from '@/types/dog';
import { DiscoveredActivity } from '@/types/discovery';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class DataValidator {
  /**
   * Validates a scheduled activity before database operations
   */
  static validateScheduledActivity(activity: Partial<ScheduledActivity>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!activity.activityId?.trim()) {
      errors.push('Activity ID is required and cannot be empty');
    }

    if (!activity.dogId?.trim()) {
      errors.push('Dog ID is required and cannot be empty');
    }

    if (!activity.scheduledDate) {
      errors.push('Scheduled date is required');
    } else {
      // Date validation
      const date = new Date(activity.scheduledDate);
      if (isNaN(date.getTime())) {
        errors.push('Scheduled date must be a valid date');
      } else if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
        warnings.push('Scheduled date is in the past');
      }
    }

    // Data type validation
    if (activity.completed !== undefined && typeof activity.completed !== 'boolean') {
      errors.push('Completed status must be a boolean value');
    }

    if (activity.reminderEnabled !== undefined && typeof activity.reminderEnabled !== 'boolean') {
      errors.push('Reminder enabled must be a boolean value');
    }

    // String length validation
    if (activity.notes && activity.notes.length > 1000) {
      warnings.push('Notes are very long and may be truncated');
    }

    if (activity.completionNotes && activity.completionNotes.length > 1000) {
      warnings.push('Completion notes are very long and may be truncated');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates a user activity before database operations
   */
  static validateUserActivity(activity: Partial<UserActivity>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!activity.title?.trim()) {
      errors.push('Activity title is required');
    } else if (activity.title.length > 200) {
      errors.push('Activity title is too long (max 200 characters)');
    }

    if (!activity.pillar) {
      errors.push('Activity pillar is required');
    } else {
      const validPillars = ['mental', 'physical', 'social', 'environmental', 'instinctual'];
      if (!validPillars.includes(activity.pillar)) {
        errors.push(`Invalid pillar: ${activity.pillar}. Must be one of: ${validPillars.join(', ')}`);
      }
    }

    if (!activity.difficulty) {
      errors.push('Activity difficulty is required');
    } else {
      const validDifficulties = ['Easy', 'Medium', 'Hard'];
      if (!validDifficulties.includes(activity.difficulty)) {
        errors.push(`Invalid difficulty: ${activity.difficulty}. Must be one of: ${validDifficulties.join(', ')}`);
      }
    }

    if (activity.duration === undefined || activity.duration === null) {
      errors.push('Activity duration is required');
    } else if (typeof activity.duration !== 'number' || activity.duration <= 0) {
      errors.push('Activity duration must be a positive number');
    } else if (activity.duration > 480) {
      warnings.push('Activity duration is very long (over 8 hours)');
    }

    // Optional field validation
    if (activity.benefits && activity.benefits.length > 500) {
      warnings.push('Benefits description is very long');
    }

    if (activity.materials && activity.materials.length > 50) {
      warnings.push('Many materials listed - consider simplifying');
    }

    if (activity.instructions && activity.instructions.length > 100) {
      warnings.push('Many instruction steps - consider breaking into smaller activities');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates a dog profile before database operations
   */
  static validateDog(dog: Partial<Dog>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!dog.name?.trim()) {
      errors.push('Dog name is required');
    } else if (dog.name.length > 100) {
      errors.push('Dog name is too long (max 100 characters)');
    }

    if (!dog.breed?.trim()) {
      errors.push('Dog breed is required');
    }

    if (dog.age === undefined || dog.age === null) {
      errors.push('Dog age is required');
    } else if (typeof dog.age !== 'number' || dog.age < 0) {
      errors.push('Dog age must be a non-negative number');
    } else if (dog.age > 30) {
      warnings.push('Dog age seems unusually high');
    }

    // Optional field validation
    if (dog.weight !== undefined && dog.weight !== null) {
      if (typeof dog.weight !== 'number' || dog.weight <= 0) {
        errors.push('Dog weight must be a positive number');
      } else if (dog.weight > 200) {
        warnings.push('Dog weight seems unusually high');
      }
    }

    if (dog.activityLevel) {
      const validActivityLevels = ['low', 'moderate', 'high'];
      if (!validActivityLevels.includes(dog.activityLevel)) {
        errors.push(`Invalid activity level: ${dog.activityLevel}. Must be one of: ${validActivityLevels.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates discovered activities before approval
   */
  static validateDiscoveredActivity(activity: Partial<DiscoveredActivity>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Use base user activity validation
    const baseValidation = this.validateUserActivity(activity);
    errors.push(...baseValidation.errors);
    warnings.push(...baseValidation.warnings);

    // Additional validation for discovered activities
    if (activity.qualityScore !== undefined) {
      if (typeof activity.qualityScore !== 'number' || activity.qualityScore < 0 || activity.qualityScore > 1) {
        errors.push('Quality score must be a number between 0 and 1');
      } else if (activity.qualityScore < 0.3) {
        warnings.push('Quality score is low - consider reviewing before approval');
      }
    }

    if (!activity.source) {
      errors.push('Source is required for discovered activities');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Sanitizes user input to prevent XSS and injection attacks
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .replace(/on\w+='[^']*'/gi, '') // Remove event handlers with single quotes
      .slice(0, 10000); // Limit length to prevent abuse
  }

  /**
   * Validates and sanitizes bulk data operations
   */
  static validateBulkOperation<T>(
    items: T[], 
    validator: (item: T) => ValidationResult,
    maxItems: number = 100
  ): { validItems: T[]; invalidItems: { item: T; errors: string[] }[]; warnings: string[] } {
    if (items.length > maxItems) {
      throw new Error(`Bulk operation exceeds maximum limit of ${maxItems} items`);
    }

    const validItems: T[] = [];
    const invalidItems: { item: T; errors: string[] }[] = [];
    const allWarnings: string[] = [];

    items.forEach(item => {
      const validation = validator(item);
      if (validation.isValid) {
        validItems.push(item);
      } else {
        invalidItems.push({ item, errors: validation.errors });
      }
      allWarnings.push(...validation.warnings);
    });

    return {
      validItems,
      invalidItems,
      warnings: [...new Set(allWarnings)] // Remove duplicates
    };
  }
}

/**
 * Utility function to check for potential duplicate activities
 */
export const checkForDuplicates = (
  newActivity: Partial<ScheduledActivity>,
  existingActivities: ScheduledActivity[]
): boolean => {
  return existingActivities.some(existing => 
    existing.activityId === newActivity.activityId &&
    existing.dogId === newActivity.dogId &&
    existing.scheduledDate === newActivity.scheduledDate
  );
};

/**
 * Utility function to normalize activity data for consistent storage
 */
export const normalizeActivityData = (activity: Partial<ScheduledActivity>): Partial<ScheduledActivity> => {
  return {
    ...activity,
    notes: DataValidator.sanitizeInput(activity.notes || ''),
    completionNotes: DataValidator.sanitizeInput(activity.completionNotes || ''),
    scheduledDate: activity.scheduledDate ? new Date(activity.scheduledDate).toISOString().split('T')[0] : undefined,
    completed: Boolean(activity.completed),
    reminderEnabled: Boolean(activity.reminderEnabled)
  };
};
