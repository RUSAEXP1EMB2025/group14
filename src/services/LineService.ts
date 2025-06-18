import { messagingApi } from '@line/bot-sdk';
import { logger } from '../utils/logger.ts';

export class LineService {
  private client: messagingApi.MessagingApiClient;

  constructor(channelAccessToken: string) {
    this.client = new messagingApi.MessagingApiClient({
      channelAccessToken
    });
  }

  async replyMessage(replyToken: string, text: string): Promise<void> {
    try {
      await this.client.replyMessage({
        replyToken,
        messages: [
          {
            type: 'text',
            text
          }
        ]
      });
      logger.info(`返信送信完了: "${text}"`);
    } catch (error) {
      logger.error('返信送信エラー:', error);
      throw error;
    }
  }

  async sendMessage(userId: string, text: string): Promise<void> {
    try {
      await this.client.pushMessage({
        to: userId,
        messages: [
          {
            type: 'text',
            text
          }
        ]
      });
      logger.info(`メッセージ送信完了: "${text}"`);
    } catch (error) {
      logger.error('メッセージ送信エラー:', error);
      throw error;
    }
  }

  async sendConfirmationMessage(
    userId: string,
    message: string,
    actionType: string
  ): Promise<void> {
    try {
      await this.client.pushMessage({
        to: userId,
        messages: [
          {
            type: 'template',
            altText: message,
            template: {
              type: 'confirm',
              text: message,
              actions: [
                {
                  type: 'message',
                  label: 'はい',
                  text: `${actionType}:yes`
                },
                {
                  type: 'message',
                  label: 'いいえ',
                  text: `${actionType}:no`
                }
              ]
            }
          }
        ]
      });
      logger.info(`確認メッセージ送信完了: "${message}"`);
    } catch (error) {
      logger.error('確認メッセージ送信エラー:', error);
      throw error;
    }
  }
}
