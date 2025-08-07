
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface SyncButtonProps {
  onSync: () => void;
  isSyncing: boolean;
  lastSyncTime?: Date | null;
  className?: string;
}

const SyncButton: React.FC<SyncButtonProps> = ({
  onSync,
  isSyncing,
  lastSyncTime,
  className
}) => {
  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        onClick={onSync}
        disabled={isSyncing}
        variant="outline"
        size="sm"
        className={className}
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing...' : 'Sync to Supabase'}
      </Button>
      
      {lastSyncTime && !isSyncing && (
        <p className="text-xs text-gray-500">
          Last sync: {formatLastSync(lastSyncTime)}
        </p>
      )}
    </div>
  );
};

export default SyncButton;
