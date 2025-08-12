import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { ActivitySyncService } from '@/services/ActivitySyncService';
import { useToast } from '@/components/ui/use-toast';

export const ActivitySyncManager: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleSyncCuratedActivities = async () => {
    setIsSyncing(true);
    try {
      const result = await ActivitySyncService.syncCuratedActivities();
      
      if (result.success) {
        setLastSyncTime(new Date());
        toast({
          title: "Sync Complete",
          description: `Successfully synced ${result.synced} curated activities to database.`,
        });
      } else {
        toast({
          title: "Sync Failed",
          description: result.error || "Failed to sync activities.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during sync.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

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
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Activity Library Sync</h3>
            <p className="text-sm text-muted-foreground">
              Sync curated activities to the database to make them available in activity feeds
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {lastSyncTime && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                <span>Last sync: {formatLastSync(lastSyncTime)}</span>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleSyncCuratedActivities}
          disabled={isSyncing}
          className="w-full"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing Activities...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Curated Activities
            </>
          )}
        </Button>
        
        <div className="text-sm text-muted-foreground">
          <AlertCircle className="inline h-4 w-4 mr-1" />
          This will sync all 36 curated activities from the static library to the database.
        </div>
      </div>
    </Card>
  );
};