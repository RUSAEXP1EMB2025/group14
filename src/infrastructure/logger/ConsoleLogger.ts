import type { ILogger, LogEntry } from '../../core/interfaces/ILogger.ts';
import { LogLevel } from '../../core/interfaces/ILogger.ts';

export class ConsoleLogger implements ILogger {
  private source?: string;

  constructor(source?: string) {
    this.source = source;
  }

  private createLogEntry(level: LogLevel, message: string, args?: unknown[]): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      args,
      source: this.source
    };
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const source = entry.source ? `[${entry.source}]` : '';
    return `[${timestamp}] [${entry.level}] ${source} ${entry.message}`;
  }

  info(message: string, ...args: unknown[]): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, args);
    console.log(this.formatMessage(entry), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, args);
    console.error(this.formatMessage(entry), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, args);
    console.warn(this.formatMessage(entry), ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, args);
    console.debug(this.formatMessage(entry), ...args);
  }
}
