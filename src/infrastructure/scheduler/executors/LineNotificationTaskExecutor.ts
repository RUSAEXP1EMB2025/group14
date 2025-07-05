import { Result } from '../../../core/base/Result.ts';
import type { ILogger } from '../../../core/interfaces/ILogger.ts';
import type { TaskExecutor, ScheduleExecutionContext } from '../ScheduleExecutionEngine.ts';
import { LineMessageService } from '../../../application/services/LineMessageService.ts';
import type { QuickReplyItem as ServiceQuickReplyItem } from '../../../application/services/LineMessageService.ts';

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

/**
 * スケジュール経由でのLINEメッセージ送信を担当
 * 内部的にLineMessageServiceを使用して送信機能の重複を避ける
 */
export class LineNotificationTaskExecutor implements TaskExecutor {
  private lineMessageService: LineMessageService;

  constructor(
    private readonly logger: ILogger,
    lineApiClient?: ILineApiClient
  ) {
    // LineNotificationTaskExecutorの型をLineMessageServiceの型に変換
    const adaptedClient = lineApiClient
      ? {
          pushMessage: lineApiClient.pushMessage.bind(lineApiClient),
          replyMessage: async () => {
            // スケジュール経由ではリプライは使用しない
            throw new Error('Reply message not supported in scheduled notifications');
          }
        }
      : undefined;

    this.lineMessageService = new LineMessageService(adaptedClient);
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
      const quickReply = action.parameters.quickReply as { items: QuickReplyItem[] } | undefined;

      if (!message) {
        return Result.failure(new Error('No message found in task parameters'));
      }

      // QuickReplyの変換
      const serviceQuickReply: ServiceQuickReplyItem[] | undefined = quickReply?.items?.map(
        item => ({
          type: 'action' as const,
          action: {
            type: 'postback' as const,
            label: item.action.label,
            data: item.action.data
          }
        })
      );

      // LineMessageService経由で送信
      const sendResult = await this.lineMessageService.sendMessage({
        text: message,
        quickReply: serviceQuickReply
      });

      if (!sendResult.isSuccess()) {
        return Result.failure(sendResult.getError()!);
      }

      this.logger.info(`LINE notification sent successfully: ${schedule.name}`, {
        scheduleId: schedule.id.value,
        messageLength: message.length,
        hasQuickReply: !!serviceQuickReply
      });

      return Result.success(undefined);
    } catch (error) {
      this.logger.error('Failed to execute LINE notification task:', error);
      return Result.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  setLineApiClient(client: ILineApiClient): void {
    // LineMessageServiceのAPIクライアントを設定
    const adaptedClient = {
      pushMessage: client.pushMessage.bind(client),
      replyMessage: async () => {
        // スケジュール経由ではリプライは使用しない
        throw new Error('Reply message not supported in scheduled notifications');
      }
    };

    this.lineMessageService.setLineApiClient(adaptedClient);
    this.logger.info('LINE API client configured for scheduled notifications');
  }

  async sendTestMessage(message: string): Promise<Result<void, Error>> {
    this.logger.info('Sending test LINE message via scheduled executor');
    return await this.lineMessageService.sendTestMessage(message);
  }
}
