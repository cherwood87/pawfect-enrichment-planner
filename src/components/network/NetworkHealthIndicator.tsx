
import React, { useState, useEffect } from 'react';
import { useNetworkResilience } from '@/hooks/useNetworkResilience';
import { EnhancedSupabaseAdapter } from '@/services/integration/EnhancedSupabaseAdapter';
import { CircuitBreakerState } from '@/services/network/RetryService';
import { CacheService } from '@/services/network/CacheService';
import { AlertCircle, Wifi, WifiOff, Activity, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const NetworkHealthIndicator: React.FC = () => {
  const { isOnline, isSupabaseConnected } = useNetworkResilience();
  const [circuitBreakerStates, setCircuitBreakerStates] = useState<any>({});
  const [cacheStats, setCacheStats] = useState<any>({});

  useEffect(() => {
    const interval = setInterval(() => {
      // Update circuit breaker states
      setCircuitBreakerStates(EnhancedSupabaseAdapter.getNetworkHealth());
      
      // Update cache stats
      setCacheStats(CacheService.getCacheStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCircuitBreakerColor = (state: CircuitBreakerState | null) => {
    switch (state) {
      case CircuitBreakerState.CLOSED: return 'bg-green-500';
      case CircuitBreakerState.HALF_OPEN: return 'bg-yellow-500';
      case CircuitBreakerState.OPEN: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCircuitBreakerText = (state: CircuitBreakerState | null) => {
    switch (state) {
      case CircuitBreakerState.CLOSED: return 'Healthy';
      case CircuitBreakerState.HALF_OPEN: return 'Testing';
      case CircuitBreakerState.OPEN: return 'Failed';
      default: return 'Unknown';
    }
  };

  if (!isOnline) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm text-red-700">
            <WifiOff className="w-4 h-4 mr-2" />
            Offline Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-red-600">Using cached data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-sm">
          <Activity className="w-4 h-4 mr-2" />
          Network Health
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Connection:</span>
          <Badge variant={isSupabaseConnected ? "default" : "destructive"} className="text-xs">
            {isSupabaseConnected ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </div>

        {/* Circuit Breaker Status */}
        <div className="space-y-1">
          <div className="text-xs text-gray-600">Circuit Breakers:</div>
          {Object.entries(circuitBreakerStates).map(([service, state]) => (
            <div key={service} className="flex items-center justify-between">
              <span className="text-xs capitalize">{service}:</span>
              <Badge variant="outline" className="text-xs">
                <div className={`w-2 h-2 rounded-full mr-1 ${getCircuitBreakerColor(state as CircuitBreakerState)}`} />
                {getCircuitBreakerText(state as CircuitBreakerState)}
              </Badge>
            </div>
          ))}
        </div>

        {/* Cache Stats */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Cache:</span>
          <Badge variant="outline" className="text-xs">
            <Database className="w-3 h-3 mr-1" />
            {cacheStats.memoryEntries || 0} items
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
