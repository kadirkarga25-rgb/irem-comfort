/**
 * IC CMS PRO - Volume 6: Enterprise Infrastructure
 * Centralized Logger Service for audit logs, diagnostics, and system tracing.
 */

export type LogLevel = 'info' | 'warning' | 'error' | 'critical';

export interface LogEntry {
  id: string;
  level: LogLevel;
  category: string;
  message: string;
  details?: any;
  timestamp: string;
}

const LOG_STORAGE_KEY = 'ic_cms_system_logs_v6';

export class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogs = 200;

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const saved = localStorage.getItem(LOG_STORAGE_KEY);
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch {
      this.logs = [];
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs.slice(0, this.maxLogs)));
    } catch {
      // Memory fallback
    }
  }

  public log(level: LogLevel, category: string, message: string, details?: any): LogEntry {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      level,
      category,
      message,
      details,
      timestamp: new Date().toISOString()
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    this.saveLogs();

    if (level === 'error' || level === 'critical') {
      console.error(`[${level.toUpperCase()}][${category}] ${message}`, details || '');
    } else {
      console.log(`[${level.toUpperCase()}][${category}] ${message}`);
    }

    return entry;
  }

  public info(category: string, message: string, details?: any) {
    return this.log('info', category, message, details);
  }

  public warning(category: string, message: string, details?: any) {
    return this.log('warning', category, message, details);
  }

  public error(category: string, message: string, details?: any) {
    return this.log('error', category, message, details);
  }

  public critical(category: string, message: string, details?: any) {
    return this.log('critical', category, message, details);
  }

  public getLogs(filter?: { level?: LogLevel; category?: string }): LogEntry[] {
    return this.logs.filter(l => {
      if (filter?.level && l.level !== filter.level) return false;
      if (filter?.category && l.category !== filter.category) return false;
      return true;
    });
  }

  public clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  public exportLogsJson(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const loggerService = new LoggerService();
