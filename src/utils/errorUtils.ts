
import { toast } from '@/hooks/use-toast';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: ErrorContext,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (
  error: Error | AppError,
  context?: ErrorContext,
  showToast: boolean = true
) => {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    context: {
      ...(error instanceof AppError ? error.context : {}),
      ...context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  };

  console.error('Application Error:', errorDetails);

  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    // Here you would send to your error tracking service
    console.error('Production error logged:', errorDetails);
  }

  if (showToast) {
    const userFriendlyMessage = getUserFriendlyMessage(error);
    toast({
      title: "Something went wrong",
      description: userFriendlyMessage,
      variant: "destructive"
    });
  }

  return errorDetails;
};

export const getUserFriendlyMessage = (error: Error): string => {
  // Network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return 'Please check your internet connection and try again.';
  }

  // Auth errors
  if (error.message.includes('auth') || error.message.includes('unauthorized')) {
    return 'Please sign in again to continue.';
  }

  // Validation errors
  if (error.message.includes('validation') || error.message.includes('invalid')) {
    return 'Please check your input and try again.';
  }

  // Database errors
  if (error.message.includes('database') || error.message.includes('supabase')) {
    return 'We\'re having trouble saving your data. Please try again.';
  }

  // Generic fallback
  if (error.message.length > 100) {
    return 'An unexpected error occurred. Please try again.';
  }

  return error.message;
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ErrorContext
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error as Error, context);
      throw error;
    }
  };
};

export const isRetryableError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.retryable;
  }

  // Network errors are usually retryable
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return true;
  }

  // Rate limiting errors are retryable
  if (error.message.includes('rate limit') || error.message.includes('429')) {
    return true;
  }

  // Server errors (5xx) are retryable
  if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
    return true;
  }

  // Client errors (4xx) are usually not retryable
  if (error.message.includes('400') || error.message.includes('401') || error.message.includes('403')) {
    return false;
  }

  return true;
};
