/**
 * Schedule Entity - スケジュールタスクを表現するドメインエンティティ
 */

export interface ScheduleId {
  readonly value: string;
}

export type ScheduleType = 'sunset' | 'sunrise' | 'interval' | 'cron' | 'once';
export type ScheduleStatus = 'active' | 'inactive' | 'completed' | 'failed';

export interface ScheduleConfig {
  readonly type: ScheduleType;
  readonly cronExpression?: string;
  readonly intervalMinutes?: number;
  readonly executionTime?: Date;
  readonly timezone?: string;
}

export interface TaskAction {
  readonly type: string;
  readonly target: string;
  readonly parameters: Record<string, unknown>;
}

export class Schedule {
  constructor(
    public readonly id: ScheduleId,
    public readonly name: string,
    public readonly config: ScheduleConfig,
    public readonly action: TaskAction,
    public readonly status: ScheduleStatus = 'active',
    public readonly createdAt: Date = new Date(),
    public readonly lastExecuted?: Date,
    public readonly nextExecution?: Date,
    public readonly executionCount = 0,
    public readonly maxExecutions?: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id.value.trim()) {
      throw new Error('Schedule ID cannot be empty');
    }
    if (!this.name.trim()) {
      throw new Error('Schedule name cannot be empty');
    }
    if (this.config.type === 'cron' && !this.config.cronExpression) {
      throw new Error('Cron schedule must have cron expression');
    }
    if (this.config.type === 'interval' && !this.config.intervalMinutes) {
      throw new Error('Interval schedule must have interval minutes');
    }
    if (this.config.type === 'once' && !this.config.executionTime) {
      throw new Error('Once schedule must have execution time');
    }
  }

  /**
   * スケジュールがアクティブかどうか
   */
  isActive(): boolean {
    return this.status === 'active';
  }

  /**
   * 実行可能かどうか
   */
  canExecute(): boolean {
    if (!this.isActive()) return false;
    if (this.maxExecutions && this.executionCount >= this.maxExecutions) return false;
    if (this.config.type === 'once' && this.lastExecuted) return false;
    return true;
  }

  /**
   * 次回実行時刻を設定
   */
  setNextExecution(nextExecution: Date): Schedule {
    return new Schedule(
      this.id,
      this.name,
      this.config,
      this.action,
      this.status,
      this.createdAt,
      this.lastExecuted,
      nextExecution,
      this.executionCount,
      this.maxExecutions
    );
  }

  /**
   * 実行を記録
   */
  recordExecution(): Schedule {
    const newStatus = this.config.type === 'once' ? 'completed' : this.status;

    return new Schedule(
      this.id,
      this.name,
      this.config,
      this.action,
      newStatus,
      this.createdAt,
      new Date(),
      this.nextExecution,
      this.executionCount + 1,
      this.maxExecutions
    );
  }

  /**
   * スケジュールを無効化
   */
  deactivate(): Schedule {
    return new Schedule(
      this.id,
      this.name,
      this.config,
      this.action,
      'inactive',
      this.createdAt,
      this.lastExecuted,
      this.nextExecution,
      this.executionCount,
      this.maxExecutions
    );
  }

  /**
   * スケジュールを再アクティブ化
   */
  activate(): Schedule {
    return new Schedule(
      this.id,
      this.name,
      this.config,
      this.action,
      'active',
      this.createdAt,
      this.lastExecuted,
      this.nextExecution,
      this.executionCount,
      this.maxExecutions
    );
  }

  /**
   * エラーを記録
   */
  markAsFailed(): Schedule {
    return new Schedule(
      this.id,
      this.name,
      this.config,
      this.action,
      'failed',
      this.createdAt,
      this.lastExecuted,
      this.nextExecution,
      this.executionCount,
      this.maxExecutions
    );
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return `Schedule(${this.id.value}, ${this.name}, ${this.config.type}, ${this.status})`;
  }
}
