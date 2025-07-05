import type { ScheduleConfig } from '../../domain/entities/index.ts';

export class SimpleNextExecutionCalculator {
  calculateNext(config: ScheduleConfig, lastExecution?: Date): Date | null {
    const now = new Date();

    switch (config.type) {
      case 'interval':
        if (config.intervalMinutes) {
          const nextTime = new Date(lastExecution || now);
          nextTime.setMinutes(nextTime.getMinutes() + config.intervalMinutes);
          return nextTime;
        }
        break;

      case 'once':
        if (config.executionTime) {
          // 指定時刻がまだ未来の場合のみ実行
          return config.executionTime > now ? config.executionTime : null;
        }
        break;

      case 'sunset':
      case 'sunrise': {
        // 日の入り・日の出の計算は複雑なので、一時的に次の日に設定
        const nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(18, 0, 0, 0); // 仮に18:00に設定
        return nextDay;
      }

      case 'cron': {
        // cron式の解析は複雑なので、一時的に1時間後に設定
        const nextHour = new Date(now);
        nextHour.setHours(nextHour.getHours() + 1);
        return nextHour;
      }

      default:
        return null;
    }

    return null;
  }
}
