
import { useEffect } from 'react';
import { useBundleAnalytics } from '@/hooks/useBundleAnalytics';
import { registerProgressiveComponents } from '@/utils/progressiveLoader';
import {
  LazyIndexOptimized,
  LazyActivityLibraryPage,
  LazyWeeklyPlannerPage
} from '@/components/lazy/LazyRouteComponents';

export const useAppInitialization = () => {
  const { getMetrics } = useBundleAnalytics('App');

  useEffect(() => {
    // Register progressive loading components
    registerProgressiveComponents();

    // Preload critical route chunks based on current route
    const currentPath = window.location.pathname;
    
    if (currentPath === '/' || currentPath === '/auth') {
      // Preload app routes for faster navigation
      setTimeout(() => {
        (LazyIndexOptimized as any).preload?.();
      }, 2000);
    } else if (currentPath.includes('/app')) {
      // Preload activity library and weekly planner
      setTimeout(() => {
        (LazyActivityLibraryPage as any).preload?.();
        (LazyWeeklyPlannerPage as any).preload?.();
      }, 1000);
    }

    // Log bundle metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 App initialized with advanced code splitting');
    }
  }, []);

  return { getMetrics };
};
