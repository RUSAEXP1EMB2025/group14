import 'dotenv/config';
import {
  DeviceAutomationService,
  LineWebhookService,
  DailyScheduleSetupService,
  CalendarWebhookService
} from './application/services/index.ts';
import {
  ControlDeviceUseCase,
  ManageScheduleUseCase,
  ProcessMessageUseCase
} from './application/usecases/index.ts';
import { DeviceControlService as ApplicationDeviceControlService } from './application/services/DeviceControlService.ts';
import { MessageService, ScheduleService } from './domain/services/index.ts';
import {
  MockMessageRepository,
  MockScheduleRepository,
  NatureRemoDeviceRepository,
  LineApiClient,
  LineApiClientAdapter
} from './external/index.ts';
import { ConfigManager } from './infrastructure/env/ConfigManager.ts';
import { LoggerFactory } from './infrastructure/logger/LoggerFactory.ts';
import { SimpleNextExecutionCalculator } from './infrastructure/scheduler/SimpleNextExecutionCalculator.ts';
import { ScheduleExecutionEngine } from './infrastructure/scheduler/ScheduleExecutionEngine.ts';
import { LineNotificationTaskExecutor } from './infrastructure/scheduler/executors/LineNotificationTaskExecutor.ts';
import { LineMessageService } from './application/services/LineMessageService.ts';
import { DebugController } from './presentation/controllers/DebugController.ts';
import { DeviceControlController } from './presentation/controllers/DeviceControlController.ts';
import { LineWebhookController } from './presentation/controllers/LineWebhookController.ts';
import { CalendarWebhookController } from './presentation/controllers/CalendarWebhookController.ts';
import { AppRouter } from './presentation/routers/AppRouter.ts';
import { autoUpdateWebhookForDev } from './utils/ngrok.ts';
class Application {
  private readonly logger = LoggerFactory.create('Application');
  private readonly configManager: ConfigManager;
  private router!: AppRouter;
  private scheduleExecutionEngine!: ScheduleExecutionEngine;
  private dailyScheduleSetupService!: DailyScheduleSetupService;

  constructor() {
    this.configManager = ConfigManager.getInstance();
  }

  async initialize(): Promise<void> {
    const configResult = this.configManager.initialize();
    if (configResult.isFailure()) {
      throw configResult.getError();
    }

    this.logger.info(`🚀 LINE Bot サーバーを起動中... ポート: ${this.configManager.get('port')}`);

    await this.buildDependencies();

    await this.setupDevelopmentEnvironment();

    this.setupProcessHandlers();

    this.startScheduleEngine();

    this.startDailyScheduleSetupService();

    this.logger.info(
      `✅ アプリケーション初期化完了 - ポート: ${this.configManager.get('port')} で待機中`
    );
  }

