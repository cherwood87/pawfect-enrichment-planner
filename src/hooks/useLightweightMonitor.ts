
import { useEffect, useRef } from 'react';

interface LightweightMetrics {
  componentName: string;
  loadTime: number;
}

export const useLightweightMonitor = (componentName: string) => {
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    const loadTime = performance.now() - startTimeRef.current;
    
    // Only log in development and only if load time is significant
    if (process.env.NODE_ENV === 'development' && loadTime > 100) {
      console.warn(`🐌 ${componentName} took ${loadTime.toFixed(2)}ms to load`);
    }
  }, [componentName]);

  return { componentName };
};
