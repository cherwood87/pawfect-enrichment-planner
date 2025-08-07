
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isNetworkError: boolean;
}

class NetworkErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isNetworkError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const isNetworkError = error.message.includes('network') || 
                          error.message.includes('fetch') ||
                          error.message.includes('connection');
    
    return { hasError: true, isNetworkError };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Network error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.isNetworkError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Network Error</h2>
            <p className="text-gray-600 mb-4">
              Unable to connect to our servers. Please check your internet connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NetworkErrorBoundary;
