import { useNetworkHealth } from "@/hooks/useNetworkHealth";

/**
 * @deprecated Use useNetworkHealth instead for better performance and consolidated monitoring
 * This hook is maintained for backwards compatibility only
 */
export const useNetworkResilience = (options?: any) => {
  console.warn(
    "useNetworkResilience is deprecated. Please use useNetworkHealth instead.",
  );

  const healthState = useNetworkHealth();

  // Map new API to old API for backwards compatibility
  return {
    ...healthState,
    checkConnectivity: async () => {
      const result = await healthState.retryConnection();
      return {
        isOnline: healthState.isOnline,
        isSupabaseConnected: result,
      };
    },
    networkState: {
      isOnline: healthState.isOnline,
      isSupabaseConnected: healthState.isSupabaseConnected,
      lastChecked: healthState.lastChecked,
      retryCount: 0, // Not tracked in new system
      connectionHistory: healthState.connectionHistory,
    },
  };
};

// Re-export types for compatibility
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
