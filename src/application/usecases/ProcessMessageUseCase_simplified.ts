import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { Message, MessageService } from '../../domain/index.ts';
import type { MessageId, MessageParsingResult, UserId } from '../../domain/index.ts';
import type { DailyScheduleSetupService } from '../services/DailyScheduleSetupService.ts';
import { DeviceControlService } from '../services/DeviceControlService.ts';

export interface MessageProcessingResult {
  readonly success: boolean;
  readonly responseMessage: string;
  readonly actionTaken?: string;
  readonly requiresConfirmation?: boolean;
  readonly confirmationData?: Record<string, unknown>;
}

export class ProcessMessageUseCase {
  constructor(
    private readonly messageService: MessageService,
    private readonly deviceControlService: DeviceControlService,
    private readonly logger: ILogger,
    private readonly dailyScheduleSetupService?: DailyScheduleSetupService
  ) {}

  async execute(message: Message): Promise<Result<MessageProcessingResult>> {
    try {
      this.logger.info(`Processing message: ${message.id.value} from ${message.userId.value}`);

      // メッセージを保存
      const saveResult = await this.messageService.saveMessage(message);
      if (!saveResult.isSuccess()) {
        this.logger.error('Failed to save message:', saveResult.error);
        // 保存失敗でも処理は続行
      }

      // メッセージを解析
      const parseResult = this.isPostbackData(message)
        ? this.messageService.parsePostback(message)
        : this.messageService.parseMessage(message);

      if (!parseResult.isSuccess()) {
        return Result.failure(new Error(`Failed to parse message: ${parseResult.error}`));
      }

      const parsedMessage = parseResult.data!;
      this.logger.info(`Parsed message: ${JSON.stringify(parsedMessage)}`);

      // コマンドに応じて処理を分岐
      switch (parsedMessage.command) {
        case 'postback':
          return await this.handlePostback(parsedMessage, message.userId);

        case 'sunset_time':
          return await this.handleSunsetTimeRequest(parsedMessage);

        case 'conversation':
        case undefined:
          return await this.handleConversation(parsedMessage);

        default:
          return await this.handleConversation(parsedMessage);
      }
    } catch (error) {
      this.logger.error('Error processing message:', error);
      return Result.failure(new Error(`Failed to process message: ${error}`));
    }
  }

  private async handlePostback(
    parsedMessage: MessageParsingResult,
    userId: UserId
  ): Promise<Result<MessageProcessingResult>> {
    const { parameters } = parsedMessage;
    const action = parameters.action as string;
    const reason = parameters.reason as string;

    this.logger.info('Processing postback action', { action, reason, userId: userId.value });

    switch (action) {
      case 'turn_on_lights':
        return await this.handleTurnOnLights(reason);

      case 'skip_lights':
        return await this.handleSkipLights(reason);

      case 'settings':
        return await this.handleSettingsRequest(parameters.target as string);

      case 'sleep':
        return await this.handleSleepAction(reason);

      default:
        return Result.success({
          success: false,
          responseMessage: '申し訳ございませんが、その操作は認識できませんでした。',
          actionTaken: 'unknown_postback'
        });
    }
  }

  private async handleTurnOnLights(reason: string): Promise<Result<MessageProcessingResult>> {
    try {
      // ライトを点灯
      const controlResult = await this.deviceControlService.turnOnLights();

      if (!controlResult.success) {
        return Result.success({
          success: false,
          responseMessage: 'ライトの制御に失敗しました。もう一度お試しください。',
          actionTaken: 'light_control_failed'
        });
      }

      const responseMessage =
        reason === 'sunset'
          ? '🌇 日の入りに合わせてライトを点灯しました。暖かい光でリラックスしてくださいね！'
          : '✅ ライトを点灯しました！';

      return Result.success({
        success: true,
        responseMessage,
        actionTaken: 'lights_turned_on'
      });
    } catch (error) {
      this.logger.error('Error turning on lights', { error, reason });
      return Result.success({
        success: false,
        responseMessage: 'ライトの制御中にエラーが発生しました。',
        actionTaken: 'light_control_error'
      });
    }
  }

