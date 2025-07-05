import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { Message } from '../../domain/index.ts';
import type { MessageContent, MessageId, UserId } from '../../domain/index.ts';
import { LineMessageService } from './LineMessageService.ts';
import { ProcessMessageUseCase } from '../usecases/index.ts';
import type { MessageProcessingResult } from '../usecases/index.ts';

export interface LineWebhookRequest {
  readonly events: Array<{
    type: string;
    message?: {
      type: string;
      text?: string;
    };
    postback?: {
      data: string;
    };
    replyToken?: string;
    source: {
      userId: string;
    };
    timestamp: number;
  }>;
}

export interface LineWebhookResponse {
  readonly success: boolean;
  readonly processedEvents: number;
  readonly responses: MessageProcessingResult[];
  readonly errors: string[];
}

export class LineWebhookService {
  constructor(
    private readonly processMessageUseCase: ProcessMessageUseCase,
    private readonly lineMessageService: LineMessageService,
    private readonly logger: ILogger
  ) {}

  /**
   * Webhookイベントを処理
   */
  async processWebhook(request: LineWebhookRequest): Promise<Result<LineWebhookResponse>> {
    try {
      this.logger.info(`Processing webhook with ${request.events.length} events`);

      // User IDのデバッグログを追加
      for (const event of request.events) {
        if (event.source?.userId) {
          this.logger.info('📱 LINE User ID detected:', {
            userId: event.source.userId,
            eventType: event.type
          });

          // User IDを見やすく表示
          console.log('\n🔍 LINE User ID Information');
          console.log('===========================');
          console.log(`User ID: ${event.source.userId}`);
          console.log(`Event Type: ${event.type}`);
          console.log('===========================');
          console.log('📋 Copy this to your .env file:');
          console.log(`LINE_TEST_USER_ID=${event.source.userId}`);
          console.log('===========================\n');
        }
      }

      const responses: MessageProcessingResult[] = [];
      const errors: string[] = [];
      let processedEvents = 0;

      // 各イベントを順次処理
      for (const event of request.events) {
        try {
          const result = await this.processEvent(event);
          if (result.isSuccess()) {
            responses.push(result.data!);
            processedEvents++;

            // 実際にLINE APIでメッセージを返信
            await this.sendReplyIfNeeded(event, result.data!);
          } else {
            const errorMsg = `Failed to process event: ${result.error}`;
            errors.push(errorMsg);
            this.logger.error(errorMsg);
          }
        } catch (error) {
          const errorMsg = `Event processing error: ${error}`;
          errors.push(errorMsg);
          this.logger.error(errorMsg);
        }
      }

      const webhookResponse: LineWebhookResponse = {
        success: errors.length === 0,
        processedEvents,
        responses,
        errors
      };

      this.logger.info(
        `Webhook processing completed: ${processedEvents}/${request.events.length} events processed`
      );
      return Result.success(webhookResponse);
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      return Result.failure(new Error(`Failed to process webhook: ${error}`));
    }
  }

  /**
   * 単一イベントを処理
   */
  private async processEvent(
    event: LineWebhookRequest['events'][0]
  ): Promise<Result<MessageProcessingResult>> {
    try {
      // メッセージイベントを処理
      if (event.type === 'message' && event.message) {
        return await this.processMessageEvent(event);
      }

      // Postbackイベントを処理（QuickReply選択時）
      if (event.type === 'postback' && 'postback' in event) {
        return await this.processPostbackEvent(event);
      }

      // その他のイベントはスキップ
      this.logger.info(`Skipping event: ${event.type}`);
      return Result.success({
        success: true,
        responseMessage: 'Event processed (no action required)',
        actionTaken: 'event_skipped'
      });
    } catch (error) {
      this.logger.error('Error processing event:', error);
      return Result.failure(new Error(`Failed to process event: ${error}`));
    }
  }

