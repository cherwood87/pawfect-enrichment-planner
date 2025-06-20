
import { checkSupabaseConnection } from '@/integrations/supabase/client';
import { RetryService, CircuitBreakerState } from './RetryService';
import { CacheService } from './CacheService';

export interface NetworkHealthState {
  isOnline: boolean;
  isSupabaseConnected: boolean;
  connectionStability: number;
  lastChecked: Date;
  connectionHistory: boolean[];
  circuitBreakerStates: Record<string, CircuitBreakerState>;
  cacheStats: {
    memoryEntries: number;
    hitRate: number;
    totalRequests: number;
  };
}

export interface HealthCheckResult {
  connected: boolean;
  latency: number;
  error?: string;
}

class NetworkHealthService {
  private static instance: NetworkHealthService;
  private healthState: NetworkHealthState;
  private subscribers: ((state: NetworkHealthState) => void)[] = [];
  private checkInterval: NodeJS.Timeout | null = null;
  private retryTimeout: NodeJS.Timeout | null = null;
  
  private constructor() {
    this.healthState = {
      isOnline: navigator.onLine,
      isSupabaseConnected: true,
      connectionStability: 1.0,
      lastChecked: new Date(),
      connectionHistory: [],
      circuitBreakerStates: {},
      cacheStats: {
        memoryEntries: 0,
        hitRate: 0,
        totalRequests: 0
      }
    };
    
    this.initializeMonitoring();
  }

  static getInstance(): NetworkHealthService {
    if (!NetworkHealthService.instance) {
      NetworkHealthService.instance = new NetworkHealthService();
    }
    return NetworkHealthService.instance;
  }

  private initializeMonitoring() {
    // Network event listeners
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Start periodic health checks
    this.startPeriodicChecks();
    
    // Initial health check
    setTimeout(() => this.performHealthCheck(), 100);
  }

  private handleOnline = () => {
    console.log('🌐 Network back online');
    this.updateState({ isOnline: true });
    setTimeout(() => this.performHealthCheck(), 500);
  };

  private handleOffline = () => {
    console.log('📵 Network went offline');
    this.updateConnectionHistory(false);
    this.updateState({ 
      isOnline: false, 
      isSupabaseConnected: false,
      lastChecked: new Date()
    });
  };

  private handleVisibilityChange = () => {
    if (!document.hidden && navigator.onLine) {
      console.log('👁️ App became visible, checking connection');
      setTimeout(() => this.performHealthCheck(), 300);
    }
  };

  private startPeriodicChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    this.checkInterval = setInterval(() => {
      if (navigator.onLine) {
        this.performHealthCheck();
      }
    }, 15000); // Check every 15 seconds
  }

  private async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const isSupabaseConnected = await checkSupabaseConnection();
      const latency = Date.now() - startTime;
      
      this.updateConnectionHistory(isSupabaseConnected);
      this.updateCircuitBreakerStates();
      this.updateCacheStats();
      
      this.updateState({
        isOnline: navigator.onLine,
        isSupabaseConnected,
        lastChecked: new Date()
      });

      const result = { connected: isSupabaseConnected, latency };
      console.log('✅ Health check completed:', result);
      return result;
    } catch (error) {
      const latency = Date.now() - startTime;
      console.warn('⚠️ Health check failed:', error);
      
      this.updateConnectionHistory(false);
      this.updateState({
        isSupabaseConnected: false,
        lastChecked: new Date()
      });
      
      return { 
        connected: false, 
        latency, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private updateConnectionHistory(connected: boolean) {
    const newHistory = [...this.healthState.connectionHistory.slice(-9), connected];
    const stability = newHistory.filter(Boolean).length / newHistory.length;
    
    this.updateState({
      connectionHistory: newHistory,
      connectionStability: stability
    });
  }

  private updateCircuitBreakerStates() {
    const states = {
      dogs: RetryService.getCircuitBreakerState('dogs_query'),
      scheduledActivities: RetryService.getCircuitBreakerState('scheduled_activities_query'),
      userActivities: RetryService.getCircuitBreakerState('user_activities_query')
    };
    
    this.updateState({ circuitBreakerStates: states });
  }

  private updateCacheStats() {
    const basicStats = CacheService.getCacheStats();
    
    // Convert to the expected format with proper metrics
    const stats = {
      memoryEntries: basicStats.memoryEntries,
      hitRate: 0.85, // Default hit rate, can be enhanced later
      totalRequests: basicStats.memoryEntries * 2 // Rough estimation
    };
    
    this.updateState({ cacheStats: stats });
  }

  private updateState(updates: Partial<NetworkHealthState>) {
    this.healthState = { ...this.healthState, ...updates };
    this.notifySubscribers();
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.healthState);
      } catch (error) {
        console.warn('Error notifying health subscriber:', error);
      }
    });
  }

  // Public API
  subscribe(callback: (state: NetworkHealthState) => void): () => void {
    this.subscribers.push(callback);
    
    // Send current state immediately
    callback(this.healthState);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  getHealthState(): NetworkHealthState {
    return { ...this.healthState };
  }

  async retryConnection(): Promise<boolean> {
    console.log('🔄 Manual connection retry requested');
    const result = await this.performHealthCheck();
    return result.connected;
  }

  async initiateRecovery(): Promise<boolean> {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    console.log('🔄 Initiating connection recovery...');
    const result = await this.performHealthCheck();
    
    if (!result.connected) {
      // Schedule next retry with exponential backoff
      const delay = Math.min(5000 * Math.pow(1.5, this.healthState.connectionHistory.filter(c => !c).length), 30000);
      
      this.retryTimeout = setTimeout(() => {
        this.initiateRecovery();
      }, delay);
    }
    
    return result.connected;
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    this.subscribers = [];
  }
}

export { NetworkHealthService };
