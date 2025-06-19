import { logger } from './logger.ts';

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

export async function autoUpdateWebhookForDev(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  logger.info('🔄 Checking for ngrok URL to auto-update webhook...');

  const ngrokUrl = await getNgrokUrl();
  if (ngrokUrl) {
    logger.info(`🌐 Detected ngrok URL: ${ngrokUrl}`);
    await updateWebhookUrl(ngrokUrl);
  } else {
    logger.info('i No ngrok URL detected, webhook not updated');
  }
}
