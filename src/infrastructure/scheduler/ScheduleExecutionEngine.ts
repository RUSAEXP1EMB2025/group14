import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type { Schedule, ScheduleId } from '../../domain/entities/index.ts';
import { ScheduleService } from '../../domain/services/ScheduleService.ts';

export interface ScheduleExecutionContext {
  readonly schedule: Schedule;
  readonly executionTime: Date;
  readonly attemptNumber: number;
}

export interface TaskExecutor {
  canHandle(taskType: string): boolean;
  execute(context: ScheduleExecutionContext): Promise<Result<void, Error>>;
}

export interface ScheduleExecutionResult {
  readonly scheduleId: ScheduleId;
  readonly scheduleName: string;
  readonly executionTime: Date;
  readonly success: boolean;
  readonly error?: string;
  readonly nextExecution?: Date;
}

export class ScheduleExecutionEngine {
  private taskExecutors: Map<string, TaskExecutor> = new Map();
  private isRunning = false;
  private intervalId?: Timer;
  private executedSchedules = new Set<string>(); // 実行済みスケジュールを追跡
  private scheduledTimeouts = new Map<string, Timer>(); // スケジュールID -> タイマーIDのマップ

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly logger: ILogger,
    private readonly checkIntervalMs = 60000 // 1分間隔に変更（タイマー併用のため頻度を下げる）
  ) {}

  registerTaskExecutor(taskType: string, executor: TaskExecutor): void {
    this.taskExecutors.set(taskType, executor);
    this.logger.info(`Task executor registered: ${taskType}`);
  }

  start(): void {
    if (this.isRunning) {
      this.logger.warn('Schedule execution engine is already running');
      return;
    }

    this.isRunning = true;
    this.logger.info(
      `Starting schedule execution engine (check interval: ${this.checkIntervalMs}ms)`
    );

    // 即座に一回実行
    this.executeScheduledTasks();

    // 定期実行を設定
    this.intervalId = setInterval(() => {
      this.executeScheduledTasks();
    }, this.checkIntervalMs);
  }

  stop(): void {
    if (!this.isRunning) {
      this.logger.warn('Schedule execution engine is not running');
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    // 個別スケジュールのタイマーもクリア
    for (const [scheduleId, timeoutId] of this.scheduledTimeouts.entries()) {
      clearTimeout(timeoutId);
      this.logger.debug(`Cleared timer for schedule: ${scheduleId}`);
    }
    this.scheduledTimeouts.clear();

    this.logger.info('Schedule execution engine stopped');
  }

  private async executeScheduledTasks(): Promise<void> {
    try {
      this.logger.debug('Checking for schedules and setting up timers...');

      // アクティブなスケジュールを取得
      const schedulesResult = await this.scheduleService.getActiveSchedules();
      if (!schedulesResult.isSuccess() || !schedulesResult.data) {
        this.logger.debug('No active schedules found or failed to fetch schedules');
        return;
      }

      const schedules = schedulesResult.data;
      const currentTime = new Date();
      
      // 即座に実行すべきスケジュールと将来実行すべきスケジュールを分離
      const executableSchedules = schedules.filter(schedule =>
        this.shouldExecuteSchedule(schedule, currentTime)
      );
      
      const futureSchedules = schedules.filter(schedule =>
        this.shouldScheduleForFuture(schedule, currentTime)
      );

      // 即座に実行すべきスケジュール
      if (executableSchedules.length > 0) {
        this.logger.info(`Found ${executableSchedules.length} executable schedules`);
        for (const schedule of executableSchedules) {
          await this.executeSchedule(schedule);
        }
      }

      // 将来のスケジュールにタイマーを設定
      for (const schedule of futureSchedules) {
        this.scheduleForFuture(schedule, currentTime);
      }

      this.logger.debug(
        `Processed ${schedules.length} schedules: ${executableSchedules.length} executed, ${futureSchedules.length} scheduled for future`
      );
    } catch (error) {
      this.logger.error('Error in executeScheduledTasks:', error);
    }
  }

  private shouldExecuteSchedule(schedule: Schedule, currentTime: Date): boolean {
    this.logger.debug('Checking schedule execution conditions:', {
      scheduleId: schedule.id.value,
      scheduleName: schedule.name,
      scheduleStatus: schedule.status,
      scheduleType: schedule.config.type,
      currentTime: currentTime.toISOString(),
      nextExecution: schedule.nextExecution?.toISOString(),
      executionTime: schedule.config.executionTime?.toISOString(),
      executionCount: schedule.executionCount,
      isExecuted: this.executedSchedules.has(schedule.id.value)
    });

    if (schedule.status !== 'active') {
      this.logger.debug('Schedule not active, skipping', { scheduleId: schedule.id.value });
      return false;
    }

    // 既に実行済みのスケジュールはスキップ
    if (this.executedSchedules.has(schedule.id.value)) {
      this.logger.debug('Schedule already executed, skipping', { scheduleId: schedule.id.value });
      return false;
    }

    // 次回実行時刻が設定されていて、現在時刻を過ぎている場合
    if (schedule.nextExecution && schedule.nextExecution <= currentTime) {
      this.logger.debug('Schedule ready for execution (nextExecution)', {
        scheduleId: schedule.id.value,
        nextExecution: schedule.nextExecution.toISOString(),
        currentTime: currentTime.toISOString()
      });
      return true;
    }

    // 一回限りのスケジュールで、実行時刻が設定されている場合
    if (schedule.config.type === 'once' && schedule.config.executionTime) {
      const isTimeReached = schedule.config.executionTime <= currentTime;
      const isNotExecuted = schedule.executionCount === 0;

      this.logger.debug('Checking once schedule conditions:', {
        scheduleId: schedule.id.value,
        executionTime: schedule.config.executionTime.toISOString(),
        currentTime: currentTime.toISOString(),
        isTimeReached,
        executionCount: schedule.executionCount,
        isNotExecuted
      });

      return isTimeReached && isNotExecuted;
    }

    this.logger.debug('Schedule does not meet execution conditions', {
      scheduleId: schedule.id.value
    });
    return false;
  }

  private async executeSchedule(schedule: Schedule): Promise<ScheduleExecutionResult> {
    const executionTime = new Date();

    try {
      this.logger.info(`Executing schedule: ${schedule.name} (${schedule.id.value})`);

      // タスクエグゼキューターを取得
      const executor = this.taskExecutors.get(schedule.action.type);
      if (!executor) {
        throw new Error(`No executor found for task type: ${schedule.action.type}`);
      }

      // スケジュールを実行
      const context: ScheduleExecutionContext = {
        schedule,
        executionTime,
        attemptNumber: 1
      };

      const executionResult = await executor.execute(context);

      if (executionResult.isSuccess()) {
        // 実行成功
        this.logger.info(`Schedule executed successfully: ${schedule.name}`);

        // スケジュールの状態を更新
        await this.updateScheduleAfterExecution(schedule, true);

        return {
          scheduleId: schedule.id,
          scheduleName: schedule.name,
          executionTime,
          success: true,
          nextExecution: this.calculateNextExecution(schedule)
        };
      }

      // 実行失敗
      this.logger.error(`Schedule execution failed: ${schedule.name}`, executionResult.error);

      await this.updateScheduleAfterExecution(schedule, false, executionResult.error?.message);

      return {
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        executionTime,
        success: false,
        error: executionResult.error?.message
      };
    } catch (error) {
      this.logger.error(`Error executing schedule ${schedule.name}:`, error);

      await this.updateScheduleAfterExecution(
        schedule,
        false,
        error instanceof Error ? error.message : String(error)
      );

      return {
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        executionTime,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async updateScheduleAfterExecution(
    schedule: Schedule,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    try {
      // 実行済みスケジュールとしてマーク
      this.executedSchedules.add(schedule.id.value);

      // 一回限りのスケジュールの場合は削除（完了扱い）
      if (schedule.config.type === 'once') {
        await this.scheduleService.deleteSchedule(schedule.id);
        this.logger.info(`One-time schedule completed and removed: ${schedule.name}`);
      } else {
        // 繰り返しスケジュールの場合は今後の実装で対応
        this.logger.info(`Recurring schedule execution recorded: ${schedule.name}`);
      }

      this.logger.debug('Schedule state updated after execution', {
        scheduleId: schedule.id.value,
        success,
        errorMessage
      });
    } catch (error) {
      this.logger.error('Failed to update schedule after execution:', error);
    }
  }

  private calculateNextExecution(schedule: Schedule): Date | undefined {
    switch (schedule.config.type) {
      case 'interval':
        if (schedule.config.intervalMinutes) {
          const nextTime = new Date();
          nextTime.setMinutes(nextTime.getMinutes() + schedule.config.intervalMinutes);
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

  getStatus(): {
    isRunning: boolean;
    checkIntervalMs: number;
    registeredExecutors: string[];
  } {
    return {
      isRunning: this.isRunning,
      checkIntervalMs: this.checkIntervalMs,
      registeredExecutors: Array.from(this.taskExecutors.keys())
    };
  }

  async executeManualCheck(): Promise<void> {
    this.logger.info('Manual schedule check triggered');
    await this.executeScheduledTasks();
  }

  /**
   * スケジュールが将来の実行対象かどうかを判定
   */
  private shouldScheduleForFuture(schedule: Schedule, currentTime: Date): boolean {
    // 既にタイマーが設定されている場合はスキップ
    if (this.scheduledTimeouts.has(schedule.id.value)) {
      return false;
    }

    // 既に実行済みの場合はスキップ
    if (this.executedSchedules.has(schedule.id.value)) {
      return false;
    }

    // アクティブでない場合はスキップ
    if (schedule.status !== 'active') {
      return false;
    }

    // 一回限りのスケジュールで、将来の実行時刻が設定されている場合
    if (schedule.config.type === 'once' && schedule.config.executionTime) {
      const executionTime = schedule.config.executionTime;
      const timeDiff = executionTime.getTime() - currentTime.getTime();
      
      // 将来の時刻で、かつ未実行の場合
      return timeDiff > 0 && schedule.executionCount === 0;
    }

    // nextExecutionが設定されている場合
    if (schedule.nextExecution) {
      const timeDiff = schedule.nextExecution.getTime() - currentTime.getTime();
      return timeDiff > 0;
    }

    return false;
  }

  /**
   * 将来の実行時刻にタイマーを設定
   */
  private scheduleForFuture(schedule: Schedule, currentTime: Date): void {
    let executionTime: Date | undefined;

    // 実行時刻を決定
    if (schedule.config.type === 'once' && schedule.config.executionTime) {
      executionTime = schedule.config.executionTime;
    } else if (schedule.nextExecution) {
      executionTime = schedule.nextExecution;
    }

    if (!executionTime) {
      return;
    }

    const timeDiff = executionTime.getTime() - currentTime.getTime();
    
    // JavaScriptのsetTimeoutの制限（約24.8日）を超える場合は定期チェックに任せる
    const MAX_TIMEOUT_MS = 2147483647; // 約24.8日
    if (timeDiff > MAX_TIMEOUT_MS) {
      this.logger.debug(`Schedule ${schedule.name} is too far in future, will use periodic check`);
      return;
    }

    // 既にタイマーが設定されている場合はクリア
    const existingTimeout = this.scheduledTimeouts.get(schedule.id.value);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // 新しいタイマーを設定
    const timeoutId = setTimeout(async () => {
      this.logger.info(`⏰ Timer triggered for schedule: ${schedule.name}`);
      
      // タイマーマップから削除
      this.scheduledTimeouts.delete(schedule.id.value);
      
      // スケジュールを実行
      await this.executeSchedule(schedule);
    }, timeDiff);

    // タイマーマップに追加
    this.scheduledTimeouts.set(schedule.id.value, timeoutId);

    this.logger.info(
      `⏰ Timer set for schedule "${schedule.name}" to execute at ${executionTime.toLocaleString()} (in ${Math.round(timeDiff / 1000)}s)`
    );
  }

  /**
   * 新しく作成されたスケジュールを即座にタイマー設定
   */
  async addNewSchedule(schedule: Schedule): Promise<void> {
    if (!this.isRunning) {
      this.logger.debug('Engine not running, schedule will be picked up on next check');
      return;
    }

    const currentTime = new Date();
    
    // 即座に実行すべきかチェック
    if (this.shouldExecuteSchedule(schedule, currentTime)) {
      this.logger.info(`Executing newly added schedule immediately: ${schedule.name}`);
      await this.executeSchedule(schedule);
      return;
    }

    // 将来の実行にタイマーを設定
    if (this.shouldScheduleForFuture(schedule, currentTime)) {
      this.logger.info(`Setting timer for newly added schedule: ${schedule.name}`);
      this.scheduleForFuture(schedule, currentTime);
    }
  }

  /**
   * 既存スケジュールのタイマーをクリア（更新や削除時に使用）
   */
  clearScheduleTimer(scheduleId: string): void {
    const timeoutId = this.scheduledTimeouts.get(scheduleId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledTimeouts.delete(scheduleId);
      this.logger.debug(`Cleared timer for schedule: ${scheduleId}`);
    }
  }
}
