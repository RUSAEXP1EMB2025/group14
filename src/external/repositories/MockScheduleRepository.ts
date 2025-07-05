import type { Result } from '../../core/base/Result.ts';
import { Result as ResultImpl } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type { Schedule, ScheduleId } from '../../domain/entities/index.ts';
import type { IScheduleRepository } from '../../domain/repositories/IScheduleRepository.ts';

export class MockScheduleRepository implements IScheduleRepository {
  private schedules: Schedule[] = [];

  constructor(private readonly logger: ILogger) {}

  async save(schedule: Schedule): Promise<Result<Schedule, Error>> {
    try {
      this.logger.debug('Saving schedule to mock repository', { scheduleId: schedule.id });

      const existingIndex = this.schedules.findIndex(s => s.id.value === schedule.id.value);
      if (existingIndex >= 0) {
        this.schedules[existingIndex] = schedule;
      } else {
        this.schedules.push(schedule);
      }

      return ResultImpl.success(schedule);
    } catch (error) {
      this.logger.error('Failed to save schedule', { scheduleId: schedule.id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findById(id: ScheduleId): Promise<Result<Schedule | null, Error>> {
    try {
      this.logger.debug('Finding schedule by ID', { scheduleId: id });

      const schedule = this.schedules.find(s => s.id.value === id.value) || null;
      return ResultImpl.success(schedule);
    } catch (error) {
      this.logger.error('Failed to find schedule by ID', { scheduleId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findActive(): Promise<Result<Schedule[], Error>> {
    try {
      this.logger.debug('Finding active schedules');

      const activeSchedules = this.schedules.filter(s => s.status === 'active');

      return ResultImpl.success(activeSchedules);
    } catch (error) {
      this.logger.error('Failed to find active schedules', { error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findByDeviceId(): Promise<Result<Schedule[], Error>> {
    try {
      this.logger.debug('Finding schedules by device ID');
      return ResultImpl.success(this.schedules);
    } catch (error) {
      this.logger.error('Failed to find schedules by device ID', { error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async delete(id: ScheduleId): Promise<Result<void, Error>> {
    try {
      this.logger.debug('Deleting schedule', { scheduleId: id });

      const index = this.schedules.findIndex(s => s.id.value === id.value);
      if (index >= 0) {
        this.schedules.splice(index, 1);
      }

      return ResultImpl.success(undefined);
    } catch (error) {
      this.logger.error('Failed to delete schedule', { scheduleId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async countActive(): Promise<Result<number, Error>> {
    try {
      this.logger.debug('Counting active schedules');

      const count = this.schedules.filter(s => s.status === 'active').length;

      return ResultImpl.success(count);
    } catch (error) {
      this.logger.error('Failed to count active schedules', { error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findOverdue(): Promise<Result<Schedule[], Error>> {
    try {
      this.logger.debug('Finding overdue schedules');

      const now = new Date();
      const overdueSchedules = this.schedules.filter(
        s => s.status === 'active' && s.nextExecution && s.nextExecution < now
      );

      return ResultImpl.success(overdueSchedules);
    } catch (error) {
      this.logger.error('Failed to find overdue schedules', { error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  // IScheduleRepositoryの不足メソッドを追加
  async findAll(): Promise<Result<Schedule[], Error>> {
    try {
      this.logger.debug('Finding all schedules');
      return ResultImpl.success([...this.schedules]);
    } catch (error) {
      this.logger.error('Failed to find all schedules', { error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findByType(type: string): Promise<Result<Schedule[], Error>> {
    try {
      this.logger.debug('Finding schedules by type', { type });
      const schedules = this.schedules.filter(s => s.config.type === type);
      return ResultImpl.success(schedules);
    } catch (error) {
      this.logger.error('Failed to find schedules by type', { type, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findByStatus(status: string): Promise<Result<Schedule[], Error>> {
    try {
      this.logger.debug('Finding schedules by status', { status });
      const schedules = this.schedules.filter(s => s.status === status);
      return ResultImpl.success(schedules);
    } catch (error) {
      this.logger.error('Failed to find schedules by status', { status, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findScheduledBefore(date: Date): Promise<Result<Schedule[], Error>> {
    try {
      this.logger.debug('Finding schedules before date', { date });
      const schedules = this.schedules.filter(s => s.nextExecution && s.nextExecution < date);
      return ResultImpl.success(schedules);
    } catch (error) {
      this.logger.error('Failed to find schedules before date', { date, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async updateNextExecution(id: ScheduleId, nextExecution: Date): Promise<Result<Schedule, Error>> {
    try {
      this.logger.debug('Updating next execution', { scheduleId: id, nextExecution });
      const schedule = this.schedules.find(s => s.id.value === id.value);
      if (!schedule) {
        return ResultImpl.failure(new Error(`Schedule not found: ${id.value}`));
      }
      // MockRepositoryでは実装を簡略化して元のスケジュールを返す
      return ResultImpl.success(schedule);
    } catch (error) {
      this.logger.error('Failed to update next execution', { scheduleId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async updateStatus(id: ScheduleId, status: string): Promise<Result<void, Error>> {
    try {
      this.logger.debug('Updating status', { scheduleId: id, status });
      // MockRepositoryでは実装を簡略化
      return ResultImpl.success(undefined);
    } catch (error) {
      this.logger.error('Failed to update status', { scheduleId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async incrementExecutionCount(id: ScheduleId): Promise<Result<void, Error>> {
    try {
      this.logger.debug('Incrementing execution count', { scheduleId: id });
      // MockRepositoryでは実装を簡略化
      return ResultImpl.success(undefined);
    } catch (error) {
      this.logger.error('Failed to increment execution count', { scheduleId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async exists(id: ScheduleId): Promise<Result<boolean, Error>> {
    try {
      this.logger.debug('Checking schedule existence', { scheduleId: id });
      const exists = this.schedules.some(s => s.id.value === id.value);
      return ResultImpl.success(exists);
    } catch (error) {
      this.logger.error('Failed to check schedule existence', { scheduleId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async updateExecutionCount(id: ScheduleId, count: number): Promise<Result<Schedule, Error>> {
    try {
      this.logger.debug('Updating execution count', { scheduleId: id, count });
      const schedule = this.schedules.find(s => s.id.value === id.value);
      if (!schedule) {
        return ResultImpl.failure(new Error(`Schedule not found: ${id.value}`));
      }
      // MockRepositoryでは実装を簡略化して元のスケジュールを返す
      return ResultImpl.success(schedule);
    } catch (error) {
      this.logger.error('Failed to update execution count', { scheduleId: id, error });
      return ResultImpl.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
