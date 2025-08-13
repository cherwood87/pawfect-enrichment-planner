import React from 'react';
import { logger } from '@/utils/logger';

// Replace all console statements with logger in production
export const optimizedLog = {
  log: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      logger.debug(message, args.length > 0 ? args[0] : undefined);
    }
  },
  warn: (message: string, ...args: any[]) => {
    logger.warn(message, args.length > 0 ? args[0] : undefined);
  },
  error: (message: string, ...args: any[]) => {
    logger.error(message, args.length > 0 ? args[0] : undefined);
  },
  info: (message: string, ...args: any[]) => {
    logger.info(message, args.length > 0 ? args[0] : undefined);
  }
};

// Web Vitals monitoring for production
export const initializePerformanceMonitoring = () => {
  if (import.meta.env.PROD) {
    // Monitor Core Web Vitals - simplified version to avoid type issues
    try {
      import('web-vitals').then((webVitals: any) => {
        if (webVitals.onCLS) webVitals.onCLS((metric: any) => logger.info('CLS', metric));
        if (webVitals.onINP) webVitals.onINP((metric: any) => logger.info('INP', metric));
        if (webVitals.onFCP) webVitals.onFCP((metric: any) => logger.info('FCP', metric));
        if (webVitals.onLCP) webVitals.onLCP((metric: any) => logger.info('LCP', metric));
        if (webVitals.onTTFB) webVitals.onTTFB((metric: any) => logger.info('TTFB', metric));
      });
    } catch {
      // Web vitals not available, continue silently
    }
  }
};

// Image preloading for critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Bundle analysis helper
export const reportBundleSize = () => {
  if (import.meta.env.DEV) {
    logger.info('Bundle analysis enabled for development');
  }
};