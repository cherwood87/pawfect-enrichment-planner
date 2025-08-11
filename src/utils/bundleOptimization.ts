// Bundle optimization utilities
export const loadComponent = async <T>(
  componentLoader: () => Promise<{ default: T }>,
  fallback?: T
): Promise<T> => {
  try {
    const module = await componentLoader();
    return module.default;
  } catch (error) {
    console.error('Failed to load component:', error);
    if (fallback) {
      return fallback;
    }
    throw error;
  }
};

// Preload critical routes
export const preloadRoute = (routePath: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  document.head.appendChild(link);
};

// Image optimization helper
export const optimizeImageSrc = (src: string, width?: number, height?: number): string => {
  // For future WebP conversion and responsive image implementation
  if (src.includes('lovable-uploads') && (width || height)) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    return `${src}?${params.toString()}`;
  }
  return src;
};

// Memory cleanup helper
export const cleanup = (refs: React.MutableRefObject<any>[]): void => {
  refs.forEach(ref => {
    if (ref.current) {
      ref.current = null;
    }
  });
};