import { ManageScheduleUseCase } from '../usecases/ManageScheduleUseCase.ts';
import type { CreateScheduleRequest } from '../usecases/ManageScheduleUseCase.ts';
import type { ScheduleId } from '../../domain/entities/Schedule.ts';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type { ScheduleExecutionContext } from '../../infrastructure/scheduler/ScheduleExecutionEngine.ts';
import * as cron from 'node-cron';
import { CalendarSyncService } from './CalendarSyncService.ts';
import type { DailySleepData } from './CalendarSyncService.ts';
import { SunsetCalculationService } from './SunsetCalculationService.ts';
import type { LocationData, SunsetData } from './SunsetCalculationService.ts';
import { LineMessageService } from './LineMessageService.ts';
import { SleepScheduleService } from './SleepScheduleService.ts';
import { DeviceControlService } from './DeviceControlService.ts';

export class DailyScheduleSetupService {
  private readonly logger: ILogger;
  private dailySetupCronJob?: cron.ScheduledTask;
  private sunsetCronJob?: cron.ScheduledTask;
  private lastSetupDate = '';
  private lineMessageService: LineMessageService;
  private calendarSyncService: CalendarSyncService;
  private sunsetCalculationService: SunsetCalculationService;
  private sleepScheduleService: SleepScheduleService;
  private deviceControlService: DeviceControlService;

  constructor(
    private readonly manageScheduleUseCase: ManageScheduleUseCase,
    lineMessageService?: LineMessageService
  ) {
    this.logger = LoggerFactory.create('DailyScheduleSetupService');
    this.lineMessageService = lineMessageService || new LineMessageService();
    this.calendarSyncService = new CalendarSyncService();
    this.sunsetCalculationService = new SunsetCalculationService();
    this.deviceControlService = new DeviceControlService();
    this.sleepScheduleService = new SleepScheduleService(
      this.calendarSyncService,
      this.lineMessageService,
      this.deviceControlService
    );
  }

  start(): void {
    this.logger.info('🌅 Starting daily schedule setup service');

    this.setupTodaySchedule();

    this.scheduleDailySetup();
  }

  stop(): void {
    if (this.dailySetupCronJob) {
      this.dailySetupCronJob.stop();
      this.dailySetupCronJob = undefined;
      this.logger.info('🛑 Daily schedule setup service stopped');
    }

    if (this.sunsetCronJob) {
      this.sunsetCronJob.stop();
      this.sunsetCronJob = undefined;
      this.logger.info('🛑 Sunset notification cron stopped');
    }

    // 睡眠・起床スケジュールも停止
    this.sleepScheduleService.stopAllSchedules();
    this.logger.info('🛑 Sleep/wakeup schedule service stopped');
  }

  private async setupTodaySchedule(): Promise<void> {
    try {
      const now = new Date();

      // 日の入り時刻を取得
      const sunsetResult = await this.sunsetCalculationService.calculateSunsetTime(now);

      // 前日の睡眠データを取得してログ表示（統計用）
      await this.fetchAndLogSleepData(now);

      // 今日の睡眠スケジュールを設定（今夜の通知用）
      await this.setupSleepScheduleForToday(now);

      if (now > sunsetResult.sunset) {
        this.logger.info("🌆 Today's sunset has passed, setting up tomorrow's schedule");
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        await this.setupScheduleForDate(tomorrow);
      } else {
        this.logger.info("🌅 Setting up today's sunset schedule");
        await this.setupScheduleForDate(now);
      }
    } catch (error) {
      this.logger.error("❌ Failed to setup today's schedule:", error);
    }
  }

  private scheduleDailySetup(): void {
    this.dailySetupCronJob = cron.schedule(
      '0 8 * * *',
      () => {
        const now = new Date();
        const today = now.toISOString().split('T')[0] ?? '';

        if (this.lastSetupDate === today) {
          this.logger.debug(`🔄 Daily setup already completed for ${today}, skipping`);
          return;
        }

        this.logger.info(`🌅 Morning schedule setup time reached for ${today}`);
        this.lastSetupDate = today;
        this.setupTodaySchedule();
      },
      {
        timezone: 'Asia/Tokyo'
      }
    );

    this.logger.info('⏰ Scheduled daily setup at 8:00 AM JST using cron');
  }

