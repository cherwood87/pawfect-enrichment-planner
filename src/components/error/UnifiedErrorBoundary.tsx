import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Wifi, WifiOff } from 'lucide-react';
import { logger } from '@/utils/logger';
import { getUserFriendlyMessage } from '@/utils/errorUtils';

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
  isNetworkError: boolean;
}

class UnifiedErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
      retryCount: 0,
      isNetworkError: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const isNetworkError = error.message.includes('network') ||
                          error.message.includes('fetch') ||
                          error.message.includes('NetworkError') ||
                          error.message.includes('ERR_NETWORK') ||
                          error.message.includes('ERR_INTERNET_DISCONNECTED') ||
                          error.name === 'NetworkError';

    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isNetworkError
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { context, onError } = this.props;
    
    logger.error(`Error boundary caught error${context ? ` in ${context}` : ''}`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });

    if (onError) {
      onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private handleRetry = () => {
    const { retryCount } = this.state;
    if (retryCount >= 3) {
      logger.warn('Maximum retry attempts reached', { retryCount });
      return;
    }

    logger.info('Retrying after error', { retryCount: retryCount + 1 });
    
    // Exponential backoff for network errors
    const delay = this.state.isNetworkError ? Math.pow(2, retryCount) * 1000 : 0;
    
    this.retryTimeout = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorId: '',
        retryCount: prevState.retryCount + 1,
        isNetworkError: false
      }));
    }, delay);
  };

  private handleReset = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    
    this.setState({
      hasError: false,
      error: null,
      errorId: '',
      retryCount: 0,
      isNetworkError: false
    });
  };

  private handleHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private getErrorSeverity(error: Error): 'low' | 'medium' | 'high' {
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'low';
    }
    if (this.state.isNetworkError) {
      return 'medium';
    }
    return 'high';
  }

  private getErrorAdvice(error: Error): string {
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'This usually happens after an app update. Please refresh the page.';
    }
    if (this.state.isNetworkError) {
      return 'Please check your internet connection and try again.';
    }
    if (error.message.includes('localStorage')) {
      return 'Your browser storage might be full. Try clearing your browser data.';
    }
    return 'If this problem persists, please contact support.';
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback, showRetry = true, showHomeButton = true } = this.props;
      const { error, retryCount, isNetworkError } = this.state;

      if (fallback) {
        return fallback;
      }

      const severity = this.getErrorSeverity(error);
      const advice = this.getErrorAdvice(error);
      const userFriendlyMessage = getUserFriendlyMessage(error);
      const canRetry = retryCount < 3 && showRetry;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-red-100">
                {isNetworkError ? (
                  <WifiOff className="w-8 h-8 text-red-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <CardTitle className="text-xl text-red-800">
                {isNetworkError ? 'Connection Problem' : 'Something Went Wrong'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {userFriendlyMessage}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">What can you do?</p>
                <p>{advice}</p>
              </div>

              <div className="flex flex-col space-y-2">
                {canRetry && (
                  <Button
                    onClick={this.handleRetry}
                    variant="default"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again {retryCount > 0 && `(${retryCount}/3)`}
                  </Button>
                )}
                
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
                
                {showHomeButton && (
                  <Button
                    onClick={this.handleHome}
                    variant="ghost"
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                )}
              </div>

              {import.meta.env.DEV && (
                <details className="mt-4">
                  <summary className="text-xs text-gray-400 cursor-pointer">
                    Technical Details (Development)
                  </summary>
                  <pre className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <UnifiedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </UnifiedErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default UnifiedErrorBoundary;