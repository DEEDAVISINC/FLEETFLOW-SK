/**
 * Production-Ready Logging System for FleetFlow
 * Replaces console.info statements with proper logging infrastructure
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  component?: string;
  userId?: string;
  tenantId?: string;
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.level = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    component?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      component,
      userId: this.getCurrentUserId(),
      tenantId: this.getCurrentTenantId(),
    };
  }

  private getCurrentUserId(): string | undefined {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId') || undefined;
    }
    return undefined;
  }

  private getCurrentTenantId(): string | undefined {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tenantId') || 'tenant-demo-123';
    }
    return 'tenant-demo-123';
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const component = entry.component ? `[${entry.component}]` : '';
    const tenant = entry.tenantId ? `[${entry.tenantId}]` : '';

    return `${entry.timestamp} ${levelName} ${component}${tenant} ${entry.message}`;
  }

  private logToConsole(entry: LogEntry): void {
    if (!this.isDevelopment) return;

    const message = this.formatMessage(entry);

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(message, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(message, entry.data);
        break;
      case LogLevel.INFO:
        console.info(message, entry.data);
        break;
      case LogLevel.DEBUG:
        console.info(message, entry.data);
        break;
    }
  }

  private async logToServer(entry: LogEntry): Promise<void> {
    if (this.isDevelopment) return;

    try {
      await fetch('/api/logging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Fallback to console in production if server logging fails
      console.error('Failed to log to server:', error);
      console.error('Original log entry:', entry);
    }
  }

  private log(
    level: LogLevel,
    message: string,
    data?: any,
    component?: string
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, data, component);

    this.logToConsole(entry);
    this.logToServer(entry);
  }

  // Public logging methods
  error(message: string, data?: any, component?: string): void {
    this.log(LogLevel.ERROR, message, data, component);
  }

  warn(message: string, data?: any, component?: string): void {
    this.log(LogLevel.WARN, message, data, component);
  }

  info(message: string, data?: any, component?: string): void {
    this.log(LogLevel.INFO, message, data, component);
  }

  debug(message: string, data?: any, component?: string): void {
    this.log(LogLevel.DEBUG, message, data, component);
  }

  // Specialized logging methods for common use cases
  userAction(action: string, data?: any, component?: string): void {
    this.info(`User Action: ${action}`, data, component);
  }

  apiCall(
    endpoint: string,
    method: string,
    data?: any,
    component?: string
  ): void {
    this.debug(`API Call: ${method} ${endpoint}`, data, component);
  }

  apiResponse(
    endpoint: string,
    status: number,
    data?: any,
    component?: string
  ): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG;
    this.log(level, `API Response: ${endpoint} - ${status}`, data, component);
  }

  performance(operation: string, duration: number, component?: string): void {
    this.info(
      `Performance: ${operation} took ${duration}ms`,
      undefined,
      component
    );
  }

  security(event: string, data?: any, component?: string): void {
    this.warn(`Security Event: ${event}`, data, component);
  }
}

// Create singleton instance
export const logger = new Logger();

// Convenience exports for common patterns
export const logUserAction = (action: string, data?: any, component?: string) =>
  logger.userAction(action, data, component);

export const logApiCall = (
  endpoint: string,
  method: string,
  data?: any,
  component?: string
) => logger.apiCall(endpoint, method, data, component);

export const logApiResponse = (
  endpoint: string,
  status: number,
  data?: any,
  component?: string
) => logger.apiResponse(endpoint, status, data, component);

export const logPerformance = (
  operation: string,
  duration: number,
  component?: string
) => logger.performance(operation, duration, component);

export const logSecurity = (event: string, data?: any, component?: string) =>
  logger.security(event, data, component);

export default logger;
