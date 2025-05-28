
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
  onMaxAttemptsReached?: (error: Error) => void;
}

interface RetryState {
  isRetrying: boolean;
  attempt: number;
  lastError: Error | null;
}

export const useRetry = (options: RetryOptions = {}) => {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry,
    onMaxAttemptsReached
  } = options;

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    attempt: 0,
    lastError: null
  });

  const { toast } = useToast();

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    customOptions?: Partial<RetryOptions>
  ): Promise<T> => {
    const opts = { ...options, ...customOptions };
    let currentAttempt = 0;
    let lastError: Error;

    while (currentAttempt < (opts.maxAttempts || maxAttempts)) {
      try {
        setState(prev => ({
          ...prev,
          isRetrying: currentAttempt > 0,
          attempt: currentAttempt + 1
        }));

        const result = await operation();
        
        // Success - reset state
        setState({
          isRetrying: false,
          attempt: 0,
          lastError: null
        });

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        currentAttempt++;

        setState(prev => ({
          ...prev,
          lastError,
          attempt: currentAttempt
        }));

        if (currentAttempt < (opts.maxAttempts || maxAttempts)) {
          // Calculate delay with optional backoff
          const currentDelay = backoff 
            ? (opts.delay || delay) * Math.pow(2, currentAttempt - 1)
            : (opts.delay || delay);

          console.log(`Retry attempt ${currentAttempt}/${opts.maxAttempts || maxAttempts} in ${currentDelay}ms`);
          
          onRetry?.(currentAttempt, lastError);

          // Wait before next attempt
          await new Promise(resolve => setTimeout(resolve, currentDelay));
        }
      }
    }

    // All attempts failed
    setState(prev => ({
      ...prev,
      isRetrying: false
    }));

    onMaxAttemptsReached?.(lastError!);
    
    toast({
      title: "Operation Failed",
      description: `Failed after ${maxAttempts} attempts. ${lastError!.message}`,
      variant: "destructive"
    });

    throw lastError!;
  }, [maxAttempts, delay, backoff, onRetry, onMaxAttemptsReached, toast]);

  const reset = useCallback(() => {
    setState({
      isRetrying: false,
      attempt: 0,
      lastError: null
    });
  }, []);

  return {
    retry,
    reset,
    ...state
  };
};