  private async setupScheduleForDate(date: Date): Promise<void> {
    try {
      const sunsetResult = await this.sunsetCalculationService.calculateSunsetTime(date);
      const sunset = sunsetResult.sunset;
      const location = sunsetResult.location;

      this.logger.info(
        `🌇 Calculated sunset time: ${sunset.toLocaleString()} for ${date.toDateString()}`
      );
      this.logger.info(
        `📍 Location: ${location.city}, ${location.country} (${location.latitude.toFixed(4)}°, ${location.longitude.toFixed(4)}°)`
      );

      if (this.sunsetCronJob) {
        this.sunsetCronJob.stop();
        this.sunsetCronJob = undefined;
        this.logger.info('🔄 Stopped previous sunset cron job');
      }

      const sunsetHour = sunset.getHours();
      const sunsetMinute = sunset.getMinutes();
      const cronExpression = `${sunsetMinute} ${sunsetHour} * * *`;

      this.logger.info(
        `⏰ Setting up sunset notification cron: "${cronExpression}" (${sunsetHour}:${sunsetMinute.toString().padStart(2, '0')})`
      );

      this.sunsetCronJob = cron.schedule(
        cronExpression,
        async () => {
          this.logger.info('🌅 Sunset time reached! Sending LINE notification');

          try {
            await this.sendSunsetNotification(location);
          } catch (error) {
            this.logger.error('❌ Failed to send sunset notification:', error);
          }
        },
        {
          timezone: 'Asia/Tokyo'
        }
      );

      this.logger.info('✅ Sunset notification cron job created successfully');

      if (process.env.NODE_ENV === 'development') {
        this.logger.debug('🧪 Development mode: Also creating traditional schedule for comparison');
        await this.createTraditionalSchedule(date, sunset, location);
      }
    } catch (error) {
      this.logger.error(`❌ Error setting up schedule for ${date.toDateString()}:`, error);
    }
  }

  private async sendSunsetNotification(location: LocationData): Promise<void> {
    try {
      this.logger.info('🚀 Sending sunset notification via LineMessageService');

      const result = await this.lineMessageService.sendTestMessage(
        `日が暮れてきました（${location.city}）。電気を点けますか？`
      );

      if (result.isSuccess()) {
        this.logger.info('✅ Sunset notification sent successfully via LineMessageService!');
      } else {
        this.logger.error('❌ Failed to send sunset notification:', result.getError());
      }
    } catch (error) {
      this.logger.error('❌ Failed to send sunset notification:', error);
    }
  }

