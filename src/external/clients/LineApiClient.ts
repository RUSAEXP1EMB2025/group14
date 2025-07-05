import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { Client, type ClientConfig, type Message } from '@line/bot-sdk';

export interface LineMessageRequest {
  readonly replyToken: string;
  readonly messages: Array<LineMessageData>;
}

export interface LinePushMessageRequest {
  readonly to: string;
  readonly messages: Array<LineMessageData>;
}

export interface LineMessageData {
  type: 'text';
  text: string;
  quickReply?: {
    items: Array<{
      type: 'action';
      action: {
        type: 'postback';
        label: string;
        data: string;
      };
    }>;
  };
}

export interface LineQuickReply {
  readonly type: 'action';
  readonly action: {
    readonly type: 'postback';
    readonly label: string;
    readonly data: string;
  };
}

export interface LineMessage {
  readonly text: string;
  readonly quickReply?: LineQuickReply[];
}

export interface LineApiResponse {
  readonly success: boolean;
  readonly messageId?: string;
  readonly error?: string;
}

export class LineApiClient {
  private readonly client: Client;

  constructor(
    private readonly accessToken: string,
    private readonly logger: ILogger
  ) {
    if (!accessToken) {
      throw new Error('LINE_CHANNEL_ACCESS_TOKEN is required');
    }

    const config: ClientConfig = {
      channelAccessToken: accessToken
    };
    this.client = new Client(config);
  }

  async replyMessage(replyToken: string, message: string): Promise<Result<LineApiResponse>> {
    try {
      const messageData: Message = {
        type: 'text',
        text: message
      };

      this.logger.debug(`Sending reply message: ${message}`);

      await this.client.replyMessage(replyToken, messageData);

      this.logger.info('Reply message sent successfully');
      return Result.success({
        success: true
      });
    } catch (error) {
      this.logger.error('Failed to send reply message:', error);
      return Result.failure(new Error(`Failed to send reply message: ${error}`));
    }
  }

  async pushMessage(userId: string, message: string): Promise<Result<LineApiResponse>> {
    try {
      const messageData: Message = {
        type: 'text',
        text: message
      };

      this.logger.debug(`Sending push message to ${userId}: ${message}`);

      await this.client.pushMessage(userId, messageData);

      this.logger.info(`Push message sent successfully to ${userId}`);
      return Result.success({
        success: true
      });
    } catch (error) {
      this.logger.error('Failed to send push message:', error);
      return Result.failure(new Error(`Failed to send push message: ${error}`));
    }
  }

  async replyMessages(replyToken: string, messages: string[]): Promise<Result<LineApiResponse>> {
    try {
      if (messages.length === 0) {
        return Result.failure(new Error('At least one message is required'));
      }

      if (messages.length > 5) {
        return Result.failure(new Error('Maximum 5 messages allowed per reply'));
      }

      const messageData: Message[] = messages.map(text => ({
        type: 'text',
        text
      }));

      this.logger.debug(`Sending ${messages.length} reply messages`);

      await this.client.replyMessage(replyToken, messageData);

      this.logger.info(`${messages.length} reply messages sent successfully`);
      return Result.success({
        success: true
      });
    } catch (error) {
      this.logger.error('Failed to send reply messages:', error);
      return Result.failure(new Error(`Failed to send reply messages: ${error}`));
    }
  }

  async healthCheck(): Promise<Result<boolean>> {
    try {
      // Bot の情報を取得してAPIの疎通確認
      await this.client.getBotInfo();

      this.logger.info('LINE API health check passed');
      return Result.success(true);
    } catch (error) {
      this.logger.error('LINE API health check error:', error);
      return Result.failure(new Error(`LINE API health check failed: ${error}`));
    }
  }

  async pushMessageWithQuickReply(
    userId: string,
    message: LineMessage
  ): Promise<Result<LineApiResponse>> {
    try {
      const messageData: Message = {
        type: 'text',
        text: message.text
      };

      // QuickReplyが指定されている場合は追加
      if (message.quickReply && message.quickReply.length > 0) {
        messageData.quickReply = {
          items: message.quickReply.map(item => ({
            type: item.type,
            action: item.action
          }))
        };
      }

      this.logger.debug(`Sending push message with QuickReply to ${userId}:`, {
        text: message.text,
        quickReplyCount: message.quickReply?.length || 0
      });

      await this.client.pushMessage(userId, messageData);

      this.logger.info(`Push message with QuickReply sent successfully to ${userId}`);
      return Result.success({
        success: true
      });
    } catch (error) {
      this.logger.error('Failed to send push message with QuickReply:', error);
      return Result.failure(new Error(`Failed to send push message with QuickReply: ${error}`));
    }
  }
}
