import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type { LineApiClient, LineQuickReply } from '../clients/LineApiClient.ts';
import type {
  ILineApiClient,
  LineMessage,
  QuickReplyItem
} from '../../application/services/LineMessageService.ts';

export class LineApiClientAdapter implements ILineApiClient {
  constructor(
    private readonly lineApiClient: LineApiClient,
    private readonly logger: ILogger
  ) {}

  async pushMessage(userId: string, message: LineMessage): Promise<void> {
    try {
      // LineMessageService の型を LineApiClient の型に変換
      const adaptedMessage = this.adaptMessage(message);
      const result = await this.lineApiClient.pushMessageWithQuickReply(userId, adaptedMessage);

      if (result.isFailure()) {
        this.logger.error('Failed to send LINE message via adapter:', result.getError());
        throw result.getError();
      }

      this.logger.info(`LINE message sent successfully via adapter to ${userId}`);
    } catch (error) {
      this.logger.error('LineApiClientAdapter pushMessage error:', error);
      throw error;
    }
  }

  async replyMessage(replyToken: string, message: LineMessage): Promise<void> {
    try {
      // QuickReplyがある場合は別途処理が必要
      if (message.quickReply && message.quickReply.length > 0) {
        // 現在のLineApiClientにはreplyMessageWithQuickReplyがないため、
        // とりあえずテキストのみでリプライし、QuickReplyは別途pushMessageで送信
        const result = await this.lineApiClient.replyMessage(replyToken, message.text);

        if (result.isFailure()) {
          this.logger.error('Failed to send LINE reply via adapter:', result.getError());
          throw result.getError();
        }
      } else {
        const result = await this.lineApiClient.replyMessage(replyToken, message.text);

        if (result.isFailure()) {
          this.logger.error('Failed to send LINE reply via adapter:', result.getError());
          throw result.getError();
        }
      }

      this.logger.info('LINE reply sent successfully via adapter');
    } catch (error) {
      this.logger.error('LineApiClientAdapter replyMessage error:', error);
      throw error;
    }
  }

  /**
   * LineMessageService の型を LineApiClient の型に変換
   */
  private adaptMessage(message: LineMessage): { text: string; quickReply?: LineQuickReply[] } {
    const adaptedQuickReply = message.quickReply?.map(
      (item: QuickReplyItem): LineQuickReply => ({
        type: 'action',
        action: {
          type: 'postback', // LineApiClient は postback のみサポート
          label: item.action.label,
          data: item.action.data || item.action.text || ''
        }
      })
    );

    return {
      text: message.text,
      quickReply: adaptedQuickReply
    };
  }
}
