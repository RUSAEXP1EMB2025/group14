/**
 * Message Repository Interface - メッセージ管理のリポジトリインターフェース
 */

import type { Result } from '../../core/base/Result.ts';
import type { Message, MessageId, UserId } from '../entities/index.ts';

export interface IMessageRepository {
  /**
   * メッセージを保存
   */
  save(message: Message): Promise<Result<Message>>;

  /**
   * IDでメッセージを取得
   */
  findById(id: MessageId): Promise<Result<Message | null>>;

  /**
   * ユーザーのメッセージ履歴を取得
   */
  findByUserId(userId: UserId, limit?: number): Promise<Result<Message[]>>;

  /**
   * 最新のメッセージを取得
   */
  findLatest(limit?: number): Promise<Result<Message[]>>;

  /**
   * キーワードでメッセージを検索
   */
  searchByKeyword(keyword: string, limit?: number): Promise<Result<Message[]>>;

  /**
   * 古いメッセージを削除
   */
  deleteOlderThan(days: number): Promise<Result<number>>;

  /**
   * メッセージ数を取得
   */
  count(): Promise<Result<number>>;

  /**
   * ユーザーのメッセージ数を取得
   */
  countByUserId(userId: UserId): Promise<Result<number>>;
}
