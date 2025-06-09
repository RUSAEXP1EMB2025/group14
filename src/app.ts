import { Client, WebhookEvent } from '@line/bot-sdk';
import { handleMessage } from './handlers/messageHandler';
import { logger } from './utils/logger';
import 'dotenv/config';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!
};

const client = new Client(config);

// サーバー起動時のログ
logger.info('LINE Bot サーバーを起動中...');

export default {
  port: process.env.PORT || 3000,

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    logger.info(`${method} ${url.pathname}`);

    // ヘルスチェックエンドポイント
    if (url.pathname === '/health' && method === 'GET') {
      return Response.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    }

    // LINE Webhookエンドポイント
    if (url.pathname === '/webhook' && method === 'POST') {
      try {
        const body = await request.json();
        const events: WebhookEvent[] = body.events || [];

        logger.info(`受信イベント数: ${events.length}`);

        // 各イベントを並列処理
        const promises = events.map(event => handleEvent(event, client));
        await Promise.all(promises);

        return new Response('OK');
      } catch (error) {
        logger.error('Webhook処理エラー:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    }

    // 404エラー
    return new Response('Not Found', { status: 404 });
  }
};

async function handleEvent(event: WebhookEvent, client: Client): Promise<void> {
  logger.info(`イベントタイプ: ${event.type}`);

  try {
    switch (event.type) {
      case 'message':
        await handleMessage(event, client);
        break;
      case 'follow':
        logger.info('新しいユーザーがフォローしました');
        break;
      case 'unfollow':
        logger.info('ユーザーがアンフォローしました');
        break;
      default:
        logger.info(`未対応のイベントタイプ: ${event.type}`);
    }
  } catch (error) {
    logger.error(`イベント処理エラー (${event.type}):`, error);
  }
}
