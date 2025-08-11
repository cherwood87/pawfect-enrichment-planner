import { time, end } from './perf';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static startTiming(label: string): void {
    time(label);
  }

  static endTiming(label: string): number {
    const start = performance.now();
    end(label);
    const duration = performance.now() - start;
    
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
    
    return duration;
  }

  static getMetrics(label: string): { avg: number; max: number; count: number } | null {
    const times = this.metrics.get(label);
    if (!times || times.length === 0) return null;

    return {
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      max: Math.max(...times),
      count: times.length
    };
  }

  static logSlowOperations(threshold: number = 100): void {
    this.metrics.forEach((times, label) => {
      const slowOps = times.filter(t => t > threshold);
      if (slowOps.length > 0) {
        console.warn(`🐌 Slow operations for ${label}:`, {
          slowCount: slowOps.length,
          totalCount: times.length,
          avgSlow: slowOps.reduce((a, b) => a + b, 0) / slowOps.length,
          maxSlow: Math.max(...slowOps)
        });
      }
    });
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}