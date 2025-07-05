import { LoggerFactory } from '../infrastructure/logger/LoggerFactory.ts';
import { CalendarSyncService } from '../application/services/CalendarSyncService.ts';

const logger = LoggerFactory.create('Ngrok');

interface NgrokTunnel {
  proto: string;
  public_url: string;
}

export async function updateWebhookUrl(ngrokUrl: string): Promise<boolean> {
  if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
    logger.warn('! LINE_CHANNEL_ACCESS_TOKEN not set, skipping webhook update');
    return false;
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/channel/webhook/endpoint', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: `${ngrokUrl}/webhook`
      })
    });

    if (response.ok) {
      logger.info(`✅ Webhook URL auto-updated to: ${ngrokUrl}/webhook`);
      return true;
    }

    const errorText = await response.text();
    logger.error('❌ Failed to update webhook URL:', errorText);
    return false;
  } catch (error) {
    logger.error('❌ Failed to update webhook URL:', error);
    return false;
  }
}

export async function getNgrokUrl(): Promise<string | null> {
  try {
    const response = await fetch('http://ngrok:4040/api/tunnels');

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { tunnels: NgrokTunnel[] };
    const tunnels = data.tunnels;
    if (!Array.isArray(tunnels)) {
      return null;
    }

    const httpTunnel = tunnels.find((t: NgrokTunnel) => t.proto === 'https');
    return httpTunnel?.public_url || null;
  } catch {
    logger.debug('🔍 Could not get ngrok URL (ngrok not running?)');
    return null;
  }
}

/**
 * GoogleカレンダーのWebhookを自動更新
 */
export async function updateCalendarWebhook(ngrokUrl: string): Promise<boolean> {
  try {
    // 環境変数を一時的に設定
    const originalWebhookUrl = process.env.WEBHOOK_URL;
    process.env.WEBHOOK_URL = `${ngrokUrl}/webhook/calendar`;

    const calendarService = new CalendarSyncService();
    const result = await calendarService.setupCalendarWebhook();

    // 元の環境変数を復元
    if (originalWebhookUrl) {
      process.env.WEBHOOK_URL = originalWebhookUrl;
    } else {
      process.env.WEBHOOK_URL = '';
    }

    if (result.isSuccess()) {
      const channelId = result.getValue();
      logger.info(`✅ Calendar Webhook auto-updated: ${ngrokUrl}/webhook/calendar`);
      logger.debug(`📋 Calendar Channel ID: ${channelId}`);
      return true;
    }
    
    logger.error('❌ Failed to update calendar webhook:', result.getError());
    return false;
  } catch (error) {
    logger.error('❌ Failed to update calendar webhook:', error);
    return false;
  }
}

export async function autoUpdateWebhookForDev(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  logger.info('🔄 Checking for ngrok URL to auto-update webhook...');

  const ngrokUrl = await getNgrokUrl();
  if (ngrokUrl) {
    logger.info(`🌐 Detected ngrok URL: ${ngrokUrl}`);
    
    // LINEのWebhook更新
    await updateWebhookUrl(ngrokUrl);
    
    // GoogleカレンダーのWebhook更新
    logger.info('📅 Setting up Google Calendar webhook...');
    await updateCalendarWebhook(ngrokUrl);
  } else {
    logger.info('i No ngrok URL detected, webhook not updated');
  }
}
