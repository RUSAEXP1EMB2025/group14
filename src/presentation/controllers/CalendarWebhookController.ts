import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory.ts';
import type { CalendarWebhookService } from '../../application/services/CalendarWebhookService.ts';

export interface CalendarWebhookRequest {
  readonly channelId: string;
  readonly channelToken: string;
  readonly channelExpiration: string;
  readonly messageNumber: number;
  readonly resourceId: string;
  readonly resourceState: string;
  readonly resourceUri: string;
}

export class CalendarWebhookController {
  private readonly logger: ILogger;

  constructor(
    private readonly calendarWebhookService: CalendarWebhookService
  ) {
    this.logger = LoggerFactory.create('CalendarWebhookController');
  }

  /**
   * Google Calendar Webhookを処理
   */
  async handleWebhook(request: Request): Promise<Response> {
    try {
      // Googleからの認証ヘッダーを確認
      const channelId = request.headers.get('X-Goog-Channel-ID');
      const channelToken = request.headers.get('X-Goog-Channel-Token');
      const resourceState = request.headers.get('X-Goog-Resource-State');
      const resourceId = request.headers.get('X-Goog-Resource-ID');
      const resourceUri = request.headers.get('X-Goog-Resource-URI');
      const messageNumber = request.headers.get('X-Goog-Message-Number');
      const channelExpiration = request.headers.get('X-Goog-Channel-Expiration');

      if (!channelId || !resourceState) {
        this.logger.warn('Invalid Google Calendar webhook headers');
        return new Response('Bad Request', { status: 400 });
      }

      this.logger.info('📅 Google Calendar webhook received', {
        channelId,
        resourceState,
        resourceId,
        messageNumber
      });

      // sync状態は初期の同期なので無視
      if (resourceState === 'sync') {
        this.logger.debug('Ignoring sync notification');
        return new Response('OK', { status: 200 });
      }

      // カレンダーの変更を処理
      if (resourceState === 'exists') {
        const webhookData: CalendarWebhookRequest = {
          channelId,
          channelToken: channelToken || '',
          channelExpiration: channelExpiration || '',
          messageNumber: Number.parseInt(messageNumber || '0', 10),
          resourceId: resourceId || '',
          resourceState,
          resourceUri: resourceUri || ''
        };

        const result = await this.calendarWebhookService.handleCalendarChange(webhookData);

        if (result.isFailure()) {
          this.logger.error('Failed to process calendar webhook:', result.getError());
          return new Response('Internal Server Error', { status: 500 });
        }

        this.logger.info('✅ Calendar webhook processed successfully');
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      this.logger.error('Error handling calendar webhook:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  /**
   * Webhook購読の確認（Google Calendar API設定時）
   */
  async verifyWebhook(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const challenge = url.searchParams.get('challenge');

      if (challenge) {
        this.logger.info('📅 Calendar webhook verification received');
        return new Response(challenge, { status: 200 });
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      this.logger.error('Error verifying calendar webhook:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  /**
   * Webhook購読のヘルスチェック
   */
  async healthCheck(): Promise<Response> {
    try {
      const status = await this.calendarWebhookService.getWebhookStatus();
      
      return new Response(
        JSON.stringify({
          status: 'healthy',
          webhook: status,
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      this.logger.error('Calendar webhook health check failed:', error);
      return new Response(
        JSON.stringify({
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  /**
   * 手動でカレンダー変更通知をテスト
   */
  async testCalendarWebhook(): Promise<Response> {
    try {
      this.logger.info('🧪 カレンダーWebhookテストを開始');
      
      const testWebhookData = {
        channelId: `test-${Date.now()}`,
        channelToken: 'test-token',
        channelExpiration: '',
        messageNumber: 1,
        resourceId: 'test-resource',
        resourceState: 'exists',
        resourceUri: 'test-uri'
      };

      const result = await this.calendarWebhookService.handleCalendarChange(testWebhookData);

      if (result.isSuccess()) {
        const data = result.getValue();
        return new Response(
          JSON.stringify({
            success: true,
            message: 'テスト実行成功',
            result: data,
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: result.getError().message,
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      this.logger.error('カレンダーWebhookテスト失敗:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  /**
   * 手動で睡眠スケジュール更新をトリガー
   */
  async manualSleepScheduleUpdate(): Promise<Response> {
    try {
      this.logger.info('🔄 手動で睡眠スケジュール更新を実行');
      
      const result = await this.calendarWebhookService.manualSleepScheduleUpdate();

      if (result.isSuccess()) {
        const data = result.getValue();
        return new Response(
          JSON.stringify({
            success: true,
            message: '手動更新成功',
            result: data,
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: result.getError().message,
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      this.logger.error('手動更新失敗:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
}
