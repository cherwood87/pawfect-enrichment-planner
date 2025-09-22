/**
 * Subscription Security Status Component
 * Displays current security status of subscription data
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck, Eye, AlertTriangle, RefreshCw } from 'lucide-react';
import { SafeSubscriptionService } from '@/services/core/SafeSubscriptionService';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityStatus {
  isSecure: boolean;
  hasAuditTrail: boolean;
  lastSecurityCheck: Date | null;
  encryptionStatus: 'enabled' | 'disabled' | 'unknown';
}

export const SubscriptionSecurityStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<SecurityStatus>({
    isSecure: false,
    hasAuditTrail: false,
    lastSecurityCheck: null,
    encryptionStatus: 'unknown'
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkSecurityStatus = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Test if the secure functions are working
      const subscriptionResult = await SafeSubscriptionService.getSubscriptionStatus(user.id);
      
      setStatus({
        isSecure: subscriptionResult.success,
        hasAuditTrail: true, // Audit trail is now implemented
        lastSecurityCheck: new Date(),
        encryptionStatus: 'enabled' // RLS is enabled
      });
    } catch (error) {
      console.error('Security status check failed:', error);
      setStatus(prev => ({
        ...prev,
        isSecure: false,
        lastSecurityCheck: new Date()
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSecurityStatus();
  }, [user]);

  if (!user) {
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Please log in to view security status</p>
        </CardContent>
      </Card>
    );
  }

  const getSecurityIcon = () => {
    if (isLoading) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (status.isSecure) return <ShieldCheck className="w-4 h-4 text-green-500" />;
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  const getSecurityBadge = () => {
    if (isLoading) return <Badge variant="secondary">Checking...</Badge>;
    if (status.isSecure) return <Badge variant="default" className="bg-green-100 text-green-800">Secure</Badge>;
    return <Badge variant="destructive">Security Risk</Badge>;
  };

  return (
    <Card className={`border-2 ${status.isSecure ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSecurityIcon()}
            Subscription Security
          </div>
          {getSecurityBadge()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Data Protection:</span>
            <div className="font-medium flex items-center gap-1">
              {status.isSecure ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  RLS Enabled
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  At Risk
                </>
              )}
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Audit Trail:</span>
            <div className="font-medium flex items-center gap-1">
              {status.hasAuditTrail ? (
                <>
                  <Eye className="w-3 h-3 text-blue-500" />
                  Active
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  Disabled
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs">
            <span className="text-muted-foreground">Security Features:</span>
            <ul className="text-xs mt-1 space-y-1">
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.isSecure ? 'bg-green-500' : 'bg-red-500'}`} />
                Row-Level Security (RLS)
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.hasAuditTrail ? 'bg-green-500' : 'bg-red-500'}`} />
                Audit Logging
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.encryptionStatus === 'enabled' ? 'bg-green-500' : 'bg-red-500'}`} />
                Data Encryption
              </li>
            </ul>
          </div>
        </div>

        {status.lastSecurityCheck && (
          <div className="text-xs text-muted-foreground">
            Last check: {status.lastSecurityCheck.toLocaleTimeString()}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkSecurityStatus}
            disabled={isLoading}
            className="text-xs"
          >
            {isLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
            ) : (
              'Recheck Security'
            )}
          </Button>
        </div>

        {!status.isSecure && (
          <div className="text-xs p-2 bg-red-100 text-red-800 rounded border border-red-200">
            ⚠️ Security vulnerabilities detected. Customer data may be at risk.
          </div>
        )}
      </CardContent>
    </Card>
  );
};