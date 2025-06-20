import { supabase } from "@/integrations/supabase/client";
import { RetryService } from "../network/RetryService";
import { CacheService } from "../network/CacheService";

export interface RetryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  timeout: number;
}

export class BaseSupabaseAdapter {
  protected static readonly DEFAULT_RETRY_OPTIONS: RetryOptions = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    backoffFactor: 2,
    timeout: 10000,
  };

  protected static readonly CACHE_DURATION = {
    DOGS: 15 * 60 * 1000, // 15 minutes
    ACTIVITIES: 10 * 60 * 1000, // 10 minutes
    USER_ACTIVITIES: 8 * 60 * 1000, // 8 minutes
  };

  protected static async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {},
    operationName: string,
  ): Promise<T> {
    const finalOptions = { ...this.DEFAULT_RETRY_OPTIONS, ...options };
    return RetryService.executeWithRetry(
      operation,
      finalOptions,
      operationName,
    );
  }

  protected static invalidateCache(cacheKeys: string[]): void {
    cacheKeys.forEach((key) => CacheService.delete(key));
  }

  protected static getSupabaseClient() {
    return supabase;
  }
}
