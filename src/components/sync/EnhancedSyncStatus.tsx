/**
 * Enhanced Sync Status Component
 * Displays the current status of enhanced sync systems
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSafeEnhancedSync } from '@/hooks/useSafeEnhancedSync';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const EnhancedSyncStatus = () => {
  const { status, forceSync, getSyncStats, isEnhanced } = useSafeEnhancedSync();

  if (!isEnhanced) {
    return (
      <Card className="border-muted bg-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
            Standard Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            Enhanced sync features not available. Using standard synchronization.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleForceSync = async () => {
    const result = await forceSync();
    if (result.success) {
      console.log('Manual sync completed successfully');
    }
  };

  const getStatusColor = () => {
    if (status.error) return 'destructive';
    if (status.isSyncing) return 'secondary';
    if (status.queuedOperations > 0) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (status.error) return <AlertCircle className="w-4 h-4" />;
    if (status.isSyncing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (status.queuedOperations > 0) return <Clock className="w-4 h-4" />;
    return <CheckCircle2 className="w-4 h-4" />;
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor()} className="flex items-center gap-1">
              {getStatusIcon()}
              Enhanced Sync
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {status.isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Queued Operations:</span>
            <div className="font-medium">{status.queuedOperations}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Conflicts:</span>
            <div className="font-medium">
              {status.hasConflicts ? (
                <Badge variant="destructive" className="text-xs">
                  Pending
                </Badge>
              ) : (
                'None'
              )}
            </div>
          </div>
        </div>

        {status.lastSyncTime && (
          <div className="text-xs text-muted-foreground">
            Last sync: {status.lastSyncTime.toLocaleTimeString()}
          </div>
        )}

        {status.error && (
          <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border">
            {status.error}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceSync}
            disabled={status.isSyncing || !status.isOnline}
            className="text-xs"
          >
            {status.isSyncing ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
            ) : (
              'Force Sync'
            )}
          </Button>
          
          {status.queuedOperations > 0 && (
            <Badge variant="secondary" className="text-xs">
              {status.queuedOperations} pending
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};