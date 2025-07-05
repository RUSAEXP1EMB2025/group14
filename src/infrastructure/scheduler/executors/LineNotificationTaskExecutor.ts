import { Result } from '../../../core/base/Result.ts';
import type { ILogger } from '../../../core/interfaces/ILogger.ts';
import type { TaskExecutor, ScheduleExecutionContext } from '../ScheduleExecutionEngine.ts';

export interface LineMessage {
  readonly text: string;
  readonly quickReply?: QuickReplyItem[];
}

export interface QuickReplyItem {
  readonly type: 'action';
  readonly action: {
    readonly type: 'postback';
    readonly label: string;
    readonly data: string;
  };
}

export interface ILineApiClient {
  pushMessage(userId: string, message: LineMessage): Promise<void>;
}

export class LineNotificationTaskExecutor implements TaskExecutor {
  private lineApiClient?: ILineApiClient;

  constructor(
    private readonly logger: ILogger,
    lineApiClient?: ILineApiClient // 実際のLINE APIクライアント（後で実装）
  ) {
    this.lineApiClient = lineApiClient;
  }

  canHandle(taskType: string): boolean {
    return taskType === 'line_notification';
  }

  async execute(context: ScheduleExecutionContext): Promise<Result<void, Error>> {
    try {
      const { schedule } = context;
      const { action } = schedule;

      this.logger.info(`Executing LINE notification task: ${schedule.name}`, {
        scheduleId: schedule.id.value,
        target: action.target,
        executionTime: context.executionTime
      });

      // パラメータからメッセージとQuickReplyを取得
      const message = action.parameters.message as string;
      const quickReply = action.parameters.quickReply as QuickReplyItem[] | undefined;

      if (!message) {
        return Result.failure(new Error('No message found in task parameters'));
      }

      // LINE通知を送信
      const sendResult = await this.sendLineNotification({
        text: message,
        quickReply
      });

      if (!sendResult.isSuccess()) {
        return Result.failure(sendResult.error!);
      }

      this.logger.info(`LINE notification sent successfully: ${schedule.name}`, {
        scheduleId: schedule.id.value,
        messageLength: message.length,
        hasQuickReply: !!quickReply
      });

      return Result.success(undefined);
    } catch (error) {
      this.logger.error('Failed to execute LINE notification task:', error);
      return Result.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  private async sendLineNotification(lineMessage: LineMessage): Promise<Result<void, Error>> {
    try {
      // 実際のLINE API Client使用またはモック実装
      if (this.lineApiClient) {
        // 本番環境: 実際のLINE API経由で送信
        // ユーザーIDが設定されている場合は実際に送信
        const userId = process.env.LINE_TEST_USER_ID;
        if (userId) {
          this.logger.info('🚀 Sending REAL LINE notification via API!', {
            messagePreview: `${lineMessage.text.substring(0, 50)}...`,
            hasQuickReply: !!lineMessage.quickReply,
            userId: `${userId.substring(0, 8)}***`
          });

          await this.lineApiClient.pushMessage(userId, lineMessage);

          this.logger.info('✅ REAL LINE notification sent successfully!');
        } else {
          this.logger.warn('No LINE_TEST_USER_ID found, falling back to mock');
          await this.mockLineNotification(lineMessage);
        }
      } else {
        // 開発環境: モック実装でコンソール出力
        await this.mockLineNotification(lineMessage);
      }

      return Result.success(undefined);
    } catch (error) {
      this.logger.error('Failed to send LINE notification:', error);
      return Result.failure(
        error instanceof Error ? error : new Error('Failed to send LINE notification')
      );
    }
  }

  private async mockLineNotification(lineMessage: LineMessage): Promise<void> {
    this.logger.info('📱 MOCK LINE NOTIFICATION SENT 📱');

    console.log(`${'='.repeat(60)}`);
    console.log('📱 LINE Bot 通知 (Mock)');
    console.log('='.repeat(60));
    console.log(lineMessage.text);

    if (lineMessage.quickReply && lineMessage.quickReply.length > 0) {
      console.log('\n📋 Quick Reply オプション:');
      lineMessage.quickReply.forEach((item, index) => {
        console.log(`  ${index + 1}. [${item.action.label}] - ${item.action.data}`);
      });
    }

    console.log('='.repeat(60));
    console.log('⏰ 送信時刻:', new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
    console.log(`${'='.repeat(60)}\n`);

    // 実際の送信を模擬するため少し待機
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  setLineApiClient(client: ILineApiClient): void {
    this.lineApiClient = client;
    this.logger.info('LINE API client configured for real notifications');
  }

  async sendTestMessage(message: string): Promise<Result<void, Error>> {
    this.logger.info('Sending test LINE message');

    return await this.sendLineNotification({
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
    });
  }
}
