
import React, { useEffect, useState } from 'react';
import { useNetworkHealth } from '@/hooks/useNetworkHealth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, AlertCircle, CheckCircle, WifiOff, RefreshCw } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
  responseTime?: number;
  error?: string;
}

export const ServiceHealthMonitor: React.FC = () => {
  const networkHealth = useNetworkHealth();
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkServiceHealth = async () => {
    setIsChecking(true);
    
    const serviceChecks: ServiceStatus[] = [
      {
        name: 'Database Connection',
        status: networkHealth.isSupabaseConnected ? 'healthy' : 'down',
        lastCheck: networkHealth.lastChecked,
        responseTime: 0
      },
      {
        name: 'Network Connection',
        status: networkHealth.isOnline ? 'healthy' : 'down',
        lastCheck: networkHealth.lastChecked
      },
      {
        name: 'Authentication Service',
        status: 'healthy', // Will be enhanced with actual auth checks
        lastCheck: new Date()
      },
      {
        name: 'Cache Service',
        status: networkHealth.cacheStats.memoryEntries > 0 ? 'healthy' : 'degraded',
        lastCheck: new Date()
      }
    ];

    // Add connection stability assessment
    if (networkHealth.connectionStability < 0.5) {
      serviceChecks[0].status = 'degraded';
    }

    setServices(serviceChecks);
    setIsChecking(false);
  };

  useEffect(() => {
    checkServiceHealth();
    const interval = setInterval(checkServiceHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [networkHealth]);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'down':
        return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
    }
  };

  const overallStatus = services.length === 0 ? 'checking' : 
    services.some(s => s.status === 'down') ? 'down' :
    services.some(s => s.status === 'degraded') ? 'degraded' : 'healthy';

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            System Health
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkServiceHealth}
            disabled={isChecking}
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Status:</span>
          <Badge 
            variant={overallStatus === 'healthy' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
          </Badge>
        </div>

        {/* Service Details */}
        <div className="space-y-2">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <span>{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {service.responseTime && (
                  <span className="text-xs text-gray-500">
                    {service.responseTime}ms
                  </span>
                )}
                <div 
                  className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}
                  title={service.error || service.status}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Connection Stability */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Connection Stability:</span>
            <span>{Math.round(networkHealth.connectionStability * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{ width: `${networkHealth.connectionStability * 100}%` }}
            />
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center pt-2">
          Last checked: {networkHealth.lastChecked.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};