  /**
   * メッセージイベントを処理
   */
  private async processMessageEvent(
    event: LineWebhookRequest['events'][0]
  ): Promise<Result<MessageProcessingResult>> {
    // テキストメッセージのみを処理
    if (event.message?.type !== 'text') {
      return Result.success({
        success: true,
        responseMessage: 'テキストメッセージのみサポートしています',
        actionTaken: 'non_text_message'
      });
    }

    // メッセージエンティティを作成
    const messageId: MessageId = {
      value: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    const userId: UserId = { value: event.source.userId };
    const content: MessageContent = { text: event.message.text || '' };

    const message = new Message(
      messageId,
      userId,
      'text',
      content,
      new Date(event.timestamp),
      event.replyToken
    );

    // メッセージを処理
    const processResult = await this.processMessageUseCase.execute(message);

    if (!processResult.isSuccess()) {
      return Result.failure(new Error(`Failed to process message: ${processResult.error}`));
    }

    return Result.success(processResult.data!);
  }

  /**
   * Postbackイベントを処理（QuickReply選択時）
   */
  private async processPostbackEvent(
    event: LineWebhookRequest['events'][0]
  ): Promise<Result<MessageProcessingResult>> {
    this.logger.info('Processing postback event', {
      data: event.postback?.data,
      userId: event.source?.userId
    });

    // Postbackメッセージエンティティを作成
    const messageId: MessageId = {
      value: `postback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    const userId: UserId = { value: event.source.userId };
    const content: MessageContent = { text: event.postback?.data || '' };

    const message = new Message(
      messageId,
      userId,
      'text', // postbackデータをテキストとして処理
      content,
      new Date(event.timestamp),
      event.replyToken
    );

    // メッセージを処理
    const processResult = await this.processMessageUseCase.execute(message);

    if (!processResult.isSuccess()) {
      return Result.failure(new Error(`Failed to process postback: ${processResult.error}`));
    }

    return Result.success(processResult.data!);
  }

  /**
   * フォローイベントを処理
   */
  async processFollowEvent(
    userId: string,
    replyToken?: string
  ): Promise<Result<MessageProcessingResult>> {
    try {
      this.logger.info(`Processing follow event for user: ${userId}`);

      // ウェルカムメッセージを生成
      const welcomeMessage = this.generateWelcomeMessage();

      // replyTokenがある場合は返信、ない場合はプッシュメッセージ
      if (replyToken) {
        const replyResult = await this.lineMessageService.sendReplyMessage(
          replyToken,
          welcomeMessage
        );
        if (replyResult.isFailure()) {
          this.logger.error(`Failed to send welcome reply: ${replyResult.getError()?.message}`);
        }
      } else {
        const pushResult = await this.lineMessageService.sendPushMessage(userId, welcomeMessage);
        if (pushResult.isFailure()) {
          this.logger.error(`Failed to send welcome push: ${pushResult.getError()?.message}`);
        }
      }

      return Result.success({
        success: true,
        responseMessage: welcomeMessage,
        actionTaken: 'follow_event'
      });
    } catch (error) {
      this.logger.error('Error processing follow event:', error);
      return Result.failure(new Error(`Failed to process follow event: ${error}`));
    }
  }

  /**
   * アンフォローイベントを処理
   */
  async processUnfollowEvent(userId: string): Promise<Result<void>> {
    try {
      this.logger.info(`Processing unfollow event for user: ${userId}`);

      // 必要に応じてユーザーデータのクリーンアップを実行
      // 現在の実装では特別な処理は行わない

      return Result.success(undefined);
    } catch (error) {
      this.logger.error('Error processing unfollow event:', error);
      return Result.failure(new Error(`Failed to process unfollow event: ${error}`));
    }
  }

  /**
   * Webhookの署名を検証
   */
  verifySignature(body: string, signature: string, channelSecret: string): boolean {
    try {
      // Bunの組み込みcrypto APIを使用
      const crypto = require('node:crypto');
      const hash = crypto.createHmac('sha256', channelSecret).update(body).digest('base64');

      return hash === signature;
    } catch (error) {
      this.logger.error('Error verifying signature:', error);
      return false;
    }
  }

  /**
   * 必要に応じてLINE APIで返信を送信
   */
  private async sendReplyIfNeeded(
    event: LineWebhookRequest['events'][0],
    processingResult: MessageProcessingResult
  ): Promise<void> {
    if (!event.replyToken || !processingResult.responseMessage) {
      return;
    }

    try {
      const replyResult = await this.lineMessageService.sendReplyMessage(
        event.replyToken,
        processingResult.responseMessage
      );

      if (replyResult.isSuccess()) {
        this.logger.info(`Reply sent successfully for event: ${event.type}`);
      } else {
        this.logger.error(`Failed to send reply: ${replyResult.getError()?.message}`);
      }
    } catch (error) {
      this.logger.error('Error sending reply:', error);
    }
  }

  private generateWelcomeMessage(): string {
    return `🎉 フォローありがとうございます！

このボットは以下の機能を提供します：

💡 **デバイス制御**
・「ライトをつけて」「エアコンをオンにして」など

📊 **状態確認**
・「温度を教えて」「デバイスの状態は？」など

⚙️ **自動化**
・スケジュール設定による自動制御

何かご不明な点があれば、お気軽にお声かけください！`;
  }
}
