import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { ConsoleLogger } from './ConsoleLogger.ts';

export const LoggerFactory = {
  loggers: new Map<string, ILogger>(),

  create(source?: string): ILogger {
    return LoggerFactory.getLogger(source);
  },

  getLogger(source?: string): ILogger {
    const key = source || 'default';

    if (!LoggerFactory.loggers.has(key)) {
      LoggerFactory.loggers.set(key, new ConsoleLogger(source));
    }

    return LoggerFactory.loggers.get(key)!;
  },

  /**
   * デフォルトロガーを取得
   */
  getDefaultLogger(): ILogger {
    return LoggerFactory.getLogger();
  },

  /**
   * ロガーをクリア
   */
  clearLoggers(): void {
    LoggerFactory.loggers.clear();
  }
};

// 後方互換性のために既存のloggerをエクスポート
export const logger = LoggerFactory.getDefaultLogger();
