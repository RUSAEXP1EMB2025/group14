import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory.ts';

export interface LineMessage {
  readonly text: string;
  readonly quickReply?: QuickReplyItem[];
}

export interface QuickReplyItem {
  readonly type: 'action';
  readonly action: {
    readonly type: 'postback' | 'message' | 'uri';
    readonly label: string;
    readonly data?: string;
    readonly text?: string;
    readonly uri?: string;
  };
}

export interface ILineApiClient {
  pushMessage(userId: string, message: LineMessage): Promise<void>;
  replyMessage(replyToken: string, message: LineMessage): Promise<void>;
}

/**
 * LINEメッセージ送信の統一サービス
 * すべてのLINEメッセージ送信はこのクラスを経由する
 */
export class LineMessageService {
  private readonly logger: ILogger;
  private lineApiClient?: ILineApiClient;
  private readonly defaultUserId?: string;

  constructor(lineApiClient?: ILineApiClient) {
    this.logger = LoggerFactory.create('LineMessageService');
    this.lineApiClient = lineApiClient;
    this.defaultUserId = process.env.LINE_TEST_USER_ID;

    if (!lineApiClient) {
      this.logger.warn('LineApiClient not provided, using mock mode');
    }
  }

  /**
   * 指定ユーザーにプッシュメッセージを送信
   */
  async sendPushMessage(
    userId: string,
    message: string | LineMessage
  ): Promise<Result<void, Error>> {
    try {
      const lineMessage = typeof message === 'string' ? { text: message } : message;

      this.logger.info(`Sending push message to ${userId.substring(0, 8)}***`, {
        messagePreview: lineMessage.text.substring(0, 50),
        hasQuickReply: !!lineMessage.quickReply
      });

      if (this.lineApiClient) {
        await this.lineApiClient.pushMessage(userId, lineMessage);
        this.logger.info('✅ Push message sent successfully via LINE API');
      } else {
        await this.mockMessage('PUSH', lineMessage, userId);
      }

      return Result.success(undefined);
    } catch (error) {
      this.logger.error('Failed to send push message:', error);
      return Result.failure(
        error instanceof Error ? error : new Error('Failed to send push message')
      );
    }
  }

  /**
   * デフォルトユーザーにプッシュメッセージを送信
   */
  async sendMessage(message: string | LineMessage): Promise<Result<void, Error>> {
    if (!this.defaultUserId) {
      this.logger.warn('No default user ID configured, using mock mode');
      const lineMessage = typeof message === 'string' ? { text: message } : message;
      await this.mockMessage('PUSH', lineMessage);
      return Result.success(undefined);
    }

    return await this.sendPushMessage(this.defaultUserId, message);
  }

  /**
   * リプライメッセージを送信
   */
  async sendReplyMessage(
    replyToken: string,
    message: string | LineMessage
  ): Promise<Result<void, Error>> {
    try {
      const lineMessage = typeof message === 'string' ? { text: message } : message;

      this.logger.info('Sending reply message', {
        replyToken: `${replyToken.substring(0, 8)}***`,
        messagePreview: lineMessage.text.substring(0, 50),
        hasQuickReply: !!lineMessage.quickReply
      });

      if (this.lineApiClient) {
        await this.lineApiClient.replyMessage(replyToken, lineMessage);
        this.logger.info('✅ Reply message sent successfully via LINE API');
      } else {
        await this.mockMessage('REPLY', lineMessage, undefined, replyToken);
      }

      return Result.success(undefined);
    } catch (error) {
      this.logger.error('Failed to send reply message:', error);
      return Result.failure(
        error instanceof Error ? error : new Error('Failed to send reply message')
      );
    }
  }

  /**
   * QuickReply付きメッセージを送信
   */
  async sendMessageWithQuickReply(
    message: string,
    quickReplyItems: QuickReplyItem[],
    userId?: string
  ): Promise<Result<void, Error>> {
    const lineMessage: LineMessage = {
      text: message,
      quickReply: quickReplyItems
    };

    if (userId) {
      return await this.sendPushMessage(userId, lineMessage);
    }

    return await this.sendMessage(lineMessage);
  }

  /**
   * テストメッセージを送信（開発用）
   */
  async sendTestMessage(message: string): Promise<Result<void, Error>> {
    const testMessage: LineMessage = {
      text: `🧪 テストメッセージ\n\n${message}\n\n送信時刻: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`,
      quickReply: [
        {
          type: 'action',
          action: {
            type: 'postback',
            label: '✅ 受信確認',
            data: 'action=test_confirm'
          }
        }
      ]
    };

    return await this.sendMessage(testMessage);
  }

  /**
   * モック送信（開発環境用）
   */
  private async mockMessage(
    type: 'PUSH' | 'REPLY',
    message: LineMessage,
    userId?: string,
    replyToken?: string
  ): Promise<void> {
    this.logger.info(`📱 MOCK LINE ${type} MESSAGE SENT 📱`);

    console.log(`${'='.repeat(60)}`);
    console.log(`📱 LINE Bot ${type === 'PUSH' ? 'プッシュ' : 'リプライ'}通知 (Mock)`);
    console.log('='.repeat(60));

    if (userId) {
      console.log(`👤 送信先: ${userId.substring(0, 8)}***`);
    }
    if (replyToken) {
      console.log(`🔄 リプライトークン: ${replyToken.substring(0, 8)}***`);
    }

    console.log(`💬 メッセージ:\n${message.text}`);

    if (message.quickReply && message.quickReply.length > 0) {
      console.log('\n📋 Quick Reply オプション:');
      message.quickReply.forEach((item, index) => {
        console.log(`  ${index + 1}. [${item.action.label}]`);
        if (item.action.data) console.log(`     Data: ${item.action.data}`);
        if (item.action.text) console.log(`     Text: ${item.action.text}`);
        if (item.action.uri) console.log(`     URI: ${item.action.uri}`);
      });
    }

    console.log('='.repeat(60));
    console.log('⏰ 送信時刻:', new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
    console.log(`${'='.repeat(60)}\n`);

    // 実際の送信を模擬するため少し待機
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * LINE APIクライアントを設定
   */
  setLineApiClient(client: ILineApiClient): void {
    this.lineApiClient = client;
    this.logger.info('LINE API client configured');
  }

  /**
   * API接続状態を確認
   */
  isApiConnected(): boolean {
    return !!this.lineApiClient;
  }

  /**
   * 設定状態を取得
   */
  getStatus(): {
    hasApiClient: boolean;
    hasDefaultUserId: boolean;
    defaultUserId?: string;
  } {
    return {
      hasApiClient: !!this.lineApiClient,
      hasDefaultUserId: !!this.defaultUserId,
      defaultUserId: this.defaultUserId ? `${this.defaultUserId.substring(0, 8)}***` : undefined
    };
  }
}
