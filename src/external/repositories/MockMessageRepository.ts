import type { Result } from '../../core/base/Result.ts';
import { Result as ResultImpl } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type { Message, MessageId, UserId } from '../../domain/entities/index.ts';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository.ts';

export class MockMessageRepository implements IMessageRepository {
  private messages: Message[] = [];

  constructor(private readonly logger: ILogger) {}

  async save(message: Message): Promise<Result<Message, Error>> {
    try {
      this.logger.debug('Saving message to mock repository', { messageId: message.id });

      const existingIndex = this.messages.findIndex(m => m.id.value === message.id.value);
      if (existingIndex >= 0) {
        this.messages[existingIndex] = message;
      } else {
        this.messages.push(message);
      }

      return ResultImpl.success(message);
    } catch (error) {
      this.logger.error('Failed to save message', { messageId: message.id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findById(id: MessageId): Promise<Result<Message | null, Error>> {
    try {
      this.logger.debug('Finding message by ID', { messageId: id });

      const message = this.messages.find(m => m.id.value === id.value) || null;
      return ResultImpl.success(message);
    } catch (error) {
      this.logger.error('Failed to find message by ID', { messageId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findByUserId(userId: UserId, limit?: number): Promise<Result<Message[], Error>> {
    try {
      this.logger.debug('Finding messages by user ID', { userId, limit });

      let messages = this.messages.filter(m => m.userId.value === userId.value);

      messages = messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      if (limit !== undefined && limit > 0) {
        messages = messages.slice(0, limit);
      }

      return ResultImpl.success(messages);
    } catch (error) {
      this.logger.error('Failed to find messages by user ID', { userId, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findLatest(limit = 10): Promise<Result<Message[], Error>> {
    try {
      this.logger.debug('Finding latest messages', { limit });

      const sortedMessages = [...this.messages]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return ResultImpl.success(sortedMessages);
    } catch (error) {
      this.logger.error('Failed to find latest messages', { limit, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async searchByKeyword(keyword: string, limit = 50): Promise<Result<Message[], Error>> {
    try {
      this.logger.debug('Searching messages by keyword', { keyword, limit });

      const filteredMessages = this.messages
        .filter(m => {
          const searchableText = m.content.text || '';
          return searchableText.toLowerCase().includes(keyword.toLowerCase());
        })
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return ResultImpl.success(filteredMessages);
    } catch (error) {
      this.logger.error('Failed to search messages by keyword', { keyword, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async deleteOlderThan(days: number): Promise<Result<number, Error>> {
    try {
      this.logger.debug('Deleting messages older than days', { days });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const initialCount = this.messages.length;
      this.messages = this.messages.filter(m => m.timestamp > cutoffDate);
      const deletedCount = initialCount - this.messages.length;

      return ResultImpl.success(deletedCount);
    } catch (error) {
      this.logger.error('Failed to delete old messages', { days, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async countByUserId(userId: UserId): Promise<Result<number, Error>> {
    try {
      this.logger.debug('Counting messages by user ID', { userId });

      const count = this.messages.filter(m => m.userId.value === userId.value).length;
      return ResultImpl.success(count);
    } catch (error) {
      this.logger.error('Failed to count messages by user ID', { userId, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async delete(id: MessageId): Promise<Result<void, Error>> {
    try {
      this.logger.debug('Deleting message', { messageId: id });

      const index = this.messages.findIndex(m => m.id.value === id.value);
      if (index >= 0) {
        this.messages.splice(index, 1);
      }

      return ResultImpl.success(undefined);
    } catch (error) {
      this.logger.error('Failed to delete message', { messageId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async deleteByUserId(userId: UserId): Promise<Result<number, Error>> {
    try {
      this.logger.debug('Deleting messages by user ID', { userId });

      const initialCount = this.messages.length;
      this.messages = this.messages.filter(m => m.userId.value !== userId.value);
      const deletedCount = initialCount - this.messages.length;

      return ResultImpl.success(deletedCount);
    } catch (error) {
      this.logger.error('Failed to delete messages by user ID', { userId, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async count(): Promise<Result<number, Error>> {
    try {
      this.logger.debug('Counting messages');
      return ResultImpl.success(this.messages.length);
    } catch (error) {
      this.logger.error('Failed to count messages', { error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async exists(id: MessageId): Promise<Result<boolean, Error>> {
    try {
      this.logger.debug('Checking message existence', { messageId: id });

      const exists = this.messages.some(m => m.id.value === id.value);
      return ResultImpl.success(exists);
    } catch (error) {
      this.logger.error('Failed to check message existence', { messageId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
