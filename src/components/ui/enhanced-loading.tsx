/**
 * Enhanced Loading States Component
 * Provides comprehensive loading indicators with context-aware messaging and mobile optimization
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Wifi, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'progress' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  description?: string;
  progress?: number; // 0-100 for progress type
  className?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  context?: 'page' | 'modal' | 'inline' | 'overlay';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'md',
  message = 'Loading...',
  description,
  progress,
  className,
  showRetry = false,
  onRetry,
  context = 'inline'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const containerClasses = {
    page: 'min-h-screen flex items-center justify-center p-4',
    modal: 'flex items-center justify-center p-8',
    inline: 'flex items-center gap-2 p-2',
    overlay: 'absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50'
  };

  const renderSpinner = () => (
    <Loader2 className={cn('animate-spin', sizeClasses[size])} />
  );

  const renderSkeleton = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
    </div>
  );

  const renderProgress = () => (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span>{message}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-primary animate-bounce',
            size === 'sm' ? 'h-1 w-1' : size === 'lg' ? 'h-3 w-3' : 'h-2 w-2'
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        ></div>
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={cn(
      'rounded-full bg-primary/20 animate-ping',
      sizeClasses[size]
    )}>
      <div className={cn(
        'rounded-full bg-primary animate-pulse',
        sizeClasses[size]
      )}></div>
    </div>
  );

  const renderLoadingIndicator = () => {
    switch (type) {
      case 'skeleton':
        return renderSkeleton();
      case 'progress':
        return renderProgress();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center gap-3 text-center',
      context === 'inline' && 'flex-row text-left',
      className
    )}>
      {type !== 'progress' && type !== 'skeleton' && renderLoadingIndicator()}
      
      <div className="space-y-1">
        {(message || type === 'progress') && (
          <div className="text-sm font-medium">
            {type === 'progress' ? renderLoadingIndicator() : message}
          </div>
        )}
        
        {description && (
          <div className="text-xs text-muted-foreground max-w-sm">
            {description}
          </div>
        )}
      </div>
      
      {showRetry && onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2"
        >
          Try Again
        </Button>
      )}
    </div>
  );

  if (context === 'page') {
    return (
      <div className={containerClasses[context]}>
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn(containerClasses[context], className)}>
      {content}
    </div>
  );
};

// Specialized loading components
export const PageLoader: React.FC<Omit<LoadingStateProps, 'context'>> = (props) => (
  <LoadingState {...props} context="page" />
);

export const ModalLoader: React.FC<Omit<LoadingStateProps, 'context'>> = (props) => (
  <LoadingState {...props} context="modal" />
);

export const InlineLoader: React.FC<Omit<LoadingStateProps, 'context'>> = (props) => (
  <LoadingState {...props} context="inline" />
);

export const OverlayLoader: React.FC<Omit<LoadingStateProps, 'context'>> = (props) => (
  <LoadingState {...props} context="overlay" />
);

// Network-aware loading states
export interface NetworkLoadingStateProps extends Omit<LoadingStateProps, 'message' | 'description'> {
  isOnline?: boolean;
  isRetrying?: boolean;
  retryCount?: number;
  maxRetries?: number;
}

export const NetworkLoadingState: React.FC<NetworkLoadingStateProps> = ({
  isOnline = true,
  isRetrying = false,
  retryCount = 0,
  maxRetries = 3,
  showRetry = true,
  onRetry,
  ...props
}) => {
  const getMessage = () => {
    if (!isOnline) return 'No internet connection';
    if (isRetrying) return `Retrying... (${retryCount}/${maxRetries})`;
    return 'Loading...';
  };

  const getDescription = () => {
    if (!isOnline) return 'Please check your internet connection and try again.';
    if (isRetrying) return 'Having trouble connecting. Retrying automatically.';
    return 'Please wait while we load your content.';
  };

  const getIcon = () => {
    if (!isOnline) return <Wifi className="h-6 w-6 text-muted-foreground" />;
    if (isRetrying) return <AlertCircle className="h-6 w-6 text-warning" />;
    return <Loader2 className="h-6 w-6 animate-spin" />;
  };

  return (
    <div className="flex flex-col items-center gap-3 text-center p-6">
      {getIcon()}
      <div className="space-y-1">
        <div className="text-sm font-medium">{getMessage()}</div>
        <div className="text-xs text-muted-foreground max-w-sm">
          {getDescription()}
        </div>
      </div>
      
      {showRetry && onRetry && (!isOnline || (retryCount >= maxRetries)) && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

// Success state component
export interface SuccessStateProps {
  message?: string;
  description?: string;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  message = 'Success!',
  description,
  showAction = false,
  actionLabel = 'Continue',
  onAction,
  className
}) => (
  <div className={cn('flex flex-col items-center gap-3 text-center p-6', className)}>
    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
      <CheckCircle2 className="h-6 w-6 text-success" />
    </div>
    
    <div className="space-y-1">
      <div className="text-sm font-medium">{message}</div>
      {description && (
        <div className="text-xs text-muted-foreground max-w-sm">
          {description}
        </div>
      )}
    </div>
    
    {showAction && onAction && (
      <Button
        onClick={onAction}
        className="mt-2"
      >
        {actionLabel}
      </Button>
    )}
  </div>
);