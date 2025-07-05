import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { Schedule } from '../entities/index.ts';
import type { ScheduleConfig, ScheduleId, ScheduleType, TaskAction } from '../entities/index.ts';
import type { IScheduleRepository } from '../repositories/index.ts';

export interface NextExecutionCalculator {
  calculateNext(config: ScheduleConfig, lastExecution?: Date): Date | null;
}

export class ScheduleService {
  constructor(
    private readonly scheduleRepository: IScheduleRepository,
    private readonly nextExecutionCalculator: NextExecutionCalculator,
    private readonly logger: ILogger
  ) {}

  async createSchedule(
    name: string,
    config: ScheduleConfig,
    action: TaskAction
  ): Promise<Result<Schedule>> {
    try {
      const scheduleId: ScheduleId = {
        value: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const nextExecution = this.nextExecutionCalculator.calculateNext(config);

      const schedule = new Schedule(
        scheduleId,
        name,
        config,
        action,
        'active',
        new Date(),
        undefined,
        nextExecution || undefined
      );

      const saveResult = await this.scheduleRepository.save(schedule);
      if (!saveResult.isSuccess()) {
        return Result.failure(new Error(`Failed to save schedule: ${saveResult.error}`));
      }

      this.logger.info(`Schedule created: ${name} (${scheduleId.value})`);
      return Result.success(saveResult.data!);
    } catch (error) {
      this.logger.error('Error creating schedule:', error);
      return Result.failure(new Error(`Failed to create schedule: ${error}`));
    }
  }

  /**
   * 実行可能なスケジュールを取得
   */
  async getExecutableSchedules(): Promise<Result<Schedule[]>> {
    try {
      const activeResult = await this.scheduleRepository.findActive();
      if (!activeResult.isSuccess()) {
        return Result.failure(new Error(`Failed to get active schedules: ${activeResult.error}`));
      }

      const now = new Date();
      const executableSchedules = activeResult.data!.filter(schedule => {
        if (!schedule.canExecute()) return false;
        if (!schedule.nextExecution) return false;
        return schedule.nextExecution <= now;
      });

      return Result.success(executableSchedules);
    } catch (error) {
      this.logger.error('Error getting executable schedules:', error);
      return Result.failure(new Error(`Failed to get executable schedules: ${error}`));
    }
  }

  /**
   * スケジュールを実行
   */
  async executeSchedule(scheduleId: ScheduleId): Promise<Result<Schedule>> {
    try {
      const scheduleResult = await this.scheduleRepository.findById(scheduleId);
      if (!scheduleResult.isSuccess() || !scheduleResult.data) {
        return Result.failure(new Error(`Schedule not found: ${scheduleId.value}`));
      }

      const schedule = scheduleResult.data;
      if (!schedule.canExecute()) {
        return Result.failure(new Error(`Schedule cannot be executed: ${scheduleId.value}`));
      }

      // 実行を記録
      const executedSchedule = schedule.recordExecution();

      // 次回実行時刻を計算
      const nextExecution = this.nextExecutionCalculator.calculateNext(schedule.config, new Date());

      const updatedSchedule = nextExecution
        ? executedSchedule.setNextExecution(nextExecution)
        : executedSchedule;

      const saveResult = await this.scheduleRepository.save(updatedSchedule);
      if (!saveResult.isSuccess()) {
        return Result.failure(new Error(`Failed to save executed schedule: ${saveResult.error}`));
      }

      this.logger.info(`Schedule executed: ${schedule.name} (${scheduleId.value})`);
      return Result.success(saveResult.data!);
    } catch (error) {
      this.logger.error('Error executing schedule:', error);
      return Result.failure(new Error(`Failed to execute schedule: ${error}`));
    }
  }

  /**
   * スケジュールエラーを記録
   */
  async markScheduleAsFailed(scheduleId: ScheduleId, error: string): Promise<Result<Schedule>> {
    try {
      const scheduleResult = await this.scheduleRepository.findById(scheduleId);
      if (!scheduleResult.isSuccess() || !scheduleResult.data) {
        return Result.failure(new Error(`Schedule not found: ${scheduleId.value}`));
      }

      const schedule = scheduleResult.data;
      const failedSchedule = schedule.markAsFailed();

      const saveResult = await this.scheduleRepository.save(failedSchedule);
      if (!saveResult.isSuccess()) {
        return Result.failure(new Error(`Failed to save failed schedule: ${saveResult.error}`));
      }

      this.logger.error(
        `Schedule marked as failed: ${schedule.name} (${scheduleId.value}) - ${error}`
      );
      return Result.success(saveResult.data!);
    } catch (err) {
      this.logger.error('Error marking schedule as failed:', err);
      return Result.failure(new Error(`Failed to mark schedule as failed: ${err}`));
    }
  }

  /**
   * スケジュールを削除
   */
  async deleteSchedule(scheduleId: ScheduleId): Promise<Result<void>> {
    try {
      const deleteResult = await this.scheduleRepository.delete(scheduleId);
      if (!deleteResult.isSuccess()) {
        return Result.failure(new Error(`Failed to delete schedule: ${deleteResult.error}`));
      }

      this.logger.info(`Schedule deleted: ${scheduleId.value}`);
      return Result.success(undefined);
    } catch (error) {
      this.logger.error('Error deleting schedule:', error);
      return Result.failure(new Error(`Failed to delete schedule: ${error}`));
    }
  }

  /**
   * アクティブなスケジュール一覧を取得
   */
  async getActiveSchedules(): Promise<Result<Schedule[]>> {
    try {
      const activeResult = await this.scheduleRepository.findActive();
      if (!activeResult.isSuccess()) {
        return Result.failure(new Error(`Failed to get active schedules: ${activeResult.error}`));
      }

      return Result.success(activeResult.data!);
    } catch (error) {
      this.logger.error('Error getting active schedules:', error);
      return Result.failure(new Error(`Failed to get active schedules: ${error}`));
    }
  }

  /**
   * スケジュールを一時停止
   */
  async pauseSchedule(scheduleId: ScheduleId): Promise<Result<Schedule>> {
    try {
      const scheduleResult = await this.scheduleRepository.findById(scheduleId);
      if (!scheduleResult.isSuccess() || !scheduleResult.data) {
        return Result.failure(new Error(`Schedule not found: ${scheduleId.value}`));
      }

      const schedule = scheduleResult.data;
      const pausedSchedule = schedule.deactivate();

      const saveResult = await this.scheduleRepository.save(pausedSchedule);
      if (!saveResult.isSuccess()) {
        return Result.failure(new Error(`Failed to pause schedule: ${saveResult.error}`));
      }

      this.logger.info(`Schedule paused: ${schedule.name} (${scheduleId.value})`);
      return Result.success(saveResult.data!);
    } catch (error) {
      this.logger.error('Error pausing schedule:', error);
      return Result.failure(new Error(`Failed to pause schedule: ${error}`));
    }
  }

  /**
   * スケジュールを再開
   */
  async resumeSchedule(scheduleId: ScheduleId): Promise<Result<Schedule>> {
    try {
      const scheduleResult = await this.scheduleRepository.findById(scheduleId);
      if (!scheduleResult.isSuccess() || !scheduleResult.data) {
        return Result.failure(new Error(`Schedule not found: ${scheduleId.value}`));
      }

      const schedule = scheduleResult.data;
      const activeSchedule = schedule.activate();

      // 次回実行時刻を再計算
      const nextExecution = this.nextExecutionCalculator.calculateNext(
        schedule.config,
        schedule.lastExecuted
      );

      const updatedSchedule = nextExecution
        ? activeSchedule.setNextExecution(nextExecution)
        : activeSchedule;

      const saveResult = await this.scheduleRepository.save(updatedSchedule);
      if (!saveResult.isSuccess()) {
        return Result.failure(new Error(`Failed to resume schedule: ${saveResult.error}`));
      }

      this.logger.info(`Schedule resumed: ${schedule.name} (${scheduleId.value})`);
      return Result.success(saveResult.data!);
    } catch (error) {
      this.logger.error('Error resuming schedule:', error);
      return Result.failure(new Error(`Failed to resume schedule: ${error}`));
    }
  }
}
