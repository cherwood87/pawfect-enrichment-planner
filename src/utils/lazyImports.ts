// Utility for dynamically importing heavy dependencies only when needed

export const loadHeavyDependencies = {
  // Date utilities - load when date operations are needed
  dateFns: () => import('date-fns'),
  
  // Chart libraries - load when analytics are viewed
  charts: () => import('lucide-react').then(mod => ({ 
    BarChart: mod.BarChart3,
    PieChart: mod.PieChart,
    TrendingUp: mod.TrendingUp 
  })),
  
  // Form validation - load when forms are used
  zod: () => import('zod'),
  
  // Advanced UI components - load when specific features are accessed
  dayPicker: () => import('react-day-picker'),
  toast: () => import('sonner'),
  
  // Analytics and monitoring - defer until after initial load
  webVitals: () => import('web-vitals'),
  
  // Query client - load when data fetching is needed
  queryClient: () => import('@tanstack/react-query'),
  
  // Router - load navigation utilities when needed
  routerUtils: () => import('react-router-dom').then(mod => ({
    useNavigate: mod.useNavigate,
    useLocation: mod.useLocation,
    useParams: mod.useParams
  }))
};

// Preload critical dependencies after initial render
export const preloadCriticalDependencies = () => {
  // Use requestIdleCallback to load during browser idle time
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadHeavyDependencies.queryClient();
      loadHeavyDependencies.routerUtils();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      loadHeavyDependencies.queryClient();
      loadHeavyDependencies.routerUtils();
    }, 100);
  }
};

// Load non-critical dependencies after main app is interactive
export const preloadNonCriticalDependencies = () => {
  const loadAfterDelay = (loader: () => Promise<any>, delay: number) => {
    setTimeout(loader, delay);
  };

  // Stagger loading to avoid blocking
  loadAfterDelay(loadHeavyDependencies.webVitals, 500);
  loadAfterDelay(loadHeavyDependencies.charts, 1000);
  loadAfterDelay(loadHeavyDependencies.dayPicker, 1500);
  loadAfterDelay(loadHeavyDependencies.zod, 2000);
};