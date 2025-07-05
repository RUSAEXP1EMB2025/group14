import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory.ts';
import { CalendarSyncService } from './CalendarSyncService.ts';
import type { SleepEvent } from './CalendarSyncService.ts';
import { LineMessageService, type LineMessage, type QuickReplyItem } from './LineMessageService.ts';
import { DeviceControlService } from './DeviceControlService.ts';
import * as cron from 'node-cron';

export interface SleepScheduleData {
  readonly sleepEvent: SleepEvent;
  readonly cronExpression: string;
  readonly scheduleTime: Date;
  readonly type?: 'sleep' | 'wakeup';
}

export class SleepScheduleService {
  private readonly logger: ILogger;
  private readonly calendarSyncService: CalendarSyncService;
  private readonly lineMessageService: LineMessageService;
  private readonly deviceControlService?: DeviceControlService;
  private sleepCronJobs: Map<string, cron.ScheduledTask> = new Map();
  private wakeupCronJobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(
    calendarSyncService?: CalendarSyncService, 
    lineMessageService?: LineMessageService,
    deviceControlService?: DeviceControlService
  ) {
    this.logger = LoggerFactory.create('SleepScheduleService');
    this.calendarSyncService = calendarSyncService || new CalendarSyncService();
    this.lineMessageService = lineMessageService || new LineMessageService();
    this.deviceControlService = deviceControlService;
  }

