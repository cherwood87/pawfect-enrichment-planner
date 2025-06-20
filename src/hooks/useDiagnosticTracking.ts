
import { useEffect, useRef } from 'react';
import { loadingDiagnosticService } from '@/services/diagnostics/LoadingDiagnosticService';

export const useDiagnosticTracking = (
  componentName: string,
  dependencies: any[] = [],
  trackRender: boolean = true
) => {
  const renderStartRef = useRef<number>(0);
  const stageNameRef = useRef<string>('');

  // Track component loading stage
  useEffect(() => {
    const stageName = `Component: ${componentName}`;
    stageNameRef.current = stageName;
    
    loadingDiagnosticService.startStage(stageName, {
      component: componentName,
      dependencies: dependencies.length
    });

    return () => {
      loadingDiagnosticService.completeStage(stageName, {
        unmounted: true
      });
    };
  }, [componentName]);

  // Track render performance
  useEffect(() => {
    if (trackRender) {
      renderStartRef.current = performance.now();
    }
  });

  useEffect(() => {
    if (trackRender && renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      loadingDiagnosticService.recordRenderTime(componentName, renderTime);
    }
  });

  // Track dependency changes
  useEffect(() => {
    if (stageNameRef.current) {
      loadingDiagnosticService.completeStage(stageNameRef.current, {
        dependenciesLoaded: true,
        dependencyCount: dependencies.length
      });
    }
  }, dependencies);

  // Utility functions for manual tracking
  const startCustomStage = (name: string, details?: any) => {
    loadingDiagnosticService.startStage(`${componentName}: ${name}`, details);
  };

  const completeCustomStage = (name: string, details?: any) => {
    loadingDiagnosticService.completeStage(`${componentName}: ${name}`, details);
  };

  const failCustomStage = (name: string, error: any) => {
    loadingDiagnosticService.failStage(`${componentName}: ${name}`, error);
  };

  const recordMetric = (name: string, value: number) => {
    loadingDiagnosticService.recordMetric(`${componentName}: ${name}`, value);
  };

  return {
    startCustomStage,
    completeCustomStage,
    failCustomStage,
    recordMetric
  };
};

// Hook specifically for network requests
export const useNetworkDiagnostics = () => {
  const trackRequest = async <T>(
    endpoint: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      loadingDiagnosticService.startStage(`Network: ${endpoint}`);
      const result = await requestFn();
      const duration = performance.now() - startTime;
      
      loadingDiagnosticService.completeStage(`Network: ${endpoint}`, { duration });
      loadingDiagnosticService.recordNetworkRequest(endpoint, duration, true);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      loadingDiagnosticService.failStage(`Network: ${endpoint}`, error);
      loadingDiagnosticService.recordNetworkRequest(endpoint, duration, false);
      
      throw error;
    }
  };

  return { trackRequest };
};

// Hook for bundle loading diagnostics
export const useBundleDiagnostics = () => {
  const trackBundleLoad = (componentName: string, importFn: () => Promise<any>) => {
    const startTime = performance.now();
    
    return importFn().then(result => {
      const loadTime = performance.now() - startTime;
      loadingDiagnosticService.recordBundleLoad(componentName, loadTime);
      return result;
    }).catch(error => {
      const loadTime = performance.now() - startTime;
      loadingDiagnosticService.recordBundleLoad(`${componentName} (failed)`, loadTime);
      throw error;
    });
  };

  return { trackBundleLoad };
};
