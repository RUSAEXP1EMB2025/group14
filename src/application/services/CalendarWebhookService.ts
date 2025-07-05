import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory.ts';
import type { CalendarSyncService } from './CalendarSyncService.ts';
import type { SleepScheduleService } from './SleepScheduleService.ts';
import type { CalendarWebhookRequest } from '../../presentation/controllers/CalendarWebhookController.ts';

export interface WebhookStatus {
  readonly isSubscribed: boolean;
  readonly channelId?: string;
  readonly expirationTime?: Date;
  readonly lastUpdate?: Date;
}

export interface CalendarChangeResult {
  readonly success: boolean;
  readonly updatedSchedules: number;
  readonly message: string;
}

export class CalendarWebhookService {
  private readonly logger: ILogger;
  private webhookStatus: WebhookStatus;

  constructor(
    private readonly calendarSyncService: CalendarSyncService,
    private readonly sleepScheduleService: SleepScheduleService
  ) {
    this.logger = LoggerFactory.create('CalendarWebhookService');
    this.webhookStatus = {
      isSubscribed: false
    };
  }

  /**
   * Googleカレンダーの変更通知を処理
   */
  async handleCalendarChange(webhookData: CalendarWebhookRequest): Promise<Result<CalendarChangeResult>> {
    try {
      this.logger.info('📅 カレンダー変更を検知しました', {
        channelId: webhookData.channelId,
        resourceState: webhookData.resourceState,
        messageNumber: webhookData.messageNumber
      });

      // Webhook状態を更新
      this.updateWebhookStatus(webhookData);

      // 睡眠スケジュールを再設定
      const updateResult = await this.updateSleepSchedules();

      if (updateResult.isFailure()) {
        this.logger.error('睡眠スケジュール更新に失敗:', updateResult.getError());
        return Result.failure(updateResult.getError());
      }

      const result = updateResult.getValue();
      this.logger.info('✅ 睡眠スケジュールを更新しました', {
        updatedSchedules: result.updatedSchedules,
        message: result.message
      });

      return Result.success(result);
    } catch (error) {
      this.logger.error('カレンダー変更処理中にエラーが発生:', error);
      return Result.failure(new Error(`Calendar change processing failed: ${error}`));
    }
  }

  /**
   * 睡眠スケジュールを再設定
   */
  private async updateSleepSchedules(): Promise<Result<CalendarChangeResult>> {
    try {
      this.logger.info('🔄 睡眠・起床スケジュールを再設定中...');

      // 既存のスケジュールを停止
      this.sleepScheduleService.stopAllSchedules();
      this.logger.debug('既存の睡眠・起床スケジュールを停止しました');

      // 今日と明日のスケジュールを設定
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let updatedSchedules = 0;
      const messages: string[] = [];

      // 今日の睡眠スケジュール
      const todaySchedules = await this.sleepScheduleService.setupSleepSchedules(today);
      updatedSchedules += todaySchedules.length;
      messages.push(`今日の睡眠: ${todaySchedules.length}件`);
      this.logger.info('今日の睡眠スケジュールを設定しました', { count: todaySchedules.length });

      // 明日の睡眠スケジュール
      const tomorrowSchedules = await this.sleepScheduleService.setupSleepSchedules(tomorrow);
      updatedSchedules += tomorrowSchedules.length;
      messages.push(`明日の睡眠: ${tomorrowSchedules.length}件`);
      this.logger.info('明日の睡眠スケジュールを設定しました', { count: tomorrowSchedules.length });

      // 今日の起床スケジュール
      const todayWakeupSchedules = await this.sleepScheduleService.setupWakeupSchedules(today);
      updatedSchedules += todayWakeupSchedules.length;
      messages.push(`今日の起床: ${todayWakeupSchedules.length}件`);
      this.logger.info('今日の起床スケジュールを設定しました', { count: todayWakeupSchedules.length });

      // 明日の起床スケジュール
      const tomorrowWakeupSchedules = await this.sleepScheduleService.setupWakeupSchedules(tomorrow);
      updatedSchedules += tomorrowWakeupSchedules.length;
      messages.push(`明日の起床: ${tomorrowWakeupSchedules.length}件`);
      this.logger.info('明日の起床スケジュールを設定しました', { count: tomorrowWakeupSchedules.length });

      const message = `睡眠・起床スケジュール更新完了 (${messages.join(', ')})`;

      return Result.success({
        success: true,
        updatedSchedules,
        message
      });
    } catch (error) {
      this.logger.error('睡眠・起床スケジュール更新中にエラー:', error);
      return Result.failure(new Error(`Sleep/wakeup schedule update failed: ${error}`));
    }
  }

  /**
   * Webhook状態を更新
   */
  private updateWebhookStatus(webhookData: CalendarWebhookRequest): void {
    this.webhookStatus = {
      isSubscribed: true,
      channelId: webhookData.channelId,
      expirationTime: webhookData.channelExpiration 
        ? new Date(Number.parseInt(webhookData.channelExpiration, 10))
        : undefined,
      lastUpdate: new Date()
    };
  }

  /**
   * Webhook状態を取得
   */
  getWebhookStatus(): WebhookStatus {
    return { ...this.webhookStatus };
  }

  /**
   * カレンダーの変更をチェック（手動トリガー用）
   */
  async manualSleepScheduleUpdate(): Promise<Result<CalendarChangeResult>> {
    try {
      this.logger.info('🔄 手動で睡眠スケジュール更新を実行...');
      
      const result = await this.updateSleepSchedules();
      
      if (result.isSuccess()) {
        this.logger.info('✅ 手動更新が完了しました');
      }
      
      return result;
    } catch (error) {
      this.logger.error('手動更新中にエラー:', error);
      return Result.failure(new Error(`Manual update failed: ${error}`));
    }
  }

  /**
   * Webhookの購読状態をリセット
   */
  resetWebhookStatus(): void {
    this.webhookStatus = {
      isSubscribed: false
    };
    this.logger.info('📅 Webhook状態をリセットしました');
  }

  /**
   * デバッグ情報を取得
   */
  getDebugInfo(): Record<string, unknown> {
    return {
      webhookStatus: this.webhookStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}
