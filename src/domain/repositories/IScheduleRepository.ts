/**
 * Schedule Repository Interface - スケジュール管理のリポジトリインターフェース
 */

import type { Result } from '../../core/base/Result.ts';
import type { Schedule, ScheduleId, ScheduleStatus, ScheduleType } from '../entities/index.ts';

export interface IScheduleRepository {
  /**
   * 全スケジュールを取得
   */
  findAll(): Promise<Result<Schedule[]>>;

  /**
   * IDでスケジュールを取得
   */
  findById(id: ScheduleId): Promise<Result<Schedule | null>>;

  /**
   * アクティブなスケジュールを取得
   */
  findActive(): Promise<Result<Schedule[]>>;

  /**
   * タイプでスケジュールを検索
   */
  findByType(type: ScheduleType): Promise<Result<Schedule[]>>;

  /**
   * ステータスでスケジュールを検索
   */
  findByStatus(status: ScheduleStatus): Promise<Result<Schedule[]>>;

  /**
   * 実行予定のスケジュールを取得
   */
  findScheduledBefore(date: Date): Promise<Result<Schedule[]>>;

  /**
   * スケジュールを保存
   */
  save(schedule: Schedule): Promise<Result<Schedule>>;

  /**
   * スケジュールを削除
   */
  delete(id: ScheduleId): Promise<Result<void>>;

  /**
   * スケジュールの存在確認
   */
  exists(id: ScheduleId): Promise<Result<boolean>>;

  /**
   * 実行回数を更新
   */
  updateExecutionCount(id: ScheduleId, count: number): Promise<Result<Schedule>>;

  /**
   * 次回実行時刻を更新
   */
  updateNextExecution(id: ScheduleId, nextExecution: Date): Promise<Result<Schedule>>;
}
