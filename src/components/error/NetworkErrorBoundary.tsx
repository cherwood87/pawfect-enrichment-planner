
import React, { ReactNode } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRetry } from '@/hooks/useRetry';

interface NetworkErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => Promise<void>;
}

const NetworkErrorBoundary: React.FC<NetworkErrorBoundaryProps> = ({
  children,
  onRetry
}) => {
  const { retry, isRetrying } = useRetry({
    maxAttempts: 3,
    delay: 2000,
    backoff: true
  });

  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    if (onRetry) {
      await retry(onRetry);
    } else {
      window.location.reload();
    }
  };

  if (showOfflineMessage || !isOnline) {
    return (
      <div className="min-h-[200px] flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You're currently offline. Please check your internet connection.
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button 
              onClick={handleRetry}
              variant="outline"
              disabled={isRetrying}
            >
              {isRetrying ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wifi className="w-4 h-4 mr-2" />
              )}
              {isRetrying ? 'Checking...' : 'Check Connection'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkErrorBoundary;
