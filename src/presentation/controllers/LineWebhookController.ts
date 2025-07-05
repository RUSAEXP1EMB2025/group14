import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { LineWebhookService } from '../../application/index.ts';
import type { LineWebhookRequest, LineWebhookResponse } from '../../application/index.ts';

export interface WebhookValidationResult {
  readonly isValid: boolean;
  readonly error?: string;
}

export class LineWebhookController {
  constructor(
    private readonly lineWebhookService: LineWebhookService,
    private readonly logger: ILogger,
    private readonly channelSecret: string
  ) {}

  /**
   * Webhookリクエストを処理
   */
  async handleWebhook(request: Request): Promise<Response> {
    try {
      this.logger.info('LINE Webhook request received');

      // リクエストボディを取得
      const rawBody = await request.text();

      // 署名検証
      const signature = request.headers.get('x-line-signature');
      if (!signature) {
        this.logger.error('Missing LINE signature header');
        return new Response('Unauthorized', { status: 401 });
      }

      const validationResult = this.validateWebhook(rawBody, signature);
      if (!validationResult.isValid) {
        this.logger.error(`Webhook validation failed: ${validationResult.error}`);
        return new Response('Unauthorized', { status: 401 });
      }

      // JSONをパース
      let webhookRequest: LineWebhookRequest;
      try {
        webhookRequest = JSON.parse(rawBody);
      } catch (error) {
        this.logger.error('Invalid JSON in webhook request:', error);
        return new Response('Bad Request', { status: 400 });
      }

      // Webhookを処理
      const result = await this.lineWebhookService.processWebhook(webhookRequest);

      if (!result.isSuccess()) {
        this.logger.error('Webhook processing failed:', result.error);
        return new Response('Internal Server Error', { status: 500 });
      }

      const response = result.data!;

      // 部分的な成功でも200を返す（LINE側の仕様）
      this.logger.info(
        `Webhook processed: ${response.processedEvents} events, ${response.errors.length} errors`
      );

      return new Response('OK', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    } catch (error) {
      this.logger.error('Unexpected error in webhook handler:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  /**
   * ヘルスチェックエンドポイント
   */
  async handleHealthCheck(): Promise<Response> {
    try {
      const health = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'LINE Bot Webhook',
        version: '1.0.0'
      };

      return new Response(JSON.stringify(health, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      this.logger.error('Health check error:', error);
      return new Response('Service Unavailable', { status: 503 });
    }
  }

  /**
   * フォローイベントを処理
   */
  async handleFollowEvent(userId: string): Promise<Response> {
    try {
      const result = await this.lineWebhookService.processFollowEvent(userId);

      if (!result.isSuccess()) {
        this.logger.error('Follow event processing failed:', result.error);
        return new Response('Internal Server Error', { status: 500 });
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      this.logger.error('Follow event error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  /**
   * アンフォローイベントを処理
   */
  async handleUnfollowEvent(userId: string): Promise<Response> {
    try {
      const result = await this.lineWebhookService.processUnfollowEvent(userId);

      if (!result.isSuccess()) {
        this.logger.error('Unfollow event processing failed:', result.error);
        return new Response('Internal Server Error', { status: 500 });
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      this.logger.error('Unfollow event error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  /**
   * 開発用のWebhook情報エンドポイント
   */
  async handleWebhookInfo(): Promise<Response> {
    try {
      const info = {
        endpoint: '/webhook',
        method: 'POST',
        contentType: 'application/json',
        headers: {
          required: ['x-line-signature'],
          optional: ['user-agent']
        },
        validation: {
          signature: 'HMAC-SHA256',
          secret: 'Channel Secret required'
        },
        events: {
          supported: ['message', 'follow', 'unfollow'],
          messageTypes: ['text']
        },
        responses: {
          200: 'OK - Event processed successfully',
          401: 'Unauthorized - Invalid signature',
          400: 'Bad Request - Invalid JSON',
          500: 'Internal Server Error - Processing failed'
        }
      };

      return new Response(JSON.stringify(info, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      this.logger.error('Webhook info error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  /**
   * Webhookの署名を検証
   */
  private validateWebhook(body: string, signature: string): WebhookValidationResult {
    try {
      const isValid = this.lineWebhookService.verifySignature(body, signature, this.channelSecret);

      if (!isValid) {
        return {
          isValid: false,
          error: 'Invalid signature'
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: `Validation error: ${error}`
      };
    }
  }

  /**
   * CORS対応のためのプリフライトリクエスト処理
   */
  async handleOptions(): Promise<Response> {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-line-signature',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
}