  private async handleSkipLights(reason: string): Promise<Result<MessageProcessingResult>> {
    const responseMessage =
      reason === 'sunset'
        ? '🌙 承知いたしました。今回は照明の自動点灯をスキップします。\n必要な時はいつでもお声かけくださいね！'
        : '承知いたしました。';

    return Result.success({
      success: true,
      responseMessage,
      actionTaken: 'lights_skipped'
    });
  }

  private async handleSettingsRequest(target: string): Promise<Result<MessageProcessingResult>> {
    let responseMessage = '⚙️ 設定について\n\n';

    switch (target) {
      case 'sunset_automation':
        responseMessage +=
          '日の入り自動化設定:\n' +
          '• 通知タイミング: 日の入り30分前\n' +
          '• デフォルト明度: 70%\n' +
          '• 色温度: 3000K (暖色)\n\n' +
          '設定を変更するには「設定を変えて」と話しかけてください。';
        break;

      default:
        responseMessage += '利用可能な設定項目をお調べしています...';
    }

    return Result.success({
      success: true,
      responseMessage,
      actionTaken: 'settings_shown'
    });
  }

  private async handleConversation(
    _parsedMessage: MessageParsingResult
  ): Promise<Result<MessageProcessingResult>> {
    // その他の一般的な会話
    const responses = [
      'こんにちは！何かお手伝いできることはありますか？',
      'デバイスの制御が必要でしたら、「ライトをつけて」や「エアコンをオンにして」のように話しかけてください。',
      'お疲れさまです！今日はいかがでしたか？',
      '何かご質問があれば、お気軽にお声かけください。'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]!;

    return Result.success({
      success: true,
      responseMessage: randomResponse,
      actionTaken: 'conversation'
    });
  }

  private isPostbackData(message: Message): boolean {
    const text = message.getText()?.trim() ?? '';
    return text.includes('=') && text.includes('action=');
  }

  private async handleSunsetTimeRequest(
    _parsedMessage: MessageParsingResult
  ): Promise<Result<MessageProcessingResult>> {
    try {
      if (!this.dailyScheduleSetupService) {
        return Result.success({
          success: false,
          responseMessage: '日の入り時刻取得サービスが利用できません。',
          actionTaken: 'sunset_service_unavailable'
        });
      }

      const sunsetResult = await this.dailyScheduleSetupService.getSunsetTime();
      const sunset = sunsetResult.sunset;
      const location = sunsetResult.location;

      const sunsetTimeStr = sunset.toLocaleTimeString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit'
      });

      const responseMessage = `🌇 今日の日の入り時刻は${sunsetTimeStr}です。\n\n📍 場所: ${location.city}, ${location.country}\n🌍 緯度: ${location.latitude.toFixed(4)}°, 経度: ${location.longitude.toFixed(4)}°`;

      return Result.success({
        success: true,
        responseMessage,
        actionTaken: 'sunset_time_provided'
      });
    } catch (error) {
      this.logger.error('Error getting sunset time:', error);
      return Result.success({
        success: false,
        responseMessage: '日の入り時刻の取得に失敗しました。',
        actionTaken: 'sunset_time_error'
      });
    }
  }

  /**
   * 睡眠開始時の「寝る」アクションを処理
   */
  private async handleSleepAction(reason: string): Promise<Result<MessageProcessingResult>> {
    try {
      this.logger.info('Processing sleep action', { reason });

      // 電気をOFFにする
      const controlResult = await this.deviceControlService.turnOffLights();

      if (!controlResult.success) {
        this.logger.error('Failed to turn off lights for sleep', {
          error: controlResult.message
        });

        return Result.success({
          success: false,
          responseMessage: '💡 電気の制御に失敗しました。手動で電気を消してください。',
          actionTaken: 'sleep_light_control_failed'
        });
      }

      this.logger.info('Successfully turned off lights for sleep');

      return Result.success({
        success: true,
        responseMessage: '💤 おやすみなさい！電気を消しました。ゆっくりお休みください。',
        actionTaken: 'sleep_lights_turned_off'
      });
    } catch (error) {
      this.logger.error('Error in handleSleepAction:', error);
      return Result.success({
        success: false,
        responseMessage:
          '😴 おやすみなさい！（電気の制御でエラーが発生しましたが、ゆっくりお休みください）',
        actionTaken: 'sleep_action_error'
      });
    }
  }
}
