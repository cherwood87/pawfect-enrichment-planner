import React, { Suspense } from 'react';
import { logger } from '@/utils/logger';

// Loading fallback component
const LoadingFallback: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);

// Error boundary for lazy components
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Lazy component failed to load', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || (() => (
        <div className="min-h-[200px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Component failed to load</p>
        </div>
      ));
      return <Fallback />;
    }

    return this.props.children;
  }
}

// HOC for creating lazy components with enhanced error handling
export const createLazyComponent = (
  componentLoader: () => Promise<{ default: React.ComponentType<any> }>,
  loadingMessage?: string,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(componentLoader);
  
  const EnhancedLazyComponent = (props: any) => (
    <LazyErrorBoundary fallback={fallback}>
      <Suspense fallback={<LoadingFallback message={loadingMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );

  EnhancedLazyComponent.displayName = `LazyComponent`;
  
  return EnhancedLazyComponent;
};

// Pre-configured lazy components for common use cases
export const LazyActivityLibrary = createLazyComponent(
  () => import('@/components/ActivityLibrary'),
  'Loading activity library...'
);

export const LazyWeeklyPlanner = createLazyComponent(
  () => import('@/components/weekly-planner/WeeklyPlannerView'),
  'Loading weekly planner...'
);

export const LazyJournalHistory = createLazyComponent(
  () => import('@/components/journal/JournalHistory'),
  'Loading journal history...'
);

export default { createLazyComponent, LazyActivityLibrary, LazyWeeklyPlanner, LazyJournalHistory };