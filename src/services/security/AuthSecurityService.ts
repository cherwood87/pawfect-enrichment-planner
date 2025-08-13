/**
 * Auth Security Service
 * Provides comprehensive security utilities for authentication
 */
import { supabase } from '@/integrations/supabase/client';

export class AuthSecurityService {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly STORAGE_PREFIX = 'auth_security_';

  /**
   * Check if user is currently locked out due to too many failed attempts
   */
  static isLockedOut(identifier: string): boolean {
    try {
      const lockoutKey = `${this.STORAGE_PREFIX}lockout_${identifier}`;
      const lockoutData = localStorage.getItem(lockoutKey);
      
      if (!lockoutData) return false;
      
      const { attempts, lastAttempt } = JSON.parse(lockoutData);
      const timeSinceLastAttempt = Date.now() - lastAttempt;
      
      // Clear lockout if enough time has passed
      if (timeSinceLastAttempt > this.LOCKOUT_DURATION) {
        localStorage.removeItem(lockoutKey);
        return false;
      }
      
      return attempts >= this.MAX_LOGIN_ATTEMPTS;
    } catch (error) {
      console.error('Error checking lockout status:', error);
      return false;
    }
  }

  /**
   * Record a failed login attempt
   */
  static recordFailedAttempt(identifier: string): void {
    try {
      const lockoutKey = `${this.STORAGE_PREFIX}lockout_${identifier}`;
      const existing = localStorage.getItem(lockoutKey);
      
      let attempts = 1;
      if (existing) {
        const data = JSON.parse(existing);
        attempts = data.attempts + 1;
      }
      
      localStorage.setItem(lockoutKey, JSON.stringify({
        attempts,
        lastAttempt: Date.now()
      }));
    } catch (error) {
      console.error('Error recording failed attempt:', error);
    }
  }

  /**
   * Clear failed attempts on successful login
   */
  static clearFailedAttempts(identifier: string): void {
    try {
      const lockoutKey = `${this.STORAGE_PREFIX}lockout_${identifier}`;
      localStorage.removeItem(lockoutKey);
    } catch (error) {
      console.error('Error clearing failed attempts:', error);
    }
  }

  /**
   * Get remaining lockout time in minutes
   */
  static getRemainingLockoutTime(identifier: string): number {
    try {
      const lockoutKey = `${this.STORAGE_PREFIX}lockout_${identifier}`;
      const lockoutData = localStorage.getItem(lockoutKey);
      
      if (!lockoutData) return 0;
      
      const { lastAttempt } = JSON.parse(lockoutData);
      const timeSinceLastAttempt = Date.now() - lastAttempt;
      const remainingTime = this.LOCKOUT_DURATION - timeSinceLastAttempt;
      
      return Math.ceil(remainingTime / (60 * 1000)); // Convert to minutes
    } catch (error) {
      console.error('Error getting remaining lockout time:', error);
      return 0;
    }
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if user has valid session
   */
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return !error && !!user;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  /**
   * Enhanced cleanup for comprehensive security
   */
  static enhancedAuthCleanup(): void {
    try {
      // Clear all auth-related storage
      const keysToRemove: string[] = [];
      
      // Check localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('supabase.auth.') ||
          key.includes('sb-') ||
          key.startsWith(this.STORAGE_PREFIX)
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage if available
      if (typeof sessionStorage !== 'undefined') {
        const sessionKeysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (
            key.startsWith('supabase.auth.') ||
            key.includes('sb-')
          )) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      }
      
      console.log('✅ Enhanced auth cleanup completed');
    } catch (error) {
      console.error('❌ Error during enhanced auth cleanup:', error);
    }
  }
}