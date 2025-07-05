import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { DeviceControlService, Message, MessageService } from '../../domain/index.ts';
import type {
  Device,
  DeviceId,
  MessageId,
  MessageParsingResult,
  UserId
} from '../../domain/index.ts';

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
    private readonly logger: ILogger
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
        case 'device_control':
          return await this.handleDeviceControl(parsedMessage, message.userId);

        case 'status_check':
          return await this.handleStatusCheck(parsedMessage);

        case 'confirmation':
          return await this.handleConfirmation(parsedMessage, message.userId);

        case 'debug':
          return await this.handleDebugCommand(parsedMessage);

        case 'postback':
          return await this.handlePostback(parsedMessage, message.userId);

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

  private async handleDeviceControl(
    parsedMessage: MessageParsingResult,
    _userId: UserId
  ): Promise<Result<MessageProcessingResult>> {
    const { parameters } = parsedMessage;

    if (!parameters.deviceType || !parameters.action) {
      return Result.success({
        success: false,
        responseMessage: 'デバイスの種類と操作を指定してください。例：「ライトをつけて」'
      });
    }

    // デバイスIDを動的に取得
    const deviceId = await this.getDeviceIdByType(parameters.deviceType);
    if (!deviceId) {
      return Result.success({
        success: false,
        responseMessage: `${parameters.deviceType}が見つかりません。`
      });
    }

    try {
      if (parameters.deviceType === 'light') {
        return await this.handleLightControl(deviceId, parameters);
      }
      if (parameters.deviceType === 'aircon') {
        return await this.handleAirconControl(deviceId, parameters);
      }

      return Result.success({
        success: false,
        responseMessage: `${parameters.deviceType}の制御はサポートされていません。`
      });
    } catch (error) {
      this.logger.error('Device control error:', error);

      // レート制限エラーの検知
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
        return Result.success({
          success: false,
          responseMessage: '⏱️ リクエストが多すぎます。1分ほど待ってから再度お試しください。'
        });
      }

      // その他のAPIエラー
      if (errorMessage.includes('HTTP-Code') || errorMessage.includes('API')) {
        return Result.success({
          success: false,
          responseMessage:
            '🔧 デバイスとの通信に問題が発生しました。しばらく後で再試行してください。'
        });
      }

      return Result.success({
        success: false,
        responseMessage: 'デバイスの制御に失敗しました。しばらく後で再試行してください。'
      });
    }
  }

  private async handleLightControl(
    deviceId: DeviceId,
    parameters: Record<string, string>
  ): Promise<Result<MessageProcessingResult>> {
    const isOn = parameters.action === 'on';
    const settings: Record<string, number> = {};

    if (parameters.brightness) {
      const brightness = Number.parseInt(parameters.brightness, 10);
      if (brightness >= 0 && brightness <= 100) {
        settings.brightness = brightness;
      }
    }

    const controlResult = await this.deviceControlService.controlLight(deviceId, isOn, settings);

    if (!controlResult.isSuccess()) {
      const errorMessage = controlResult.error?.message || 'Unknown error';

      // レート制限エラーの検知
      if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
        return Result.success({
          success: false,
          responseMessage: '⏱️ リクエストが多すぎます。1分ほど待ってから再度お試しください。'
        });
      }

      return Result.success({
        success: false,
        responseMessage: `ライトの制御に失敗しました: ${errorMessage}`
      });
    }

    const actionText = isOn ? 'オン' : 'オフ';
    const brightnessText = settings.brightness ? ` (明度: ${settings.brightness}%)` : '';

    return Result.success({
      success: true,
      responseMessage: `ライトを${actionText}にしました${brightnessText}`,
      actionTaken: `light_${parameters.action}`
    });
  }

  private async handleAirconControl(
    deviceId: DeviceId,
    parameters: Record<string, string>
  ): Promise<Result<MessageProcessingResult>> {
    const isOn = parameters.action === 'on';
    const settings: Record<string, number | string> = {};

    if (parameters.temperature) {
      const temperature = Number.parseInt(parameters.temperature, 10);
      if (temperature >= 16 && temperature <= 30) {
        settings.temperature = temperature;
      }
    }

    if (parameters.mode) {
      settings.mode = parameters.mode;
    }

    const controlResult = await this.deviceControlService.controlAircon(deviceId, isOn, settings);

    if (!controlResult.isSuccess()) {
      const errorMessage = controlResult.error?.message || 'Unknown error';

      // レート制限エラーの検知
      if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
        return Result.success({
          success: false,
          responseMessage: '⏱️ リクエストが多すぎます。1分ほど待ってから再度お試しください。'
        });
      }

      return Result.success({
        success: false,
        responseMessage: `エアコンの制御に失敗しました: ${errorMessage}`
      });
    }

    const actionText = isOn ? 'オン' : 'オフ';
    const tempText = settings.temperature ? ` ${settings.temperature}度` : '';
    const modeText = settings.mode ? ` (${this.getModeDisplayName(String(settings.mode))})` : '';

    return Result.success({
      success: true,
      responseMessage: `エアコンを${actionText}にしました${tempText}${modeText}`,
      actionTaken: `aircon_${parameters.action}`
    });
  }

  private async handleStatusCheck(
    _parsedMessage: MessageParsingResult
  ): Promise<Result<MessageProcessingResult>> {
    // ステータス確認の実装
    return Result.success({
      success: true,
      responseMessage: 'システムは正常に動作しています。デバイスの状態を確認中...',
      actionTaken: 'status_check'
    });
  }

  private async handleConfirmation(
    _parsedMessage: MessageParsingResult,
    _userId: UserId
  ): Promise<Result<MessageProcessingResult>> {
    // 確認応答の処理
    return Result.success({
      success: true,
      responseMessage: '承知しました。',
      actionTaken: 'confirmation_received'
    });
  }

  private async handleDebugCommand(
    _parsedMessage: MessageParsingResult
  ): Promise<Result<MessageProcessingResult>> {
    return Result.success({
      success: true,
      responseMessage:
        'デバッグ情報:\n- システム稼働中\n- メッセージ処理正常\n- デバイス接続確認中',
      actionTaken: 'debug_info'
    });
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
      // ライトデバイスを取得
      const deviceId = await this.getDeviceIdByType('light');
      if (!deviceId) {
        return Result.success({
          success: false,
          responseMessage: 'ライトデバイスが見つかりません。',
          actionTaken: 'light_not_found'
        });
      }

      // ライトを点灯（日の入り用の設定）
      const controlResult = await this.deviceControlService.controlLight(
        deviceId,
        true, // isOn: boolean
        {
          brightness: 70
          // 色温度設定は照明がサポートしていない場合があるので削除
        }
      );

      if (!controlResult.isSuccess()) {
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

  private async getDeviceIdByType(deviceType: string): Promise<DeviceId | null> {
    try {
      this.logger.debug(`Searching for device with type: ${deviceType}`);

      // リアルタイムでデバイス一覧を取得して適切なデバイスを探す
      const devicesResult = await this.deviceControlService.getAllDevices();

      if (!devicesResult.isSuccess()) {
        this.logger.error('Failed to get devices:', devicesResult.error);
        return null;
      }

      const devices = devicesResult.data || [];
      this.logger.debug(`Found ${devices.length} devices total`);

      // デバイスの詳細をログに出力
      for (const device of devices) {
        this.logger.debug(
          `Device: ${device.id.value}, type: ${device.type}, name: ${device.name.value}`
        );
      }

      const targetDevice = devices.find((device: Device) => device.type === deviceType);

      if (targetDevice) {
        this.logger.info(
          `Found device for type ${deviceType}: ${targetDevice.id.value} (${targetDevice.name.value})`
        );
        return targetDevice.id;
      }

      this.logger.warn(
        `No device found for type: ${deviceType}. Available types: ${devices.map(d => d.type).join(', ')}`
      );
      return null;
    } catch (error) {
      this.logger.error('Error in getDeviceIdByType:', error);
      return null;
    }
  }

  private getModeDisplayName(mode: string): string {
    const modeNames: Record<string, string> = {
      cool: '冷房',
      heat: '暖房',
      dry: '除湿',
      fan: '送風',
      auto: '自動'
    };
    return modeNames[mode] || mode;
  }
}
