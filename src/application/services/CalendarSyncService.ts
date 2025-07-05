import { google, Auth } from 'googleapis';
import type { calendar_v3 } from 'googleapis';
import * as fs from 'fs';
import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory.ts';

export interface SleepEvent {
  readonly id: string;
  readonly summary: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly duration: number;
}

export interface DailySleepData {
  readonly date: string;
  readonly sleepEvents: SleepEvent[];
  readonly totalSleepMinutes: number;
}

export class CalendarSyncService {
  private readonly logger: ILogger;
  private oauth2Client: Auth.OAuth2Client | null = null;

  constructor() {
    this.logger = LoggerFactory.create('CalendarSyncService');
  }

  /**
   * 認証情報を読み込み
   */
  private async loadCredentials(): Promise<Auth.OAuth2Client | null> {
    try {
      const tokenPath = 'token.json';
      const content = await fs.promises.readFile(tokenPath, 'utf-8');
      const credentials = JSON.parse(content);

      const oauth2Client = google.auth.fromJSON(credentials) as Auth.OAuth2Client;
      this.oauth2Client = oauth2Client;

      this.logger.debug('Google認証情報を読み込みました');
      return oauth2Client;
    } catch (error) {
      this.logger.error('Google認証情報の読み込みに失敗:', error);
      return null;
    }
  }

