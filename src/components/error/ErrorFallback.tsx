
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
  showHomeButton?: boolean;
  customMessage?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  showHomeButton = true,
  customMessage
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/app');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {customMessage || 'Something went wrong'}
          </AlertDescription>
        </Alert>
        
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            {error.message || 'An unexpected error occurred'}
          </p>
          
          <div className="flex gap-2 justify-center flex-wrap">
            {resetError && (
              <Button 
                onClick={resetError}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            
            <Button 
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
            
            {showHomeButton && (
              <Button 
                onClick={handleGoHome}
                variant="default"
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
