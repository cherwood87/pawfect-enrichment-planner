
import React, { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import ErrorFallback from './ErrorFallback';

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  queryKey?: string[];
  enabled?: boolean;
}

const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  fallback,
  loadingFallback,
  queryKey,
  enabled = true
}) => {
  // Optional query integration for async error handling
  const { isLoading, error } = useQuery({
    queryKey: queryKey || ['async-boundary'],
    queryFn: () => Promise.resolve(true),
    enabled: enabled && !!queryKey,
    retry: false
  });

  if (queryKey && isLoading) {
    return loadingFallback || <LoadingSpinner />;
  }

  if (queryKey && error) {
    return fallback || <ErrorFallback error={error as Error} />;
  }

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

export default AsyncErrorBoundary;
