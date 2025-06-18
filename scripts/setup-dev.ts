import { spawn } from 'node:child_process';
import { logger } from '../src/utils/logger.ts';
import { getNgrokUrl, updateWebhookUrl } from '../src/utils/ngrok.ts';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function startNgrok(): Promise<void> {
  return new Promise(resolve => {
    logger.info('🌐 Starting ngrok...');

    const ngrokProcess = spawn('ngrok', ['http', '3000'], {
      stdio: 'pipe'
    });

    let resolved = false;

    ngrokProcess.stdout?.on('data', data => {
      const output = data.toString();
      if (output.includes('started tunnel') && !resolved) {
        resolved = true;
        resolve();
      }
    });

    ngrokProcess.stderr?.on('data', data => {
      const errorOutput = data.toString();
      if (errorOutput.includes('ERROR') || errorOutput.includes('ERRO')) {
        logger.error('🚨 Ngrok error:', errorOutput);
      }
    });

    // 10秒でタイムアウト
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        logger.info('⏰ Ngrok startup timeout, continuing...');
        resolve();
      }
    }, 10000);

    // プロセス終了時にngrokも停止
    const cleanup = () => {
      logger.info('🛑 Shutting down ngrok...');
      ngrokProcess.kill();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  });
}

async function startServer(): Promise<void> {
  return new Promise(resolve => {
    logger.info('🚀 Starting development server with hot reload...');

    const serverProcess = spawn('bun', ['--hot', 'src/app.ts'], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    });

    // プロセス終了時にサーバーも停止
    const cleanup = () => {
      logger.info('🛑 Shutting down server...');
      serverProcess.kill();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    resolve();
  });
}

async function main() {
  try {
    logger.info('🚀 Setting up LINE Bot development environment...');

    // 環境変数チェック
    if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
      logger.error('❌ LINE_CHANNEL_ACCESS_TOKEN is not set');
      logger.info('💡 Please create .env file with your LINE Bot credentials');
      logger.info('📝 Example: LINE_CHANNEL_ACCESS_TOKEN=your_token_here');
      process.exit(1);
    }

    // ngrokを起動
    await startNgrok();

    // ngrokが完全に起動するまで待機
    logger.info('⏳ Waiting for ngrok to start...');
    await sleep(3000);

    // ngrok URLを取得して webhook URLを更新
    const ngrokUrl = await getNgrokUrl();

    if (ngrokUrl) {
      logger.info(`🌐 Ngrok URL: ${ngrokUrl}`);

      const success = await updateWebhookUrl(ngrokUrl);

      if (success) {
        logger.info('✅ Development environment ready!');
        logger.info(`🔗 Access your app at: ${ngrokUrl}`);
        logger.info('📊 Ngrok dashboard: http://localhost:4040');
        logger.info(`🔍 Health check: ${ngrokUrl}/health`);
      } else {
        logger.warn('! Failed to update webhook URL, but continuing...');
      }
    } else {
      logger.warn('! Could not get ngrok URL. Make sure ngrok is installed');
      logger.info('💡 Install ngrok: https://ngrok.com/download');
    }

    // サーバーを起動
    await startServer();
  } catch (error) {
    logger.error('❌ Failed to start development environment:', error);
    process.exit(1);
  }
}

main();
