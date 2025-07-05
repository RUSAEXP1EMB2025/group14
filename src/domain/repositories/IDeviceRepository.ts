/**
 * Device Repository Interface - デバイス管理のリポジトリインターフェース
 */

import type { Result } from '../../core/base/Result.ts';
import type { Device, DeviceId, DeviceType } from '../entities/index.ts';

export interface IDeviceRepository {
  /**
   * 全デバイスを取得
   */
  findAll(): Promise<Result<Device[]>>;

  /**
   * IDでデバイスを取得
   */
  findById(id: DeviceId): Promise<Result<Device | null>>;

  /**
   * タイプでデバイスを検索
   */
  findByType(type: DeviceType): Promise<Result<Device[]>>;

  /**
   * 名前でデバイスを検索
   */
  findByName(name: string): Promise<Result<Device[]>>;

  /**
   * オンラインデバイスを取得
   */
  findOnlineDevices(): Promise<Result<Device[]>>;

  /**
   * デバイスを保存
   */
  save(device: Device): Promise<Result<Device>>;

  /**
   * デバイスを削除
   */
  delete(id: DeviceId): Promise<Result<void>>;

  /**
   * デバイスの存在確認
   */
  exists(id: DeviceId): Promise<Result<boolean>>;

  /**
   * デバイス状態を更新
   */
  updateStatus(id: DeviceId, isOnline: boolean): Promise<Result<Device>>;

  /**
   * デバイスの制御状態を更新（Nature Remo API用）
   */
  updateDeviceState(deviceId: string, state: Record<string, unknown>): Promise<Result<void>>;
}
