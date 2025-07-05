import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type { LineApiClient } from '../clients/LineApiClient.ts';
import type {
  ILineApiClient,
  LineMessage
} from '../../infrastructure/scheduler/executors/LineNotificationTaskExecutor.ts';

export class LineApiClientAdapter implements ILineApiClient {
  constructor(
    private readonly lineApiClient: LineApiClient,
    private readonly logger: ILogger
  ) {}

  async pushMessage(userId: string, message: LineMessage): Promise<void> {
    try {
      const result = await this.lineApiClient.pushMessageWithQuickReply(userId, message);

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
}
