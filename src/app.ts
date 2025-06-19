import type { WebhookEvent } from '@line/bot-sdk';
import { logger } from './utils/logger.ts';
import { getEnvVar, getEnvVarWithDefault } from './utils/env.ts';
import { getNgrokUrl, autoUpdateWebhookForDev } from './utils/ngrok.ts';
import { LineService } from './services/LineService.ts';
import { NatureRemoService } from './services/NatureRemoService.ts';
import { ScheduleManager } from './services/ScheduleManager.ts';
import { MessageHandler } from './handlers/messageHandler.ts';
import 'dotenv/config';

// 型ガード関数
function isLineWebhookBody(obj: unknown): obj is { events: WebhookEvent[] } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'events' in obj &&
    Array.isArray((obj as { events: unknown }).events)
  );
}

class BotApplication {
  private lineService: LineService;
  private remoService: NatureRemoService;
  private scheduleManager: ScheduleManager;
  private messageHandler: MessageHandler;
  public port: number;

  constructor() {
    this.port = Number.parseInt(getEnvVarWithDefault('PORT', '3000'));
    const config = {
      channelAccessToken: getEnvVar('LINE_CHANNEL_ACCESS_TOKEN'),
      channelSecret: getEnvVar('LINE_CHANNEL_SECRET'),
      remoAccessToken: getEnvVar('NATURE_REMO_ACCESS_TOKEN')
    };

    // サービスの初期化
    this.lineService = new LineService(config.channelAccessToken);
    this.remoService = new NatureRemoService(config.remoAccessToken);
    this.scheduleManager = new ScheduleManager(this.lineService, this.remoService);
    this.messageHandler = new MessageHandler(this.lineService, this.remoService);
  }

  async initialize(): Promise<void> {
    logger.info(`🚀 LINE Bot サーバーを起動中... ポート: ${this.port}`);

    // 開発環境でのngrok自動設定
    if (process.env.NODE_ENV === 'development') {
      setTimeout(async () => {
        await autoUpdateWebhookForDev();
      }, 2000);
    }

    // プロセス終了時のクリーンアップ
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());

    logger.info(`✅ アプリケーション初期化完了 - ポート: ${this.port} で待機中`);
  }

  private cleanup(): void {
    logger.info('🧹 アプリケーションクリーンアップ中...');
    this.scheduleManager.cleanup();
    process.exit(0);
  }

  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const userAgent = request.headers.get('user-agent') || 'unknown';

    logger.info(`📝 ${method} ${url.pathname} - UA: ${userAgent}`);

    // ヘルスチェック
    if (url.pathname === '/health' && method === 'GET') {
      return await this.handleHealthCheck();
    }

    // 開発用エンドポイント
    if (process.env.NODE_ENV === 'development') {
      if (url.pathname === '/dev/ngrok-info' && method === 'GET') {
        return await this.handleDevInfo();
      }

      if (url.pathname === '/dev/update-webhook' && method === 'POST') {
        return await this.handleWebhookUpdate();
      }
    }

    // Webhook処理
    if (url.pathname === '/webhook' && method === 'POST') {
      return await this.handleWebhook(request);
    }

    logger.info('❓ 未対応パス:', url.pathname);
    return new Response('Not Found', { status: 404 });
  }

  private async handleHealthCheck(): Promise<Response> {
    const ngrokUrl = process.env.NODE_ENV === 'development' ? await getNgrokUrl() : null;

    const healthResponse = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      server: 'Bun',
      port: this.port,
      environment: process.env.NODE_ENV || 'development',
      ...(ngrokUrl && {
        ngrokUrl,
        webhookUrl: `${ngrokUrl}/webhook`,
        ngrokDashboard: 'http://localhost:4040'
      })
    };

    logger.info('✅ ヘルスチェック応答:', healthResponse);
    return Response.json(healthResponse);
  }

  private async handleDevInfo(): Promise<Response> {
    const ngrokUrl = await getNgrokUrl();
    const devInfo = {
      ngrokUrl,
      webhookUrl: ngrokUrl ? `${ngrokUrl}/webhook` : null,
      ngrokDashboard: 'http://localhost:4040',
      localUrl: `http://localhost:${this.port}`,
      canUpdateWebhook: !!process.env.LINE_CHANNEL_ACCESS_TOKEN
    };

    logger.info('🔍 開発情報取得:', devInfo);
    return Response.json(devInfo);
  }

  private async handleWebhookUpdate(): Promise<Response> {
    try {
      const ngrokUrl = await getNgrokUrl();
      if (!ngrokUrl) {
        return Response.json({ error: 'Ngrok URL not available' }, { status: 400 });
      }
      const { updateWebhookUrl } = await import('./utils/ngrok.ts');
      const result = await updateWebhookUrl(ngrokUrl);
      return Response.json(result);
    } catch (error) {
      logger.error('Webhook更新エラー:', error);
      return Response.json({ error: 'Failed to update webhook' }, { status: 500 });
    }
  }

  private async handleWebhook(request: Request): Promise<Response> {
    try {
      logger.info('📨 Webhook受信開始');

      const rawBody = await request.json();

      if (!isLineWebhookBody(rawBody)) {
        logger.error('❌ 無効なWebhookボディ:', rawBody);
        return new Response('Bad Request: Invalid webhook body', { status: 400 });
      }

      const events: WebhookEvent[] = rawBody.events;
      logger.info(`📊 受信イベント数: ${events.length}`);

      if (events.length > 0) {
        const promises = events.map(event => this.handleEvent(event));
        await Promise.all(promises);
      }

      logger.info('✅ Webhook処理完了');
      return new Response('OK');
    } catch (error) {
      logger.error('❌ Webhook処理エラー:', error);

      if (error instanceof SyntaxError) {
        logger.error('JSON解析エラー: 無効なJSON形式');
        return new Response('Bad Request: Invalid JSON', { status: 400 });
      }

      return new Response('Internal Server Error', { status: 500 });
    }
  }

  private async handleEvent(event: WebhookEvent): Promise<void> {
    logger.info(`🎯 イベントタイプ: ${event.type}`);

    try {
      switch (event.type) {
        case 'message':
          await this.messageHandler.handleMessage(event);
          return;
        case 'follow':
          logger.info('👋 新しいユーザーがフォローしました');
          return;
        case 'unfollow':
          logger.info('👋 ユーザーがアンフォローしました');
          return;
        default:
          logger.info(`🤔 未対応のイベントタイプ: ${event.type}`);
          return;
      }
    } catch (error) {
      logger.error(`💥 イベント処理エラー (${event.type}):`, error);
    }
  }
}

// アプリケーションインスタンスの作成と初期化
const app = new BotApplication();
await app.initialize();

// Bunサーバーの起動
const server = Bun.serve({
  port: app.port,
  async fetch(request: Request): Promise<Response> {
    return app.handleRequest(request);
  }
});

logger.info(`🌟 サーバーがポート ${server.port} で起動しました`);