  private async createTraditionalSchedule(
    date: Date,
    sunset: Date,
    location: LocationData
  ): Promise<void> {
    const scheduleIdValue = `sunset_notification_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`;

    const scheduleRequest: CreateScheduleRequest = {
      name: scheduleIdValue,
      config: {
        type: 'once',
        executionTime: sunset
      },
      action: {
        type: 'line_notification',
        target: 'user',
        parameters: {
          message: `🧪 [TRADITIONAL] 日が暮れてきました（${location.city}）。電気を点けますか？`,
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: '💡 点灯する',
                  data: 'action=turn_on_lights&reason=sunset'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: '❌ 必要なし',
                  data: 'action=decline&reason=sunset'
                }
              }
            ]
          }
        }
      }
    };

    const result = await this.manageScheduleUseCase.createSchedule(scheduleRequest);
    if (result.isSuccess()) {
      this.logger.debug(
        `🧪 Traditional schedule created: ${scheduleIdValue} at ${sunset.toLocaleString()}`
      );
    } else {
      this.logger.error(`❌ Failed to create traditional schedule: ${result.getError().message}`);
    }
  }

  async createDebugSchedule(minutesFromNow = 1): Promise<void> {
    try {
      const now = new Date();
      const executeAt = new Date(now.getTime() + minutesFromNow * 60 * 1000);
      const scheduleIdValue = `debug_sunset_${Date.now()}`;

      const sunsetData = await this.sunsetCalculationService.calculateSunsetTime(now);
      const location = sunsetData.location;

      const scheduleRequest: CreateScheduleRequest = {
        name: scheduleIdValue,
        config: {
          type: 'once',
          executionTime: executeAt
        },
        action: {
          type: 'line_notification',
          target: 'user',
          parameters: {
            message: `🧪 [DEBUG] 日が暮れてきました（${location.city}）。電気を点けますか？`,
            quickReply: {
              items: [
                {
                  type: 'action',
                  action: {
                    type: 'postback',
                    label: '💡 点灯する',
                    data: 'action=turn_on_lights&reason=sunset'
                  }
                },
                {
                  type: 'action',
                  action: {
                    type: 'postback',
                    label: '❌ 必要なし',
                    data: 'action=decline&reason=sunset'
                  }
                }
              ]
            }
          }
        }
      };

      const result = await this.manageScheduleUseCase.createSchedule(scheduleRequest);
      if (result.isSuccess()) {
        this.logger.info(
          `🧪 Debug schedule created: ${scheduleIdValue} at ${executeAt.toLocaleString()}`
        );
      } else {
        this.logger.error(`❌ Failed to create debug schedule: ${result.getError().message}`);
      }
    } catch (error) {
      this.logger.error('❌ Error creating debug schedule:', error);
    }
  }

  async getSunsetTime(date: Date = new Date()): Promise<{ sunset: Date; location: LocationData }> {
    return await this.sunsetCalculationService.calculateSunsetTime(date);
  }

  /**
   * 前日の睡眠データを取得してログに出力（統計表示用）
   */
  private async fetchAndLogSleepData(date: Date): Promise<void> {
    try {
      // 前日の睡眠データを取得（昨夜の睡眠統計を表示）
      const yesterday = new Date(date);
      yesterday.setDate(yesterday.getDate() - 1);

      this.logger.info(
        `😴 ${yesterday.toLocaleDateString('ja-JP')}（前日）の睡眠データを取得中...`
      );
      const sleepData = await this.calendarSyncService.getDailySleepEvents(yesterday);

      if (sleepData.sleepEvents.length === 0) {
        this.logger.info(
          `📊 ${yesterday.toLocaleDateString('ja-JP')}の睡眠データが見つかりませんでした`
        );
        return;
      }

      // 睡眠統計を取得
      const stats = await this.calendarSyncService.getSleepStatistics(yesterday);

      this.logger.info(`📊 ${yesterday.toLocaleDateString('ja-JP')}の睡眠統計:`);
      this.logger.info(`   睡眠イベント数: ${sleepData.sleepEvents.length}件`);
      this.logger.info(`   合計睡眠時間: ${stats.totalSleepTime}`);
      this.logger.info(`   平均就寝時刻: ${stats.averageBedtime}`);
      this.logger.info(`   平均起床時刻: ${stats.averageWakeTime}`);

      // 個別の睡眠イベントをログ出力
      for (const event of sleepData.sleepEvents) {
        this.logger.info(
          `   🛏️ ${event.summary}: ${event.startTime.toLocaleTimeString('ja-JP')} - ${event.endTime.toLocaleTimeString('ja-JP')} (${Math.floor(event.duration / 60)}時間${event.duration % 60}分)`
        );
      }
    } catch (error) {
      this.logger.error('前日の睡眠データの取得に失敗:', error);
    }
  }

  /**
   * 睡眠データを取得（外部からアクセス可能）
   */
  async getSleepData(date: Date = new Date()): Promise<DailySleepData | null> {
    try {
      return await this.calendarSyncService.getDailySleepEvents(date);
    } catch (error) {
      this.logger.error('睡眠データの取得に失敗:', error);
      return null;
    }
  }

  /**
   * 今日の睡眠スケジュールを設定（今夜の通知用）
   */
  private async setupSleepScheduleForToday(date: Date): Promise<void> {
    try {
      this.logger.info(
        `😴 ${date.toLocaleDateString('ja-JP')}（今日）の睡眠スケジュールを設定中...`
      );

      // 今日の睡眠スケジュールを設定（今夜の通知用）
      const sleepSchedules = await this.sleepScheduleService.setupSleepSchedules(date);

      if (sleepSchedules.length === 0) {
        this.logger.info(
          `📅 ${date.toLocaleDateString('ja-JP')}の睡眠スケジュールが見つかりませんでした`
        );
      } else {
        this.logger.info(`✅ ${sleepSchedules.length}件の睡眠スケジュールを設定しました`);

        // 設定した睡眠スケジュールをログに出力
        for (const schedule of sleepSchedules) {
          this.logger.info(
            `   😴 ${schedule.sleepEvent.summary}: ${schedule.scheduleTime.toLocaleTimeString('ja-JP')} (${schedule.cronExpression})`
          );
        }
      }

      // 明日の起床スケジュールも設定（今夜寝て明日起きる分）
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);

      this.logger.info(
        `⏰ ${tomorrow.toLocaleDateString('ja-JP')}（明日）の起床スケジュールを設定中...`
      );

      const wakeupSchedules = await this.sleepScheduleService.setupWakeupSchedules(tomorrow);

      if (wakeupSchedules.length === 0) {
        this.logger.info(
          `📅 ${tomorrow.toLocaleDateString('ja-JP')}の起床スケジュールが見つかりませんでした`
        );
      } else {
        this.logger.info(`✅ ${wakeupSchedules.length}件の起床スケジュールを設定しました`);

        // 設定した起床スケジュールをログに出力
        for (const schedule of wakeupSchedules) {
          this.logger.info(
            `   ⏰ ${schedule.sleepEvent.summary}: ${schedule.scheduleTime.toLocaleTimeString('ja-JP')} (${schedule.cronExpression})`
          );
        }
      }
    } catch (error) {
      this.logger.error('睡眠・起床スケジュールの設定に失敗:', error);
    }
  }

  /**
   * デバッグ用: 即座に睡眠スケジュールを作成
   */
  async createDebugSleepSchedule(minutesFromNow = 1): Promise<void> {
    try {
      await this.sleepScheduleService.createDebugSleepSchedule(minutesFromNow);
      this.logger.info(`🧪 デバッグ用睡眠スケジュールを${minutesFromNow}分後に設定しました`);
    } catch (error) {
      this.logger.error('デバッグ睡眠スケジュールの作成に失敗:', error);
    }
  }

  /**
   * デバッグ用: 即座に起床スケジュールを作成
   */
  async createDebugWakeupSchedule(minutesFromNow = 1): Promise<void> {
    try {
      await this.sleepScheduleService.createDebugWakeupSchedule(minutesFromNow);
      this.logger.info(`🧪 デバッグ用起床スケジュールを${minutesFromNow}分後に設定しました`);
    } catch (error) {
      this.logger.error('デバッグ起床スケジュールの作成に失敗:', error);
    }
  }
}
