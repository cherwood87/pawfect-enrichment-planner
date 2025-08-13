import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  lazy?: boolean;
  quality?: number;
  priority?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  className,
  lazy = true,
  quality = 80,
  priority = false,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(priority ? src : fallbackSrc);
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(!lazy || priority);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  // Load the actual image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      logger.warn('Image failed to load', { src, alt });
      setImageSrc(fallbackSrc);
      setIsLoading(false);
      setHasError(true);
    };
    img.src = src;
  }, [isInView, src, fallbackSrc, alt]);

  const handleError = () => {
    if (!hasError) {
      logger.warn('Image error handled', { src, alt });
      setImageSrc(fallbackSrc);
      setHasError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        loading={lazy ? 'lazy' : 'eager'}
        {...props}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;