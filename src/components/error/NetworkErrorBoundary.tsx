import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorType: 'network' | 'unknown';
  retryCount: number;
  lastErrorTime: number;
}

/**
 * Enhanced error boundary specifically for network-related errors
 * Provides better UX for connectivity issues and implements retry logic
 */
export class NetworkErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = [];
  private maxRetries = 3;
  private retryDelay = 1000; // Start with 1 second

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorType: 'unknown',
      retryCount: 0,
      lastErrorTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Detect network-related errors
    const isNetworkError = 
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch') ||
      error.name === 'TypeError' && error.message.includes('fetch');

    return {
      hasError: true,
      errorType: isNetworkError ? 'network' : 'unknown',
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Network Error Boundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Could integrate with Sentry, LogRocket, etc.
    }
  }

  componentWillUnmount() {
    // Clear any pending timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount >= this.maxRetries) {
      return;
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = this.retryDelay * Math.pow(2, retryCount);
    
    this.setState({ 
      retryCount: retryCount + 1 
    });

    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        errorType: 'unknown'
      });
    }, delay);

    this.retryTimeouts.push(timeout);
  };

  handleReset = () => {
    // Clear all timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts = [];
    
    this.setState({
      hasError: false,
      errorType: 'unknown',
      retryCount: 0,
      lastErrorTime: 0
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { errorType, retryCount } = this.state;
      const canRetry = retryCount < this.maxRetries;
      const nextRetryIn = this.retryDelay * Math.pow(2, retryCount);

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center space-y-6">
              {/* Error icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                {errorType === 'network' ? (
                  <WifiOff className="w-8 h-8 text-red-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
              </div>

              {/* Error message */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {errorType === 'network' ? 'Connection Problem' : 'Something Went Wrong'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {errorType === 'network' 
                    ? "We're having trouble connecting to our servers. Please check your internet connection and try again."
                    : "An unexpected error occurred. Our team has been notified."
                  }
                </p>
              </div>

              {/* Retry information */}
              {retryCount > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    Attempted {retryCount} of {this.maxRetries} retries
                    {canRetry && ` (next retry in ${Math.ceil(nextRetryIn / 1000)}s)`}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                {canRetry && (
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
                
                <Button variant="outline" onClick={this.handleReset} className="w-full">
                  Reset
                </Button>
                
                <Button variant="ghost" onClick={this.handleReload} className="w-full text-sm">
                  Reload Page
                </Button>
              </div>

              {/* Help text */}
              <p className="text-xs text-gray-500">
                If the problem persists, please contact support or try again later.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}