  /**
   * 指定日の睡眠イベントを取得
   */
  async getDailySleepEvents(date: Date = new Date()): Promise<DailySleepData> {
    try {
      const auth = await this.loadCredentials();
      if (!auth) {
        throw new Error('Google認証に失敗しました');
      }

      const calendar = google.calendar({ version: 'v3', auth });

      // その日の開始時刻と終了時刻を設定
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      this.logger.info(`📅 ${date.toLocaleDateString('ja-JP')}の睡眠イベントを取得中...`);

      // カレンダーイベントを取得
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = response.data.items || [];
      this.logger.debug(`📋 取得したイベント数: ${events.length}`);

      // 睡眠関連のイベントをフィルタリング
      const sleepEvents: SleepEvent[] = [];

      for (const event of events) {
        if (!event.summary) continue;

        const summary = event.summary.toLowerCase();
        const isSleepEvent = this.isSleepRelatedEvent(summary);

        if (isSleepEvent) {
          const sleepEvent = this.convertToSleepEvent(event);
          if (sleepEvent) {
            sleepEvents.push(sleepEvent);
            this.logger.info(
              `😴 睡眠イベント検出: ${sleepEvent.summary} (${sleepEvent.startTime.toLocaleTimeString('ja-JP')} - ${sleepEvent.endTime.toLocaleTimeString('ja-JP')})`
            );
          }
        }
      }

      // 合計睡眠時間を計算
      const totalSleepMinutes = sleepEvents.reduce((total, event) => total + event.duration, 0);

      const result: DailySleepData = {
        date: date.toLocaleDateString('ja-JP'),
        sleepEvents,
        totalSleepMinutes
      };

      this.logger.info(
        `💤 ${result.date}の睡眠データ: ${sleepEvents.length}件のイベント, 合計${Math.floor(totalSleepMinutes / 60)}時間${totalSleepMinutes % 60}分`
      );

      return result;
    } catch (error) {
      this.logger.error('睡眠イベントの取得に失敗:', error);
      throw new Error(
        `睡眠イベントの取得に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * 睡眠関連のイベントかどうかを判定
   */
  private isSleepRelatedEvent(summary: string): boolean {
    const sleepKeywords = [
      '睡眠',
      'すいみん',
      'sleep',
      '就寝',
      'しゅうしん',
      '眠り',
      'ねむり',
      '寝る',
      'ねる',
      'bedtime',
      '休息',
      'きゅうそく',
      'rest'
    ];

    return sleepKeywords.some(keyword => summary.includes(keyword));
  }

  /**
   * GoogleカレンダーイベントをSleepEventに変換
   */
  private convertToSleepEvent(event: calendar_v3.Schema$Event): SleepEvent | null {
    try {
      if (!event.start || !event.end) {
        this.logger.warn('イベントに開始時刻または終了時刻がありません:', event.summary);
        return null;
      }

      // 日時の解析
      const startTime = event.start?.dateTime
        ? new Date(event.start.dateTime)
        : event.start?.date
          ? new Date(event.start.date)
          : null;

      const endTime = event.end?.dateTime
        ? new Date(event.end.dateTime)
        : event.end?.date
          ? new Date(event.end.date)
          : null;

      if (!startTime || !endTime) {
        this.logger.warn('開始時刻または終了時刻が取得できません:', event.summary);
        return null;
      }

      // 期間の計算（分単位）
      const durationMs = endTime.getTime() - startTime.getTime();
      const duration = Math.round(durationMs / (1000 * 60));

      return {
        id: event.id || 'unknown',
        summary: event.summary || '名前なし',
        startTime,
        endTime,
        duration
      };
    } catch (error) {
      this.logger.error('イベントの変換に失敗:', error);
      return null;
    }
  }

  /**
   * 睡眠統計を取得
   */
  async getSleepStatistics(date: Date = new Date()): Promise<{
    averageBedtime: string;
    averageWakeTime: string;
    totalSleepTime: string;
    sleepEfficiency: number;
  }> {
    const sleepData = await this.getDailySleepEvents(date);

    if (sleepData.sleepEvents.length === 0) {
      return {
        averageBedtime: '不明',
        averageWakeTime: '不明',
        totalSleepTime: '0時間0分',
        sleepEfficiency: 0
      };
    }

    // 平均就寝時刻と起床時刻を計算
    const bedtimes = sleepData.sleepEvents.map(
      e => e.startTime.getHours() * 60 + e.startTime.getMinutes()
    );
    const waketimes = sleepData.sleepEvents.map(
      e => e.endTime.getHours() * 60 + e.endTime.getMinutes()
    );

    const avgBedtime = bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length;
    const avgWaketime = waketimes.reduce((a, b) => a + b, 0) / waketimes.length;

    const avgBedHour = Math.floor(avgBedtime / 60);
    const avgBedMin = Math.round(avgBedtime % 60);
    const avgWakeHour = Math.floor(avgWaketime / 60);
    const avgWakeMin = Math.round(avgWaketime % 60);

    return {
      averageBedtime: `${avgBedHour.toString().padStart(2, '0')}:${avgBedMin.toString().padStart(2, '0')}`,
      averageWakeTime: `${avgWakeHour.toString().padStart(2, '0')}:${avgWakeMin.toString().padStart(2, '0')}`,
      totalSleepTime: `${Math.floor(sleepData.totalSleepMinutes / 60)}時間${sleepData.totalSleepMinutes % 60}分`,
      sleepEfficiency:
        sleepData.totalSleepMinutes > 0
          ? Math.round((sleepData.totalSleepMinutes / (24 * 60)) * 100)
          : 0
    };
  }

  /**
   * Google Calendar Webhookを設定
   */
  async setupCalendarWebhook(): Promise<Result<string>> {
    try {
      const auth = await this.loadCredentials();
      if (!auth) {
        return Result.failure(new Error('Google認証に失敗しました'));
      }

      const calendar = google.calendar({ version: 'v3', auth });
      
      // Webhook URL（本番環境では実際のドメインを使用）
      const webhookUrl = process.env.WEBHOOK_URL || 'https://your-domain.com/webhook/calendar';
      
      // チャンネルIDを生成
      const channelId = `sleep-calendar-${Date.now()}`;
      
      // Webhookを登録
      const response = await calendar.events.watch({
        calendarId: 'primary',
        requestBody: {
          id: channelId,
          type: 'web_hook',
          address: webhookUrl,
          params: {
            ttl: (7 * 24 * 60 * 60).toString() // 7日間
          }
        }
      });

      this.logger.info('📅 Google Calendar Webhook設定完了', {
        channelId,
        resourceId: response.data.resourceId,
        expiration: response.data.expiration
      });

      return Result.success(channelId);
    } catch (error) {
      this.logger.error('Google Calendar Webhook設定失敗:', error);
      return Result.failure(new Error(`Webhook setup failed: ${error}`));
    }
  }

  /**
   * Webhookの購読を停止
   */
  async stopCalendarWebhook(channelId: string, resourceId: string): Promise<Result<void>> {
    try {
      const auth = await this.loadCredentials();
      if (!auth) {
        return Result.failure(new Error('Google認証に失敗しました'));
      }

      const calendar = google.calendar({ version: 'v3', auth });
      
      await calendar.channels.stop({
        requestBody: {
          id: channelId,
          resourceId: resourceId
        }
      });

      this.logger.info('📅 Google Calendar Webhook購読停止完了', { channelId, resourceId });
      return Result.success(undefined);
    } catch (error) {
      this.logger.error('Webhook購読停止失敗:', error);
      return Result.failure(new Error(`Webhook stop failed: ${error}`));
    }
  }
}
