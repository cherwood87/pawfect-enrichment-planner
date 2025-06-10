
import { lazy, ComponentType } from 'react';

interface LoadableComponentOptions {
  fallback?: ComponentType;
  delay?: number;
  timeout?: number;
}

// Enhanced lazy loading with better error handling and preloading
export const createLoadableComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LoadableComponentOptions = {}
) => {
  const LazyComponent = lazy(() => {
    const { delay = 0, timeout = 10000 } = options;
    
    return Promise.race([
      // Add artificial delay if specified (useful for testing)
      delay > 0 
        ? new Promise(resolve => setTimeout(resolve, delay)).then(() => importFn())
        : importFn(),
      
      // Add timeout to prevent infinite loading
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Component load timeout')), timeout)
      )
    ]) as Promise<{ default: T }>;
  });

  // Add preload capability
  (LazyComponent as any).preload = importFn;

  return LazyComponent;
};

// Preload multiple components
export const preloadComponents = (components: Array<() => Promise<any>>) => {
  return Promise.allSettled(components.map(comp => comp()));
};

// Smart preloader based on user interaction
export const createInteractionPreloader = (
  componentLoader: () => Promise<any>,
  triggerEvents: string[] = ['mouseenter', 'focus']
) => {
  let preloaded = false;
  
  return (element: HTMLElement | null) => {
    if (!element || preloaded) return;
    
    const preload = () => {
      if (!preloaded) {
        preloaded = true;
        componentLoader();
      }
    };
    
    triggerEvents.forEach(event => {
      element.addEventListener(event, preload, { once: true });
    });
    
    return () => {
      triggerEvents.forEach(event => {
        element.removeEventListener(event, preload);
      });
    };
  };
};
