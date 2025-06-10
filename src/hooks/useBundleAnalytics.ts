
import { useEffect, useRef } from 'react';

interface BundleMetrics {
  component: string;
  loadTime: number;
  size?: number;
  cached: boolean;
}

export const useBundleAnalytics = (componentName: string) => {
  const startTimeRef = useRef(performance.now());
  const metricsRef = useRef<BundleMetrics[]>([]);

  useEffect(() => {
    const loadTime = performance.now() - startTimeRef.current;
    
    const metrics: BundleMetrics = {
      component: componentName,
      loadTime,
      cached: false // We could implement cache detection logic here
    };

    metricsRef.current.push(metrics);

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      if (loadTime > 100) {
        console.warn(`🐌 Slow component load: ${componentName} took ${loadTime.toFixed(2)}ms`);
      }

      // Log bundle metrics every 20 components
      if (metricsRef.current.length % 20 === 0) {
        const totalTime = metricsRef.current.reduce((sum, m) => sum + m.loadTime, 0);
        const avgTime = totalTime / metricsRef.current.length;
        
        console.log(`📦 Bundle Analytics Summary:`, {
          componentsLoaded: metricsRef.current.length,
          totalLoadTime: `${totalTime.toFixed(2)}ms`,
          averageLoadTime: `${avgTime.toFixed(2)}ms`,
          slowComponents: metricsRef.current
            .filter(m => m.loadTime > 50)
            .map(m => ({ name: m.component, time: `${m.loadTime.toFixed(2)}ms` }))
        });
      }
    }

    startTimeRef.current = performance.now();
  }, [componentName]);

  return {
    getMetrics: () => metricsRef.current,
    clearMetrics: () => { metricsRef.current = []; }
  };
};
