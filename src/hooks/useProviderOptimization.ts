import { useCallback, useMemo, useRef } from "react";

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  dependencies: any[];
}

export const useProviderOptimization = <T>(
  computeValue: () => T,
  dependencies: any[],
  cacheTime: number = 5000, // 5 seconds default cache
) => {
  const cacheRef = useRef<CacheEntry<T> | null>(null);

  // Check if dependencies have changed
  const dependenciesChanged = useCallback(
    (oldDeps: any[], newDeps: any[]): boolean => {
      if (oldDeps.length !== newDeps.length) return true;
      return oldDeps.some((dep, index) => dep !== newDeps[index]);
    },
    [],
  );

  // Memoized value computation with caching
  const cachedValue = useMemo(() => {
    const now = Date.now();
    const cache = cacheRef.current;

    // Use cache if it exists, is not expired, and dependencies haven't changed
    if (
      cache &&
      now - cache.timestamp < cacheTime &&
      !dependenciesChanged(cache.dependencies, dependencies)
    ) {
      return cache.value;
    }

    // Compute new value and update cache
    const newValue = computeValue();
    cacheRef.current = {
      value: newValue,
      timestamp: now,
      dependencies: [...dependencies],
    };

    return newValue;
  }, dependencies);

  // Clear cache function for manual invalidation
  const clearCache = useCallback(() => {
    cacheRef.current = null;
  }, []);

  return { value: cachedValue, clearCache };
};

// Hook for optimizing context re-renders
export const useContextOptimization = <T extends Record<string, any>>(
  contextValue: T,
  dependencies: any[],
): T => {
  return useMemo(() => contextValue, dependencies);
};

// Hook for debouncing provider updates
export const useProviderDebounce = <T>(value: T, delay: number = 100): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const valueRef = useRef(value);

  useMemo(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      valueRef.current = value;
    }, delay);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return valueRef.current;
};