  private async buildDependencies(): Promise<void> {
    try {
      this.logger.debug('🔧 依存関係構築開始');

      const config = this.configManager.getConfig();
      const logger = LoggerFactory.create('Bot');

      // Domain層（Repositories）
      const messageRepository = new MockMessageRepository(logger);
      const scheduleRepository = new MockScheduleRepository(logger);
      const deviceRepository = new NatureRemoDeviceRepository(
        config.natureRemo.accessToken,
        logger
      );

      // External Service
      const lineApiClient = new LineApiClient(config.line.channelAccessToken, logger);

      // Domain Services
      const messageService = new MessageService(messageRepository, logger);

      // Application Services
      const deviceControlService = new ApplicationDeviceControlService();

      const scheduleService = new ScheduleService(
        scheduleRepository,
        new SimpleNextExecutionCalculator(),
        logger
      );

      // Use Cases
      const controlDeviceUseCase = new ControlDeviceUseCase(deviceControlService, logger);

      const manageScheduleUseCase = new ManageScheduleUseCase(scheduleService, logger);

      // スケジュール実行エンジンとタスクエグゼキューター
      this.scheduleExecutionEngine = new ScheduleExecutionEngine(scheduleService, logger);

      // LineNotificationTaskExecutorを登録（アダプターを使用）
      const lineApiClientAdapter = new LineApiClientAdapter(lineApiClient, logger);
      const lineNotificationExecutor = new LineNotificationTaskExecutor(
        logger,
        lineApiClientAdapter
      );
      this.scheduleExecutionEngine.registerTaskExecutor(
        'line_notification',
        lineNotificationExecutor
      );

      // 統一的なLINEメッセージサービス
      const lineMessageService = new LineMessageService(lineApiClientAdapter);

      // デイリースケジュールセットアップサービス
      this.dailyScheduleSetupService = new DailyScheduleSetupService(
        manageScheduleUseCase,
        lineMessageService
      );

      const processMessageUseCase = new ProcessMessageUseCase(
        messageService,
        deviceControlService,
        logger,
        this.dailyScheduleSetupService
      );

      // Application Services
      const webhookService = new LineWebhookService(
        processMessageUseCase,
        lineMessageService,
        logger
      );

      const automationService = new DeviceAutomationService(
        controlDeviceUseCase,
        manageScheduleUseCase,
        logger
      );

      // Calendar Webhook Service - CalendarSyncServiceとSleepScheduleServiceが必要
      const { CalendarSyncService } = await import('./application/services/CalendarSyncService.ts');
      const { SleepScheduleService } = await import('./application/services/SleepScheduleService.ts');
      
      const calendarSyncService = new CalendarSyncService();
      const sleepScheduleService = new SleepScheduleService(
        calendarSyncService,
        lineMessageService,
        deviceControlService
      );
      
      const calendarWebhookService = new CalendarWebhookService(
        calendarSyncService,
        sleepScheduleService
      );

      // Presentation層（Controllers）
      const webhookController = new LineWebhookController(
        webhookService,
        logger,
        config.line.channelSecret
      );

      const deviceController = new DeviceControlController(
        controlDeviceUseCase,
        automationService,
        logger
      );

      const calendarWebhookController = new CalendarWebhookController(
        calendarWebhookService
      );

      // Debug Controller
      const debugController = new DebugController(
        deviceRepository,
        automationService,
        manageScheduleUseCase,
        logger
      );

      // Router設定
      this.router = new AppRouter(webhookController, deviceController, debugController, calendarWebhookController, logger);

      this.logger.debug('✅ 依存関係構築完了');
    } catch (error) {
      this.logger.error('❌ 依存関係構築失敗:', error);
      throw error;
    }
  }

  private startScheduleEngine(): void {
    try {
      this.scheduleExecutionEngine.start();
      this.logger.info('✅ Schedule execution engine started');
    } catch (error) {
      this.logger.error('❌ Failed to start schedule execution engine:', error);
    }
  }

  private startDailyScheduleSetupService(): void {
    try {
      this.dailyScheduleSetupService.start();
      this.logger.info('✅ Daily schedule setup service started');
    } catch (error) {
      this.logger.error('❌ Failed to start daily schedule setup service:', error);
    }
  }

  private async setupDevelopmentEnvironment(): Promise<void> {
    const config = this.configManager.getConfig();

    if (config.nodeEnv === 'development') {
      this.logger.info('🛠️ 開発環境設定中...');

      setTimeout(async () => {
        try {
          await autoUpdateWebhookForDev();
          this.logger.info('✅ Ngrok Webhook設定完了');
        } catch (error) {
          this.logger.warn('⚠️ Ngrok Webhook設定失敗:', error);
        }
      }, 2000);
    }
  }

  private setupProcessHandlers(): void {
    const cleanup = (): void => {
      this.logger.info('🧹 アプリケーションクリーンアップ中...');

      if (this.scheduleExecutionEngine) {
        this.scheduleExecutionEngine.stop();
      }

      if (this.dailyScheduleSetupService) {
        this.dailyScheduleSetupService.stop();
      }

      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  }

  async handleRequest(request: Request): Promise<Response> {
    try {
      return await this.router.route(request);
    } catch (error) {
      this.logger.error('❌ リクエスト処理エラー:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  getPort(): number {
    return this.configManager.get('port');
  }
}

async function startApplication(): Promise<void> {
  const app = new Application();

  try {
    await app.initialize();

    const server = Bun.serve({
      port: app.getPort(),
      async fetch(request: Request): Promise<Response> {
        return app.handleRequest(request);
      }
    });

    const logger = LoggerFactory.create('Server');
    logger.info(`🌟 サーバーがポート ${server.port} で起動しました`);
  } catch (error) {
    const logger = LoggerFactory.create('Startup');
    logger.error('💥 アプリケーション起動失敗:', error);
    process.exit(1);
  }
}

startApplication();
