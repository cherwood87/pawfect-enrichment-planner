import React, { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  fallback = '/placeholder.svg',
  loading = 'lazy'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  const isVisible = entry?.isIntersecting;
  const shouldLoad = loading === 'eager' || isVisible;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={`relative ${className}`}>
      {shouldLoad && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      )}
      {!isLoaded && (
        <div className={`absolute inset-0 bg-muted animate-pulse ${className}`} />
      )}
    </div>
  );
};