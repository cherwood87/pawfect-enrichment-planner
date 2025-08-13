import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { optimizedLog } from '@/utils/performanceOptimization';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  lazy?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  quality?: number;
}

// Generate responsive image sources
const generateResponsiveSources = (src: string, width?: number, height?: number) => {
  if (!src.includes('lovable-uploads')) return src;
  
  const baseUrl = src.split('?')[0];
  const sizes = [400, 800, 1200];
  
  return sizes.map(size => {
    const params = new URLSearchParams();
    if (width && height) {
      params.set('w', Math.min(size, width).toString());
      params.set('h', Math.round((Math.min(size, width) / width) * height).toString());
    } else {
      params.set('w', size.toString());
    }
    params.set('f', 'webp');
    params.set('q', '85');
    
    return `${baseUrl}?${params.toString()} ${size}w`;
  }).join(', ');
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  className,
  lazy = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  width,
  height,
  quality = 85,
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
        rootMargin: '50px',
        threshold: 0.1
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
    
    // Set up responsive sources if available
    const responsiveSrc = generateResponsiveSources(src, width, height);
    if (responsiveSrc !== src) {
      img.srcset = responsiveSrc;
      img.sizes = sizes;
    }
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };
    
    img.onerror = () => {
      optimizedLog.warn('Image failed to load', { src, alt });
      setImageSrc(fallbackSrc);
      setIsLoading(false);
      setHasError(true);
    };
    
    img.src = src;
  }, [isInView, src, fallbackSrc, alt, width, height, sizes]);

  const handleError = () => {
    if (!hasError) {
      optimizedLog.warn('Image error handled', { src, alt });
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
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        width={width}
        height={height}
        sizes={lazy ? sizes : undefined}
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

export default OptimizedImage;