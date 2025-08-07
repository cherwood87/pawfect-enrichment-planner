
import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxAttempts: number;
  delay: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export const useRetry = (options: UseRetryOptions) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    let lastError: Error;
    
    for (let i = 0; i < options.maxAttempts; i++) {
      try {
        setAttempt(i + 1);
        if (i > 0) {
          setIsRetrying(true);
          await new Promise(resolve => setTimeout(resolve, options.delay));
        }
        
        const result = await fn();
        setIsRetrying(false);
        setAttempt(0);
        return result;
      } catch (error) {
        lastError = error as Error;
        if (options.onRetry && i < options.maxAttempts - 1) {
          options.onRetry(i + 1, lastError);
        }
      }
    }
    
    setIsRetrying(false);
    setAttempt(0);
    throw lastError!;
  }, [options]);

  return { retry, isRetrying, attempt };
};
