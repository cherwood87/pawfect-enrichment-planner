import React, { useState, useMemo } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyImageGridProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  columns?: number;
  gap?: string;
  className?: string;
}

export const LazyImageGrid: React.FC<LazyImageGridProps> = ({
  images,
  columns = 3,
  gap = 'gap-4',
  className = ''
}) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [containerRef, entry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Load more images when container comes into view
  React.useEffect(() => {
    if (entry?.isIntersecting && visibleCount < images.length) {
      setVisibleCount(prev => Math.min(prev + 6, images.length));
    }
  }, [entry?.isIntersecting, visibleCount, images.length]);

  const visibleImages = useMemo(() => 
    images.slice(0, visibleCount), 
    [images, visibleCount]
  );

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }[columns] || 'grid-cols-3';

  return (
    <div className={`grid ${gridCols} ${gap} ${className}`}>
      {visibleImages.map((image, index) => (
        <div 
          key={`${image.src}-${index}`}
          ref={index === visibleImages.length - 1 ? containerRef as React.RefObject<HTMLDivElement> : undefined}
          className="relative aspect-square overflow-hidden rounded-lg"
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            width={image.width || 300}
            height={image.height || 300}
            lazy={index > 2} // First 3 images load immediately
          />
        </div>
      ))}
      
      {visibleCount < images.length && (
        <div className="col-span-full flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImageGrid;