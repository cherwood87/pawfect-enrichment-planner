
import { useState, useEffect, useCallback } from 'react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

export interface NetworkState {
  isOnline: boolean;
  isSupabaseConnected: boolean;
  lastChecked: Date | null;
  retryCount: number;
}

export const useNetworkResilience = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    isSupabaseConnected: true,
    lastChecked: null,
    retryCount: 0
  });

  const checkConnectivity = useCallback(async () => {
    const isOnline = navigator.onLine;
    let isSupabaseConnected = false;
    
    if (isOnline) {
      try {
        isSupabaseConnected = await checkSupabaseConnection();
      } catch (error) {
        console.warn('Network resilience check failed:', error);
        isSupabaseConnected = false;
      }
    }

    setNetworkState(prev => ({
      isOnline,
      isSupabaseConnected,
      lastChecked: new Date(),
      retryCount: isSupabaseConnected ? 0 : prev.retryCount + 1
    }));

    return { isOnline, isSupabaseConnected };
  }, []);

  const retryConnection = useCallback(async () => {
    console.log('🔄 Retrying network connection...');
    return await checkConnectivity();
  }, [checkConnectivity]);

  useEffect(() => {
    // Initial connectivity check
    checkConnectivity();

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('🌐 Network back online');
      checkConnectivity();
    };

    const handleOffline = () => {
      console.log('📵 Network went offline');
      setNetworkState(prev => ({
        ...prev,
        isOnline: false,
        isSupabaseConnected: false,
        lastChecked: new Date()
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check
    const interval = setInterval(() => {
      if (networkState.retryCount < 5) { // Limit retry attempts
        checkConnectivity();
      }
    }, 15000); // Check every 15 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnectivity, networkState.retryCount]);

  return {
    ...networkState,
    checkConnectivity,
    retryConnection
  };
};
