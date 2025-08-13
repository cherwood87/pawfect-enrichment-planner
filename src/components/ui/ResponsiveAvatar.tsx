import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { OptimizedImage } from './OptimizedImage';
import { cn } from '@/lib/utils';

interface ResponsiveAvatarProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  priority?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

export const ResponsiveAvatar: React.FC<ResponsiveAvatarProps> = ({
  src,
  alt,
  fallback,
  className,
  size = 'md',
  priority = false
}) => {
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src ? (
        <OptimizedImage
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          priority={priority}
          lazy={!priority}
          width={size === 'xl' ? 80 : size === 'lg' ? 64 : size === 'md' ? 48 : 32}
          height={size === 'xl' ? 80 : size === 'lg' ? 64 : size === 'md' ? 48 : 32}
        />
      ) : (
        <AvatarFallback className="text-lg font-semibold">
          {fallback || alt.charAt(0)?.toUpperCase() || '🐾'}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default ResponsiveAvatar;