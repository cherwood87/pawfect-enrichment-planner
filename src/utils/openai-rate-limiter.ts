// Rate limiting and retry utilities for OpenAI API
export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxConcurrentRequests: number;
  retryAttempts: number;
  baseDelay: number; // Base delay in ms for exponential backoff
}

export interface RequestMetrics {
  timestamp: number;
  userId?: string;
  responseTime: number;
  success: boolean;
  tokenUsage?: number;
  cost?: number;
  error?: string;
}

export class OpenAIRateLimiter {
  private requestHistory: Map<string, number[]> = new Map();
  private activeRequests: Set<string> = new Set();
  private requestQueue: Array<() => Promise<any>> = [];
  private metrics: RequestMetrics[] = [];
  
  constructor(private config: RateLimitConfig) {}

  // Check if request should be rate limited
  canMakeRequest(userId: string = 'anonymous'): boolean {
    const now = Date.now();
    const userRequests = this.requestHistory.get(userId) || [];
    
    // Clean old requests (older than 1 minute)
    const recentRequests = userRequests.filter(time => now - time < 60000);
    this.requestHistory.set(userId, recentRequests);
    
    // Check rate limit
    if (recentRequests.length >= this.config.maxRequestsPerMinute) {
      return false;
    }
    
    // Check concurrent requests
    const concurrentKey = `${userId}-concurrent`;
    if (this.activeRequests.has(concurrentKey) && 
        this.activeRequests.size >= this.config.maxConcurrentRequests) {
      return false;
    }
    
    return true;
  }

  // Execute request with rate limiting and retry logic
  async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    userId: string = 'anonymous'
  ): Promise<T> {
    const startTime = Date.now();
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      try {
        // Check rate limit
        if (!this.canMakeRequest(userId)) {
          const waitTime = this.calculateBackoffDelay(attempt);
          await this.delay(waitTime);
          continue;
        }
        
        // Track request
        this.trackRequestStart(userId);
        
        // Execute request
        const result = await this.executeWithTimeout(requestFn, 30000); // 30s timeout
        
        // Track success
        this.trackRequestEnd(userId, startTime, true);
        
        return result;
        
      } catch (error) {
        lastError = error as Error;
        this.trackRequestEnd(userId, startTime, false, lastError.message);
        
        // Check if it's a rate limit error
        if (this.isRateLimitError(error)) {
          const backoffDelay = this.calculateBackoffDelay(attempt);
          console.log(`Rate limited, backing off for ${backoffDelay}ms (attempt ${attempt + 1})`);
          await this.delay(backoffDelay);
          continue;
        }
        
        // Check if it's a retryable error
        if (!this.isRetryableError(error)) {
          throw error;
        }
        
        // Wait before retry
        const retryDelay = this.calculateBackoffDelay(attempt);
        await this.delay(retryDelay);
      }
    }
    
    throw lastError || new Error('Max retry attempts exceeded');
  }

  private trackRequestStart(userId: string): void {
    const now = Date.now();
    const userRequests = this.requestHistory.get(userId) || [];
    userRequests.push(now);
    this.requestHistory.set(userId, userRequests);
    
    this.activeRequests.add(`${userId}-concurrent`);
  }

  private trackRequestEnd(
    userId: string, 
    startTime: number, 
    success: boolean, 
    error?: string
  ): void {
    this.activeRequests.delete(`${userId}-concurrent`);
    
    this.metrics.push({
      timestamp: startTime,
      userId,
      responseTime: Date.now() - startTime,
      success,
      error
    });
    
    // Keep only recent metrics (last hour)
    const oneHourAgo = Date.now() - 3600000;
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
  }

  private async executeWithTimeout<T>(
    requestFn: () => Promise<T>, 
    timeoutMs: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);
      
      requestFn()
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  private calculateBackoffDelay(attempt: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = this.config.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    return Math.min(exponentialDelay + jitter, 60000); // Max 60 seconds
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isRateLimitError(error: any): boolean {
    if (error?.message?.includes('429') || error?.message?.includes('rate limit')) {
      return true;
    }
    if (error?.status === 429) {
      return true;
    }
    return false;
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, timeouts, and server errors
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    const status = error?.status || error?.response?.status;
    
    if (retryableStatusCodes.includes(status)) {
      return true;
    }
    
    const message = error?.message?.toLowerCase() || '';
    const retryableMessages = [
      'network',
      'timeout',
      'connection',
      'econnreset',
      'enotfound',
      'enetdown'
    ];
    
    return retryableMessages.some(msg => message.includes(msg));
  }

  // Get current metrics
  getMetrics(): {
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
    activeRequests: number;
    queueLength: number;
    recentErrors: string[];
  } {
    const totalRequests = this.metrics.length;
    const successfulRequests = this.metrics.filter(m => m.success).length;
    const successRate = totalRequests > 0 ? successfulRequests / totalRequests : 0;
    
    const avgResponseTime = totalRequests > 0 
      ? this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests 
      : 0;
    
    const recentErrors = this.metrics
      .filter(m => !m.success && m.error)
      .slice(-10)
      .map(m => m.error!)
      .filter((error, index, arr) => arr.indexOf(error) === index); // Unique errors
    
    return {
      totalRequests,
      successRate,
      averageResponseTime: Math.round(avgResponseTime),
      activeRequests: this.activeRequests.size,
      queueLength: this.requestQueue.length,
      recentErrors
    };
  }

  // Reset metrics (useful for testing)
  resetMetrics(): void {
    this.metrics = [];
    this.requestHistory.clear();
    this.activeRequests.clear();
  }
}

// Default rate limiter instance
export const defaultRateLimiter = new OpenAIRateLimiter({
  maxRequestsPerMinute: 20, // Conservative limit
  maxConcurrentRequests: 5,
  retryAttempts: 3,
  baseDelay: 1000 // 1 second base delay
});

// Cost tracking utilities
export class CostTracker {
  private static readonly MODEL_COSTS = {
    'gpt-4o-mini': { input: 0.000015, output: 0.00006 }, // per 1K tokens
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 }
  };

  static estimateCost(
    inputTokens: number, 
    outputTokens: number, 
    model: string = 'gpt-4o-mini'
  ): number {
    const costs = this.MODEL_COSTS[model as keyof typeof this.MODEL_COSTS];
    if (!costs) return 0;
    
    const inputCost = (inputTokens / 1000) * costs.input;
    const outputCost = (outputTokens / 1000) * costs.output;
    
    return inputCost + outputCost;
  }

  static estimateTokens(text: string): number {
    // Rough approximation: 1 token ≈ 4 characters for English
    return Math.ceil(text.length / 4);
  }
}
