
import { AppError } from '@/utils/errorUtils';

export class BaseRepository {
  // Common validation methods
  protected static validateId(id: string, fieldName: string = 'ID'): void {
    if (!id?.trim()) {
      throw new AppError(`${fieldName} is required`, 'VALIDATION_ERROR');
    }
  }

  protected static validateDogId(dogId: string): void {
    if (!dogId?.trim()) {
      throw new AppError('Dog ID is required', 'INVALID_DOG_ID');
    }
  }

  protected static validateDate(date: string, fieldName: string = 'Date'): void {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new AppError(`Invalid ${fieldName.toLowerCase()} format`, 'VALIDATION_ERROR');
    }
  }

  protected static validatePositiveNumber(value: number, fieldName: string): void {
    if (!value || value <= 0) {
      throw new AppError(`Valid ${fieldName.toLowerCase()} is required`, 'VALIDATION_ERROR');
    }
  }

  protected static validateRequiredString(value: string, fieldName: string): void {
    if (!value?.trim()) {
      throw new AppError(`${fieldName} is required`, 'VALIDATION_ERROR');
    }
  }
}
