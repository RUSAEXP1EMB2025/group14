import { logger } from '../utils/logger.ts';
import type { LineService } from './LineService.ts';
import type { NatureRemoService } from './NatureRemoService.ts';

export class ScheduleManager {
  private lineService: LineService;
  private remoService: NatureRemoService;
  private intervals: Set<NodeJS.Timeout>;

  constructor(lineService: LineService, remoService: NatureRemoService) {
    this.lineService = lineService;
    this.remoService = remoService;
    this.intervals = new Set();
  }

  // 定期実行タスクの開始
  startScheduledTasks(): void {
    logger.info('📅 定期実行タスクを開始します');

    // 例: 1時間ごとにセンサーデータをチェック
    const sensorCheckInterval = setInterval(async () => {
      try {
        await this.checkSensorData();
      } catch (error) {
        logger.error('センサーデータチェックエラー:', error);
      }
    }, 60 * 60 * 1000); // 1時間

    this.intervals.add(sensorCheckInterval);
  }

  private async checkSensorData(): Promise<void> {
    try {
      const sensorData = await this.remoService.getSensorData();
      logger.info('📊 定期センサーデータ取得:', sensorData);

      // 異常値の検知などのロジックをここに追加
      if (sensorData.temperature > 30) {
        logger.warn('🌡️ 高温警告:', sensorData.temperature);
      }
    } catch (error) {
      logger.error('定期センサーデータ取得エラー:', error);
    }
  }

  // クリーンアップ
  cleanup(): void {
    logger.info('🧹 ScheduleManager クリーンアップ中...');

    for (const interval of this.intervals) {
      clearInterval(interval);
    }

    this.intervals.clear();
    logger.info('✅ ScheduleManager クリーンアップ完了');
  }
}
