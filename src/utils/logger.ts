// Centralized logging service for production-ready error handling
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: any;
  timestamp: number;
  userAgent?: string;
  url?: string;
}

class Logger {
  private static instance: Logger;
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      level,
      message,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (!this.isDevelopment) {
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  private storeLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Store critical errors in localStorage for debugging
    if (entry.level === 'error') {
      try {
        const errorLogs = JSON.parse(localStorage.getItem('app_error_logs') || '[]');
        errorLogs.push(entry);
        // Keep only last 20 error logs
        if (errorLogs.length > 20) {
          errorLogs.shift();
        }
        localStorage.setItem('app_error_logs', JSON.stringify(errorLogs));
      } catch (e) {
        // Fail silently if localStorage is full
      }
    }
  }

  debug(message: string, context?: any): void {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createLogEntry('debug', message, context);
    this.storeLog(entry);
    
    if (this.isDevelopment) {
      console.log(`🐛 ${message}`, context || '');
    }
  }

  info(message: string, context?: any): void {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createLogEntry('info', message, context);
    this.storeLog(entry);
    
    if (this.isDevelopment) {
      console.info(`ℹ️ ${message}`, context || '');
    }
  }

  warn(message: string, context?: any): void {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createLogEntry('warn', message, context);
    this.storeLog(entry);
    
    console.warn(`⚠️ ${message}`, context || '');
  }

  error(message: string, context?: any): void {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createLogEntry('error', message, context);
    this.storeLog(entry);
    
    console.error(`❌ ${message}`, context || '');
    
    // In production, could integrate with error reporting service
    // reportToExternalService(entry);
  }

  // Performance timing with structured logging
  time(label: string): void {
    if (this.isDevelopment) {
      performance.mark(`${label}-start`);
    }
  }

  timeEnd(label: string): number | null {
    if (!this.isDevelopment) return null;
    
    try {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = performance.getEntriesByName(label)[0];
      const duration = measure ? Math.round(measure.duration) : 0;
      
      if (duration > 100) {
        this.warn(`Slow operation detected: ${label}`, { duration });
      } else {
        this.debug(`Performance: ${label}`, { duration });
      }
      
      return duration;
    } catch (e) {
      return null;
    }
  }

  // Get stored logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('app_error_logs');
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Convenience functions for easy migration from console.*
export const log = {
  debug: (message: string, context?: any) => logger.debug(message, context),
  info: (message: string, context?: any) => logger.info(message, context),
  warn: (message: string, context?: any) => logger.warn(message, context),
  error: (message: string, context?: any) => logger.error(message, context),
  time: (label: string) => logger.time(label),
  timeEnd: (label: string) => logger.timeEnd(label)
};