  /**
   * 指定日の睡眠スケジュールを設定
   */
  async setupSleepSchedules(date: Date = new Date()): Promise<SleepScheduleData[]> {
    try {
      this.logger.info(`😴 ${date.toLocaleDateString('ja-JP')}の睡眠スケジュールを設定中...`);

      // その日の睡眠イベントを取得
      const sleepData = await this.calendarSyncService.getDailySleepEvents(date);

      if (sleepData.sleepEvents.length === 0) {
        this.logger.info('📅 睡眠イベントが見つかりませんでした');
        return [];
      }

      const schedules: SleepScheduleData[] = [];

      // 各睡眠イベントに対してスケジュールを設定
      for (const sleepEvent of sleepData.sleepEvents) {
        const schedule = await this.createSleepSchedule(sleepEvent);
        if (schedule) {
          schedules.push(schedule);
        }
      }

      this.logger.info(`✅ ${schedules.length}件の睡眠スケジュールを設定しました`);
      return schedules;
    } catch (error) {
      this.logger.error('睡眠スケジュールの設定に失敗:', error);
      throw new Error(
        `睡眠スケジュールの設定に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * 個別の睡眠イベントに対するスケジュールを作成
   */
  private async createSleepSchedule(sleepEvent: SleepEvent): Promise<SleepScheduleData | null> {
    try {
      const startTime = sleepEvent.startTime;
      const now = new Date();

      // 過去の時刻の場合はスケジュールを作成しない
      if (startTime <= now) {
        this.logger.debug(
          `⏰ 睡眠イベント "${sleepEvent.summary}" は過去の時刻のためスケジュール作成をスキップ`
        );
        return null;
      }

      const cronExpression = this.createCronExpression(startTime);
      const jobId = `sleep_${sleepEvent.id}_${startTime.getTime()}`;

      this.logger.info(
        `⏰ 睡眠通知スケジュール作成: "${sleepEvent.summary}" at ${startTime.toLocaleString()}`
      );

      // 既存のジョブがある場合は停止
      if (this.sleepCronJobs.has(jobId)) {
        this.sleepCronJobs.get(jobId)?.stop();
        this.sleepCronJobs.delete(jobId);
      }

      // 新しいcronジョブを作成
      const cronJob = cron.schedule(
        cronExpression,
        async () => {
          this.logger.info(`🛏️ 睡眠時間になりました: ${sleepEvent.summary}`);

          try {
            await this.sendSleepNotification(sleepEvent);
          } catch (error) {
            this.logger.error('睡眠通知の送信に失敗:', error);
          }

          // ジョブを実行後に削除
          this.sleepCronJobs.delete(jobId);
        },
        {
          timezone: 'Asia/Tokyo'
        }
      );

      this.sleepCronJobs.set(jobId, cronJob);

      return {
        sleepEvent,
        cronExpression,
        scheduleTime: startTime
      };
    } catch (error) {
      this.logger.error(`睡眠スケジュールの作成に失敗 (${sleepEvent.summary}):`, error);
      return null;
    }
  }

  /**
   * 睡眠通知を送信
   */
  private async sendSleepNotification(sleepEvent: SleepEvent): Promise<void> {
    try {
      this.logger.info(`🚀 睡眠通知を送信中: ${sleepEvent.summary}`);

      const message = `😴 ${sleepEvent.summary}の時間です。寝ますか？`;
      const result = await this.lineMessageService.sendMessageWithQuickReply(message, [
        {
          type: 'action',
          action: {
            type: 'postback',
            label: '😴 寝る',
            data: `action=sleep&event_id=${sleepEvent.id}&reason=bedtime`
          }
        },
        {
          type: 'action',
          action: {
            type: 'postback',
            label: '⏰ あとで',
            data: `action=sleep_later&event_id=${sleepEvent.id}&reason=bedtime`
          }
        },
        {
          type: 'action',
          action: {
            type: 'postback',
            label: '❌ 必要なし',
            data: `action=decline_sleep&event_id=${sleepEvent.id}&reason=bedtime`
          }
        }
      ]);

      if (result.isSuccess()) {
        this.logger.info('✅ 睡眠通知が正常に送信されました');
      } else {
        this.logger.error('❌ 睡眠通知の送信に失敗:', result.getError());
      }
    } catch (error) {
      this.logger.error('睡眠通知の送信中にエラーが発生:', error);
    }
  }

  /**
   * 時刻からcron式を生成
   */
  private createCronExpression(date: Date): string {
    const minute = date.getMinutes();
    const hour = date.getHours();
    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${minute} ${hour} ${day} ${month} *`;
  }

  /**
   * デバッグ用：指定分後に睡眠通知を送信
   */
  async createDebugSleepSchedule(minutesFromNow = 1, eventSummary = 'テスト睡眠'): Promise<void> {
    try {
      const now = new Date();
      const executeAt = new Date(now.getTime() + minutesFromNow * 60 * 1000);

      const mockSleepEvent: SleepEvent = {
        id: `debug_${Date.now()}`,
        summary: eventSummary,
        startTime: executeAt,
        endTime: new Date(executeAt.getTime() + 8 * 60 * 60 * 1000), // 8時間後
        duration: 8 * 60 // 8時間（分）
      };

      const schedule = await this.createSleepSchedule(mockSleepEvent);
      if (schedule) {
        this.logger.info(
          `🧪 デバッグ睡眠スケジュール作成: ${schedule.sleepEvent.summary} at ${schedule.scheduleTime.toLocaleString()}`
        );
      }
    } catch (error) {
      this.logger.error('デバッグ睡眠スケジュールの作成に失敗:', error);
    }
  }

  /**
   * アクティブな睡眠スケジュール数を取得
   */
  getActiveSleepScheduleCount(): number {
    return this.sleepCronJobs.size;
  }

  /**
   * すべての睡眠スケジュールを停止
   */
  stopAllSleepSchedules(): void {
    this.logger.info(`🛑 ${this.sleepCronJobs.size}件の睡眠スケジュールを停止中...`);

    for (const [jobId, cronJob] of this.sleepCronJobs) {
      cronJob.stop();
      this.logger.debug(`🛑 睡眠スケジュール停止: ${jobId}`);
    }

    this.sleepCronJobs.clear();
    this.logger.info('✅ すべての睡眠スケジュールを停止しました');
  }

  /**
   * 明日の睡眠スケジュールを事前設定
   */
  async setupTomorrowSleepSchedules(): Promise<SleepScheduleData[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return await this.setupSleepSchedules(tomorrow);
  }

  /**
   * 指定された日の起床スケジュールを設定
   */
  async setupWakeupSchedules(date: Date): Promise<SleepScheduleData[]> {
    try {
      this.logger.info(`⏰ ${date.toLocaleDateString()}の起床スケジュールを設定中...`);

      const sleepData = await this.calendarSyncService.getDailySleepEvents(date);

      if (sleepData.sleepEvents.length === 0) {
        this.logger.info('😴 睡眠イベントが見つかりませんでした');
        return [];
      }

      const schedules: SleepScheduleData[] = [];

      for (const sleepEvent of sleepData.sleepEvents) {
        const wakeupSchedule = await this.createWakeupSchedule(sleepEvent);
        if (wakeupSchedule) {
          schedules.push(wakeupSchedule);
        }
      }

      this.logger.info(`✅ ${schedules.length}件の起床スケジュールを設定しました`);
      return schedules;
    } catch (error) {
      this.logger.error('起床スケジュールの設定に失敗:', error);
      throw new Error(
        `起床スケジュールの設定に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * 個別の睡眠イベントに対する起床スケジュールを作成
   */
  private async createWakeupSchedule(sleepEvent: SleepEvent): Promise<SleepScheduleData | null> {
    try {
      const wakeupTime = sleepEvent.endTime;
      const now = new Date();

      // 過去の時刻の場合はスケジュールを作成しない
      if (wakeupTime <= now) {
        this.logger.debug(
          `⏰ 起床イベント "${sleepEvent.summary}" は過去の時刻のためスケジュール作成をスキップ`
        );
        return null;
      }

      const cronExpression = this.createCronExpression(wakeupTime);
      const jobId = `wakeup_${sleepEvent.id}_${wakeupTime.getTime()}`;

      this.logger.info(
        `⏰ 起床通知スケジュール作成: "${sleepEvent.summary}" at ${wakeupTime.toLocaleString()}`
      );
      this.logger.debug(`Debug info: 現在時刻=${now.toLocaleString()}, 起床時刻=${wakeupTime.toLocaleString()}, Cron式=${cronExpression}`);

      // 既存のジョブがある場合は停止
      if (this.wakeupCronJobs.has(jobId)) {
        this.wakeupCronJobs.get(jobId)?.stop();
        this.wakeupCronJobs.delete(jobId);
      }

      // 新しいcronジョブを作成
      const cronJob = cron.schedule(
        cronExpression,
        async () => {
          this.logger.info(`☀️ 起床時間になりました: ${sleepEvent.summary}`);

          try {
            await this.sendWakeupNotification(sleepEvent);
          } catch (error) {
            this.logger.error('起床通知の送信に失敗:', error);
          }
        },
        {
          timezone: 'Asia/Tokyo'
        }
      );

      // ジョブを開始
      cronJob.start();
      this.wakeupCronJobs.set(jobId, cronJob);

      return {
        sleepEvent,
        cronExpression,
        scheduleTime: wakeupTime,
        type: 'wakeup'
      };
    } catch (error) {
      this.logger.error('起床スケジュールの作成に失敗:', error);
      return null;
    }
  }

  /**
   * 起床通知を送信し、電気を点灯
   */
  private async sendWakeupNotification(sleepEvent: SleepEvent): Promise<void> {
    try {
      this.logger.info(`☀️ 起床通知を送信: ${sleepEvent.summary}`);

      // 電気を点灯
      await this.turnOnLights();

      // LINE通知を送信
      if (this.lineMessageService) {
        const quickReplyItems: QuickReplyItem[] = [
          {
            type: 'action',
            action: {
              type: 'postback',
              label: '起きました',
              data: 'action=wakeup&response=awake'
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'もう少し寝る',
              data: 'action=wakeup&response=snooze'
            }
          }
        ];

        const message: LineMessage = {
          text: '☀️ おはようございます！\n起床時間になりました。\n\n電気をつけました💡\n起きましたか？',
          quickReply: quickReplyItems
        };

        await this.lineMessageService.sendPushMessage(
          process.env.LINE_TEST_USER_ID || '',
          message
        );

        this.logger.info('✅ 起床通知を送信しました');
      } else {
        this.logger.warn('⚠️ LineMessageServiceが設定されていないため、起床通知をスキップしました');
      }
    } catch (error) {
      this.logger.error('起床通知の送信に失敗:', error);
      throw error;
    }
  }

  /**
   * 電気を点灯
   */
  private async turnOnLights(): Promise<void> {
    try {
      this.logger.info('💡 電気を点灯中...');

      // DeviceControlServiceを使用して電気を点灯
      if (this.deviceControlService) {
        const result = await this.deviceControlService.turnOnLights();

        if (result.success) {
          this.logger.info('✅ 電気を点灯しました');
        } else {
          this.logger.error('❌ 電気の点灯に失敗:', result.message);
        }
      } else {
        this.logger.warn('⚠️ DeviceControlServiceが設定されていないため、電気の制御をスキップしました');
      }
    } catch (error) {
      this.logger.error('電気の点灯に失敗:', error);
      throw error;
    }
  }

  /**
   * すべての起床スケジュールを停止
   */
  stopAllWakeupSchedules(): void {
    this.logger.info(`🛑 ${this.wakeupCronJobs.size}件の起床スケジュールを停止中...`);

    for (const [jobId, cronJob] of this.wakeupCronJobs) {
      cronJob.stop();
      this.logger.debug(`🛑 起床スケジュール停止: ${jobId}`);
    }

    this.wakeupCronJobs.clear();
    this.logger.info('✅ すべての起床スケジュールを停止しました');
  }

  /**
   * すべてのスケジュール（睡眠・起床）を停止
   */
  stopAllSchedules(): void {
    this.stopAllSleepSchedules();
    this.stopAllWakeupSchedules();
  }

  /**
   * デバッグ用: 指定分後に起床通知を送信
   */
  async createDebugWakeupSchedule(minutesFromNow = 1, eventSummary = 'テスト起床'): Promise<void> {
    try {
      const now = new Date();
      const wakeupTime = new Date(now.getTime() + minutesFromNow * 60 * 1000);

      const mockSleepEvent: SleepEvent = {
        id: `debug_wakeup_${Date.now()}`,
        summary: eventSummary,
        startTime: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8時間前
        endTime: wakeupTime, // 起床時間
        duration: 8 * 60 // 8時間（分）
      };

      const schedule = await this.createWakeupSchedule(mockSleepEvent);
      if (schedule) {
        this.logger.info(
          `🧪 デバッグ起床スケジュール作成: ${schedule.sleepEvent.summary} at ${schedule.scheduleTime.toLocaleString()}`
        );
      }
    } catch (error) {
      this.logger.error('デバッグ起床スケジュールの作成に失敗:', error);
    }
  }
}
