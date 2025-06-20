
import { useState, useEffect, useCallback, useRef } from 'react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

export interface NetworkState {
  isOnline: boolean;
  isSupabaseConnected: boolean;
  lastChecked: Date | null;
  retryCount: number;
  connectionHistory: boolean[];
}

export interface ConnectionRecoveryOptions {
  maxRetries?: number;
  retryInterval?: number;
  exponentialBackoff?: boolean;
}

export const useNetworkResilience = (options: ConnectionRecoveryOptions = {}) => {
  const {
    maxRetries = 3,
    retryInterval = 15000, // Reduced from 30s to 15s
    exponentialBackoff = true
  } = options;

  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    isSupabaseConnected: true,
    lastChecked: null,
    retryCount: 0,
    connectionHistory: []
  });

  const [isRecovering, setIsRecovering] = useState(false);
  const recoveryTimeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const updateConnectionHistory = useCallback((connected: boolean) => {
    setNetworkState(prev => ({
      ...prev,
      connectionHistory: [...prev.connectionHistory.slice(-9), connected] // Keep last 10 checks
    }));
  }, []);

  const checkConnectivity = useCallback(async () => {
    const isOnline = navigator.onLine;
    let isSupabaseConnected = false;
    
    if (isOnline) {
      try {
        isSupabaseConnected = await checkSupabaseConnection();
        updateConnectionHistory(isSupabaseConnected);
      } catch (error) {
        console.warn('🌐 Network resilience check failed:', error);
        isSupabaseConnected = false;
        updateConnectionHistory(false);
      }
    } else {
      updateConnectionHistory(false);
    }

    setNetworkState(prev => ({
      ...prev,
      isOnline,
      isSupabaseConnected,
      lastChecked: new Date(),
      retryCount: isSupabaseConnected ? 0 : Math.min(prev.retryCount + 1, maxRetries)
    }));

    return { isOnline, isSupabaseConnected };
  }, [maxRetries, updateConnectionHistory]);

  const initiateRecovery = useCallback(async () => {
    if (isRecovering || networkState.retryCount >= maxRetries) {
      return false;
    }

    setIsRecovering(true);
    console.log('🔄 Initiating connection recovery...');

    try {
      const result = await checkConnectivity();
      
      if (!result.isSupabaseConnected) {
        // Schedule next recovery attempt with exponential backoff
        const delay = exponentialBackoff 
          ? retryInterval * Math.pow(2, networkState.retryCount)
          : retryInterval;
        
        recoveryTimeoutRef.current = setTimeout(() => {
          if (networkState.retryCount < maxRetries) {
            initiateRecovery();
          }
        }, Math.min(delay, 120000)); // Max 2 minutes instead of 5
      } else {
        console.log('✅ Connection recovery successful');
      }
      
      return result.isSupabaseConnected;
    } catch (error) {
      console.error('❌ Recovery attempt failed:', error);
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, [isRecovering, networkState.retryCount, maxRetries, exponentialBackoff, retryInterval, checkConnectivity]);

  const retryConnection = useCallback(async () => {
    console.log('🔄 Manual retry requested...');
    setNetworkState(prev => ({ ...prev, retryCount: 0 })); // Reset retry count for manual retry
    return await initiateRecovery();
  }, [initiateRecovery]);

  const getConnectionStability = useCallback(() => {
    const history = networkState.connectionHistory;
    if (history.length === 0) return 1;
    
    const successfulConnections = history.filter(Boolean).length;
    return successfulConnections / history.length;
  }, [networkState.connectionHistory]);

  useEffect(() => {
    // Initial connectivity check with debounce
    const initialCheckTimeout = setTimeout(checkConnectivity, 100);

    // Network event handlers
    const handleOnline = () => {
      console.log('🌐 Network back online');
      setTimeout(checkConnectivity, 500); // Small delay to ensure connection is stable
    };

    const handleOffline = () => {
      console.log('📵 Network went offline');
      setNetworkState(prev => ({
        ...prev,
        isOnline: false,
        isSupabaseConnected: false,
        lastChecked: new Date()
      }));
      updateConnectionHistory(false);
    };

    // Browser visibility change handler for reconnection
    const handleVisibilityChange = () => {
      if (!document.hidden && navigator.onLine) {
        console.log('👁️ App became visible, checking connection');
        setTimeout(checkConnectivity, 300);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // More frequent but less aggressive connectivity checks
    intervalRef.current = setInterval(() => {
      if (networkState.retryCount < maxRetries && navigator.onLine) {
        checkConnectivity();
      }
    }, retryInterval);

    // Auto-recovery for failed connections with shorter delays
    if (!networkState.isSupabaseConnected && networkState.retryCount < maxRetries && !isRecovering) {
      const recoveryDelay = exponentialBackoff 
        ? 3000 * Math.pow(1.5, networkState.retryCount) // Less aggressive backoff
        : 3000;
      
      recoveryTimeoutRef.current = setTimeout(initiateRecovery, Math.min(recoveryDelay, 30000));
    }

    return () => {
      clearTimeout(initialCheckTimeout);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current);
      }
    };
  }, [checkConnectivity, networkState.retryCount, maxRetries, isRecovering, exponentialBackoff, retryInterval, initiateRecovery, updateConnectionHistory]);

  return {
    ...networkState,
    checkConnectivity,
    retryConnection,
    initiateRecovery,
    isRecovering,
    connectionStability: getConnectionStability(),
    canRetry: networkState.retryCount < maxRetries
  };
};
