import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { Message } from '../entities/index.ts';
import type { MessageContent, MessageId, MessageType, UserId } from '../entities/index.ts';
import type { IMessageRepository } from '../repositories/index.ts';

export interface MessageParsingResult {
  readonly command?: string;
  readonly parameters: Record<string, string>;
  readonly isConfirmation: boolean;
  readonly confidence: number;
}

export class MessageService {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly logger: ILogger
  ) {}

  parseMessage(message: Message): Result<MessageParsingResult> {
    try {
      if (!message.isTextMessage()) {
        return Result.success({
          parameters: {},
          isConfirmation: false,
          confidence: 0
        });
      }

      const text = message.getText()?.toLowerCase().trim() ?? '';
      if (!text) {
        return Result.success({
          parameters: {},
          isConfirmation: false,
          confidence: 0
        });
      }

      // 確認応答の検出
      const isConfirmation = this.detectConfirmation(text);
      if (isConfirmation) {
        return Result.success({
          command: 'confirmation',
          parameters: this.parseConfirmationParameters(text),
          isConfirmation: true,
          confidence: 0.9
        });
      }

      // コマンドの検出
      const commandResult = this.detectCommand(text);
      if (commandResult.command) {
        return Result.success(commandResult);
      }

      // 一般的な会話として処理
      return Result.success({
        command: 'conversation',
        parameters: { text },
        isConfirmation: false,
        confidence: 0.3
      });
    } catch (error) {
      this.logger.error('Error parsing message:', error);
      return Result.failure(new Error(`Failed to parse message: ${error}`));
    }
  }

  /**
   * メッセージを保存
   */
  async saveMessage(message: Message): Promise<Result<Message>> {
    try {
      const saveResult = await this.messageRepository.save(message);
      if (!saveResult.isSuccess()) {
        return Result.failure(new Error(`Failed to save message: ${saveResult.error}`));
      }

      this.logger.info(`Message saved: ${message.id.value}`);
      return Result.success(saveResult.data!);
    } catch (error) {
      this.logger.error('Error saving message:', error);
      return Result.failure(new Error(`Failed to save message: ${error}`));
    }
  }

  /**
   * ユーザーのメッセージ履歴を取得
   */
  async getUserMessageHistory(userId: UserId, limit = 10): Promise<Result<Message[]>> {
    try {
      const historyResult = await this.messageRepository.findByUserId(userId, limit);
      if (!historyResult.isSuccess()) {
        return Result.failure(new Error(`Failed to get message history: ${historyResult.error}`));
      }

      return Result.success(historyResult.data!);
    } catch (error) {
      this.logger.error('Error getting message history:', error);
      return Result.failure(new Error(`Failed to get message history: ${error}`));
    }
  }

  /**
   * メッセージからデバイス制御パラメータを抽出
   */
  extractDeviceControlParameters(text: string): Record<string, string> {
    const parameters: Record<string, string> = {};

    // ライト制御のパターン
    if (
      text.includes('ライト') ||
      text.includes('らいと') ||
      text.includes('電気') ||
      text.includes('照明')
    ) {
      parameters.deviceType = 'light';

      if (text.includes('つけて') || text.includes('点けて') || text.includes('オン')) {
        parameters.action = 'on';
      } else if (text.includes('消して') || text.includes('けして') || text.includes('オフ')) {
        parameters.action = 'off';
      }

      // 明度の抽出
      const brightnessMatch = text.match(/(\d+)%|(\d+)パーセント/);
      if (brightnessMatch) {
        const brightness = brightnessMatch[1] || brightnessMatch[2];
        if (brightness) {
          parameters.brightness = brightness;
        }
      }
    }

    // エアコン制御のパターン
    if (text.includes('エアコン') || text.includes('冷房') || text.includes('暖房')) {
      parameters.deviceType = 'aircon';

      if (text.includes('つけて') || text.includes('オン')) {
        parameters.action = 'on';
      } else if (text.includes('消して') || text.includes('けして') || text.includes('オフ')) {
        parameters.action = 'off';
      }

      // 温度の抽出
      const tempMatch = text.match(/(\d+)度/);
      if (tempMatch?.[1]) {
        parameters.temperature = tempMatch[1];
      }

      // モードの抽出
      if (text.includes('冷房') || text.includes('クール')) {
        parameters.mode = 'cool';
      } else if (text.includes('暖房') || text.includes('ヒート')) {
        parameters.mode = 'heat';
      } else if (text.includes('除湿') || text.includes('ドライ')) {
        parameters.mode = 'dry';
      }
    }

    return parameters;
  }

  private detectConfirmation(text: string): boolean {
    const confirmationPatterns = [
      'はい',
      'yes',
      'y',
      'ok',
      'おk',
      'オーケー',
      '了解',
      'りょうかい',
      'いいよ',
      'いい',
      '大丈夫',
      'だいじょうぶ',
      'やって',
      'やる',
      ':' // コロン区切りの応答
    ];

    return confirmationPatterns.some(pattern => text.includes(pattern));
  }

  private parseConfirmationParameters(text: string): Record<string, string> {
    const parameters: Record<string, string> = {};

    // コロン区切りの応答を解析
    if (text.includes(':')) {
      const parts = text.split(':');
      if (parts.length >= 2 && parts[0] && parts[1]) {
        parameters.confirmationType = parts[0].trim();
        parameters.value = parts[1].trim();
      }
    }

    return parameters;
  }

  private detectCommand(text: string): MessageParsingResult {
    const deviceKeywords = ['ライト', 'らいと', '電気', '照明', 'エアコン', '冷房', '暖房'];
    const actionKeywords = ['つけて', '消して', 'けして', 'オン', 'オフ', '点けて'];
    const statusKeywords = ['状態', 'ステータス', '温度', '湿度'];

    let confidence = 0;
    let command = '';
    const parameters: Record<string, string> = {};

    // 日の入り時刻の検出
    const sunsetResult = this.detectSunsetTimeQuery(text);
    if (sunsetResult.detected) {
      command = 'sunset_time';
      confidence = sunsetResult.confidence;
      parameters.requestType = 'sunset_time';
    }

    // デバイス制御コマンドの検出
    if (deviceKeywords.some(keyword => text.includes(keyword))) {
      confidence += 0.4;
      if (actionKeywords.some(keyword => text.includes(keyword))) {
        command = 'device_control';
        confidence += 0.4;
        Object.assign(parameters, this.extractDeviceControlParameters(text));
      }
    }

    // ステータス確認コマンドの検出
    if (statusKeywords.some(keyword => text.includes(keyword))) {
      command = 'status_check';
      confidence += 0.3;
      parameters.requestType = 'status';
    }

    // デバッグコマンドの検出
    if (text.includes('debug') || text.includes('デバッグ')) {
      command = 'debug';
      confidence = 0.8;
    }

    return {
      command: command || undefined,
      parameters,
      isConfirmation: false,
      confidence
    };
  }

  private detectSunsetTimeQuery(text: string): { detected: boolean; confidence: number } {
    const sunsetKeywords = [
      '日の入り',
      'ひのいり',
      '夕日',
      'サンセット',
      'sunset',
      '夕方',
      '日没',
      'にちぼつ'
    ];

    const timeKeywords = ['時間', '時刻', 'じかん', 'じこく', '何時', 'なんじ', 'いつ', 'time'];

    const questionKeywords = ['？', '?', 'いつ', '教えて', 'おしえて', '知りたい', 'しりたい'];

    const hasSunsetKeyword = sunsetKeywords.some(keyword => text.includes(keyword));
    const hasTimeKeyword = timeKeywords.some(keyword => text.includes(keyword));
    const hasQuestionKeyword = questionKeywords.some(keyword => text.includes(keyword));

    if (hasSunsetKeyword && (hasTimeKeyword || hasQuestionKeyword)) {
      return { detected: true, confidence: 0.9 };
    }

    return { detected: false, confidence: 0 };
  }

  /**
   * Postbackデータを解析してコマンドを抽出
   */
  parsePostback(message: Message): Result<MessageParsingResult> {
    try {
      const text = message.getText()?.trim() ?? '';
      if (!text) {
        return Result.success({
          parameters: {},
          isConfirmation: false,
          confidence: 0
        });
      }

      // URLエンコード形式のpostbackデータを解析
      // 例: "action=turn_on_lights&reason=sunset"
      const urlParams = new URLSearchParams(text);
      const parameters: Record<string, string> = {};

      for (const [key, value] of urlParams.entries()) {
        parameters[key] = value;
      }

      // actionパラメータがある場合はpostbackコマンドとして処理
      if (parameters.action) {
        this.logger.info('Postback data parsed successfully', {
          action: parameters.action,
          parameters: parameters
        });

        return Result.success({
          command: 'postback',
          parameters,
          isConfirmation: false,
          confidence: 1.0
        });
      }

      // actionがない場合は通常のテキストとして処理
      return this.parseMessage(message);
    } catch (error) {
      this.logger.error('Error parsing postback data:', error);
      // エラーの場合は通常のテキスト解析にフォールバック
      return this.parseMessage(message);
    }
  }
}
