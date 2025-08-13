/**
 * Enhanced Error Boundary for React Components
 * Provides comprehensive error handling with retry mechanisms and user-friendly fallbacks
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showRetry?: boolean;
  showHomeButton?: boolean;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
  retryCount: number;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private readonly maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, context } = this.props;
    
    // Log error with context
    console.error(`[ErrorBoundary${context ? ` - ${context}` : ''}]:`, {
      error,
      errorInfo,
      errorId: this.state.errorId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });

    // Call custom error handler
    onError?.(error, errorInfo);

    // Report to error tracking service (if available)
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // You can integrate with error tracking services like Sentry, LogRocket, etc.
    try {
      // Example: Send to analytics or error tracking
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        context: this.props.context,
        timestamp: Date.now()
      };

      // Store locally for now (could be sent to external service)
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(errorData);
      
      // Keep only last 50 errors
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      
      localStorage.setItem('app_errors', JSON.stringify(existingErrors));
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorId: '',
        retryCount: retryCount + 1
      });
    }
  };

  private handleHome = () => {
    window.location.href = '/';
  };

  private getErrorSeverity = (error: Error): 'low' | 'medium' | 'high' => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'low';
    }
    
    if (message.includes('chunk') || message.includes('loading')) {
      return 'medium';
    }
    
    return 'high';
  };

  private getErrorAdvice = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Please check your internet connection and try again.';
    }
    
    if (message.includes('chunk') || message.includes('loading')) {
      return 'There was a problem loading part of the app. Refreshing should fix this.';
    }
    
    if (message.includes('memory') || message.includes('quota')) {
      return 'Your device may be low on memory. Try closing other tabs and refreshing.';
    }
    
    return 'Something unexpected happened. Our team has been notified.';
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, showRetry = true, showHomeButton = true } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      const severity = this.getErrorSeverity(error);
      const advice = this.getErrorAdvice(error);
      const canRetry = retryCount < this.maxRetries && showRetry;

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">
                {severity === 'high' ? 'Something went wrong' : 'Temporary issue'}
              </CardTitle>
              <CardDescription>
                {advice}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {severity !== 'low' && (
                <details className="bg-muted p-3 rounded-md">
                  <summary className="cursor-pointer text-sm font-medium">
                    Technical details
                  </summary>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p><strong>Error:</strong> {error.message}</p>
                    <p><strong>ID:</strong> {this.state.errorId}</p>
                    {retryCount > 0 && (
                      <p><strong>Retry attempts:</strong> {retryCount}</p>
                    )}
                  </div>
                </details>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
              {canRetry && (
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again {retryCount > 0 && `(${this.maxRetries - retryCount} left)`}
                </Button>
              )}
              
              {showHomeButton && (
                <Button 
                  onClick={this.handleHome}
                  variant="outline"
                  className={canRetry ? "flex-1" : "w-full"}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
