
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { Dog } from '@/types/dog';
import { ActivityRepository } from '../data/ActivityRepository';
import { AppError } from '@/utils/errorUtils';

export class ActivityValidationService {
  static validateScheduledActivityData(activity: Omit<ScheduledActivity, 'id'>): void {
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

  static validateScheduledDate(scheduledDate: string): void {
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

  static validateUserActivityData(activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>): void {
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

  static async checkForDuplicateActivity(activity: Omit<ScheduledActivity, 'id'>): Promise<void> {
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
}
