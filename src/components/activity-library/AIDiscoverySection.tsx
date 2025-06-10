
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';

interface AIDiscoverySectionProps {
  autoApprovedCount: number;
  curatedCount: number;
  isDiscovering: boolean;
  onDiscoverMore: () => Promise<void>;
  onManualSync?: () => Promise<void>;
  isSyncing?: boolean;
  lastSyncTime?: Date | null;
}

const AIDiscoverySection: React.FC<AIDiscoverySectionProps> = ({
  autoApprovedCount,
  curatedCount,
  isDiscovering,
  onDiscoverMore,
  onManualSync,
  isSyncing = false,
  lastSyncTime
}) => {
  const formatLastSyncTime = (date: Date | null) => {
    if (!date) return 'Never';
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const handleDiscoverMore = async () => {
    if (!isDiscovering) {
      await onDiscoverMore();
    }
  };

  const handleManualSync = async () => {
    if (!isSyncing && onManualSync) {
      await onManualSync();
    }
  };

  return (
    <div className="modern-card bg-gradient-to-r from-purple-50 via-cyan-50 to-amber-50 border-2 border-purple-200">
      <div className="mobile-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">AI-Discovered Activities</h3>
              <p className="text-sm text-purple-600">
                {autoApprovedCount} activities auto-approved • {curatedCount} curated activities
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onManualSync && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="modern-button-outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync'}
              </Button>
            )}
            <Button 
              onClick={handleDiscoverMore}
              disabled={isDiscovering}
              className="modern-button"
            >
              <Sparkles className={`w-4 h-4 mr-2 ${isDiscovering ? 'animate-spin' : ''}`} />
              {isDiscovering ? 'Discovering...' : 'Discover More'}
            </Button>
          </div>
        </div>
        
        {lastSyncTime && (
          <div className="mt-3 text-xs text-purple-600">
            Last sync: {formatLastSyncTime(lastSyncTime)}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AIDiscoverySection);
