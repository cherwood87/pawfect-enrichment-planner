// Centralized error translation service for user-friendly messages
import { logger } from '@/utils/logger';

export class ErrorTranslationService {
  private static errorMappings = new Map<string, string>([
    // Authentication errors
    ['Invalid login credentials', 'The email or password you entered is incorrect. Please check and try again.'],
    ['User already registered', 'An account with this email already exists. Please sign in instead.'],
    ['Email not confirmed', 'Please check your email and click the confirmation link to activate your account.'],
    ['Password should be at least 6 characters', 'Password must be at least 6 characters long.'],
    ['Signup requires a valid password', 'Please enter a valid password to create your account.'],
    
    // Network errors  
    ['Network request failed', 'Unable to connect to our servers. Please check your internet connection.'],
    ['ERR_NETWORK', 'Network connection problem. Please check your internet and try again.'],
    ['ERR_INTERNET_DISCONNECTED', 'You appear to be offline. Please check your internet connection.'],
    ['fetch', 'Connection problem. Please check your internet and try again.'],
    
    // Database errors
    ['PostgreSQL error', 'A database error occurred. Please try again in a moment.'],
    ['relation does not exist', 'Data structure error. Please refresh the page and try again.'],
    ['permission denied', 'You don\'t have permission to perform this action.'],
    
    // File upload errors
    ['File too large', 'The file you selected is too large. Please choose a smaller file.'],
    ['Invalid file type', 'This file type is not supported. Please choose a different file.'],
    ['Upload failed', 'File upload failed. Please try again.'],
    
    // Validation errors
    ['Required field', 'This field is required. Please fill it in.'],
    ['Invalid email', 'Please enter a valid email address.'],
    ['Invalid format', 'The format you entered is not valid. Please check and try again.'],
    
    // Storage errors
    ['localStorage', 'Browser storage is full. Please clear some space and try again.'],
    ['sessionStorage', 'Browser session storage error. Please refresh the page.'],
    ['QuotaExceededError', 'Storage quota exceeded. Please clear browser data and try again.'],
    
    // Loading errors
    ['ChunkLoadError', 'App update detected. Please refresh the page to get the latest version.'],
    ['Loading chunk', 'App loading error. Please refresh the page.'],
    ['Module not found', 'App component not found. Please refresh the page.'],
    
    // General errors
    ['undefined', 'An unexpected error occurred. Please try again.'],
    ['null', 'An unexpected error occurred. Please try again.'],
    ['TypeError', 'A technical error occurred. Please refresh the page and try again.'],
    ['ReferenceError', 'A technical error occurred. Please refresh the page and try again.']
  ]);

  static translateError(error: any): string {
    if (!error) {
      return 'An unexpected error occurred. Please try again.';
    }

    const errorMessage = typeof error === 'string' ? error : error.message || error.toString();
    
    logger.debug('Translating error', { originalError: errorMessage });

    // Check for exact matches first
    for (const [key, translation] of this.errorMappings) {
      if (errorMessage.includes(key)) {
        logger.debug('Error translation found', { key, translation });
        return translation;
      }
    }

    // Handle specific error patterns
    if (errorMessage.includes('dog') && errorMessage.includes('not found')) {
      return 'The selected dog could not be found. Please try selecting a different dog.';
    }

    if (errorMessage.includes('activity') && errorMessage.includes('not found')) {
      return 'The selected activity could not be found. Please try selecting a different activity.';
    }

    if (errorMessage.includes('quiz') && errorMessage.includes('incomplete')) {
      return 'Please complete the personality quiz to continue.';
    }

    if (errorMessage.includes('subscription') && errorMessage.includes('required')) {
      return 'This feature requires a subscription. Please upgrade your account to continue.';
    }

    // Rate limiting
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return 'The request took too long. Please check your connection and try again.';
    }

    // API errors
    if (errorMessage.includes('400')) {
      return 'Invalid request. Please check your input and try again.';
    }
    
    if (errorMessage.includes('401')) {
      return 'Your session has expired. Please sign in again.';
    }
    
    if (errorMessage.includes('403')) {
      return 'You don\'t have permission to perform this action.';
    }
    
    if (errorMessage.includes('404')) {
      return 'The requested information was not found.';
    }
    
    if (errorMessage.includes('500')) {
      return 'Server error. Please try again in a few minutes.';
    }

    // Log untranslated errors for improvement
    logger.warn('Untranslated error encountered', { error: errorMessage });

    // Return sanitized generic message
    return 'Something went wrong. Please try again or contact support if the problem persists.';
  }

  static addErrorMapping(errorKey: string, translation: string): void {
    this.errorMappings.set(errorKey, translation);
    logger.debug('Added new error mapping', { errorKey, translation });
  }

  static getFormValidationMessage(field: string, error: string): string {
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
    
    if (error.includes('required')) {
      return `${fieldName} is required.`;
    }
    
    if (error.includes('email')) {
      return 'Please enter a valid email address.';
    }
    
    if (error.includes('password')) {
      if (error.includes('length')) {
        return 'Password must be at least 6 characters long.';
      }
      return 'Please enter a valid password.';
    }
    
    if (error.includes('min') || error.includes('max')) {
      return `${fieldName} must meet the length requirements.`;
    }
    
    return `Please enter a valid ${field.toLowerCase()}.`;
  }
}

// Convenience function for easy use
export const translateError = (error: any): string => {
  return ErrorTranslationService.translateError(error);
};

export const getFormError = (field: string, error: string): string => {
  return ErrorTranslationService.getFormValidationMessage(field, error);
};