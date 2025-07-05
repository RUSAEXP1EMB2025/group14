import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type {
  Schedule,
  ScheduleConfig,
  ScheduleId,
  ScheduleStatus,
  ScheduleType,
  TaskAction
} from '../../domain/entities/index.ts';
import { ScheduleService } from '../../domain/services/index.ts';

export interface CreateScheduleRequest {
  readonly name: string;
  readonly config: ScheduleConfig;
  readonly action: TaskAction;
}

export interface UpdateScheduleRequest {
  readonly id: ScheduleId;
  readonly name?: string;
  readonly config?: ScheduleConfig;
  readonly action?: TaskAction;
  readonly status?: ScheduleStatus;
}

export interface ScheduleExecutionResult {
  readonly scheduleId: ScheduleId;
  readonly success: boolean;
  readonly executedAt: Date;
  readonly error?: string;
  readonly nextExecution?: Date;
}

/**
 * スケジュール管理のユースケース（基本実装）
 */
export class ManageScheduleUseCase {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly logger: ILogger
  ) {}

  /**
   * 新しいスケジュールを作成
   */
  async createSchedule(request: CreateScheduleRequest): Promise<Result<Schedule, Error>> {
    try {
      this.logger.info('Creating new schedule', { name: request.name });

      return await this.scheduleService.createSchedule(
        request.name,
        request.config,
        request.action
      );
    } catch (error) {
      this.logger.error('Failed to create schedule', { request, error });
      return Result.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * スケジュールを更新
   */
  async updateSchedule(request: UpdateScheduleRequest): Promise<Result<Schedule, Error>> {
    try {
      this.logger.info('Updating schedule', { scheduleId: request.id });

      // TODO: ScheduleServiceにupdateScheduleメソッドを実装後に有効化
      return Result.failure(new Error('Update schedule not implemented yet'));
    } catch (error) {
      this.logger.error('Failed to update schedule', { request, error });
      return Result.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * スケジュールを削除
   */
  async deleteSchedule(scheduleId: ScheduleId): Promise<Result<void, Error>> {
    try {
      this.logger.info('Deleting schedule', { scheduleId });

      return await this.scheduleService.deleteSchedule(scheduleId);
    } catch (error) {
      this.logger.error('Failed to delete schedule', { scheduleId, error });
      return Result.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * アクティブなスケジュールを取得
   */
  async getActiveSchedules(): Promise<Result<Schedule[], Error>> {
    try {
      this.logger.debug('Fetching active schedules');

      return await this.scheduleService.getActiveSchedules();
    } catch (error) {
      this.logger.error('Failed to fetch active schedules', { error });
      return Result.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * スケジュールされたタスクを処理
   */
  async processScheduledTasks(): Promise<Result<ScheduleExecutionResult[], Error>> {
    try {
      this.logger.debug('Processing scheduled tasks');

      // アクティブなスケジュールを取得
      const schedulesResult = await this.scheduleService.getActiveSchedules();
      if (!schedulesResult.isSuccess() || !schedulesResult.data) {
        return Result.failure(schedulesResult.error || new Error('Failed to fetch schedules'));
      }

      const results: ScheduleExecutionResult[] = [];
      const currentTime = new Date();

      // 実行が必要なスケジュールを処理
      for (const schedule of schedulesResult.data) {
        if (this.shouldExecuteSchedule(schedule, currentTime)) {
          try {
            // 実際のタスク実行はここで行う（現在は簡略化）
            const executionResult: ScheduleExecutionResult = {
              scheduleId: schedule.id,
              success: true,
              executedAt: currentTime,
              nextExecution: this.calculateNextExecution(schedule, currentTime)
            };

            results.push(executionResult);

            // TODO: ScheduleServiceにincrementExecutionCountメソッドを実装後に有効化
            // await this.scheduleService.incrementExecutionCount(schedule.id);

            this.logger.info('Schedule executed successfully', {
              scheduleId: schedule.id,
              name: schedule.name
            });
          } catch (error) {
            const executionResult: ScheduleExecutionResult = {
              scheduleId: schedule.id,
              success: false,
              executedAt: currentTime,
              error: error instanceof Error ? error.message : 'Unknown error'
            };

            results.push(executionResult);

            this.logger.error('Schedule execution failed', {
              scheduleId: schedule.id,
              error
            });
          }
        }
      }

      return Result.success(results);
    } catch (error) {
      this.logger.error('Failed to process scheduled tasks', { error });
      return Result.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * スケジュールを実行すべきかチェック
   */
  private shouldExecuteSchedule(schedule: Schedule, currentTime: Date): boolean {
    if (schedule.status !== 'active') {
      return false;
    }

    if (schedule.nextExecution && schedule.nextExecution <= currentTime) {
      return true;
    }

    return false;
  }

  /**
   * 次回実行時刻を計算
   */
  private calculateNextExecution(schedule: Schedule, currentTime: Date): Date | undefined {
    const config = schedule.config;

    switch (config.type) {
      case 'interval':
        if (config.intervalMinutes) {
          const nextTime = new Date(currentTime);
          nextTime.setMinutes(nextTime.getMinutes() + config.intervalMinutes);
          return nextTime;
        }
        break;

      case 'once':
        // 一回限りの実行は次回実行なし
        return undefined;

      default:
        // その他のタイプは未実装
        return undefined;
    }

    return undefined;
  }

  /**
   * スケジュールの存在確認
   */
  async scheduleExists(scheduleId: ScheduleId): Promise<Result<boolean, Error>> {
    try {
      this.logger.debug('Checking schedule existence', { scheduleId });

      // TODO: ScheduleServiceにscheduleExistsメソッドを実装後に有効化
      return Result.success(false); // 一時的にfalseを返す
    } catch (error) {
      this.logger.error('Failed to check schedule existence', { scheduleId, error });
      return Result.failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
