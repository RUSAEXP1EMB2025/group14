import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { DeviceControlService } from '../../domain/index.ts';
import type { Aircon, AirconMode, DeviceId, FanSpeed, Light } from '../../domain/index.ts';

export interface MutableLightSettings {
  brightness?: number;
  color?: string;
  temperature?: number;
}

export interface MutableAirconSettings {
  temperature?: number;
  mode?: AirconMode;
  fanSpeed?: FanSpeed;
  humidity?: number;
}

export interface DeviceControlRequest {
  readonly deviceId: string;
  readonly action: 'on' | 'off' | 'toggle';
  readonly settings?: Record<string, unknown>;
}

export interface DeviceControlResult {
  readonly success: boolean;
  readonly deviceId: string;
  readonly previousState: unknown;
  readonly newState: unknown;
  readonly message: string;
}

export class ControlDeviceUseCase {
  constructor(
    private readonly deviceControlService: DeviceControlService,
    private readonly logger: ILogger
  ) {}

  async controlLight(request: DeviceControlRequest): Promise<Result<DeviceControlResult>> {
    try {
      const deviceId: DeviceId = { value: request.deviceId };
      const isOn = this.determineTargetState(request.action, 'light');

      // 設定を準備
      const settings: MutableLightSettings = {};
      if (request.settings) {
        if (typeof request.settings.brightness === 'number') {
          settings.brightness = request.settings.brightness;
        }
        if (typeof request.settings.color === 'string') {
          settings.color = request.settings.color;
        }
        if (typeof request.settings.temperature === 'number') {
          settings.temperature = request.settings.temperature;
        }
      }

      // 現在の状態を取得（エラーハンドリング付き）
      const currentResult = await this.deviceControlService.getSensorData(deviceId);
      const previousState = currentResult.isSuccess() ? currentResult.data : null;

      // ライトを制御
      const controlResult = await this.deviceControlService.controlLight(
        deviceId,
        isOn,
        Object.keys(settings).length > 0 ? settings : undefined
      );

      if (!controlResult.isSuccess()) {
        return Result.failure(new Error(`Light control failed: ${controlResult.error}`));
      }

      const light = controlResult.data!;

      this.logger.info(`Light controlled: ${request.deviceId}, action: ${request.action}`);

      return Result.success({
        success: true,
        deviceId: request.deviceId,
        previousState,
        newState: {
          isOn: light.isOn,
          settings: light.settings,
          status: light.status
        },
        message: `Light ${request.action} completed successfully`
      });
    } catch (error) {
      this.logger.error('Error controlling light:', error);
      return Result.failure(new Error(`Failed to control light: ${error}`));
    }
  }

  async controlAircon(request: DeviceControlRequest): Promise<Result<DeviceControlResult>> {
    try {
      const deviceId: DeviceId = { value: request.deviceId };
      const isOn = this.determineTargetState(request.action, 'aircon');

      // 設定を準備
      const settings: MutableAirconSettings = {};
      if (request.settings) {
        if (typeof request.settings.temperature === 'number') {
          settings.temperature = request.settings.temperature;
        }
        if (typeof request.settings.mode === 'string') {
          settings.mode = request.settings.mode as AirconMode;
        }
        if (typeof request.settings.fanSpeed === 'string') {
          settings.fanSpeed = request.settings.fanSpeed as FanSpeed;
        }
        if (typeof request.settings.humidity === 'number') {
          settings.humidity = request.settings.humidity;
        }
      }

      // 現在の状態を取得
      const currentResult = await this.deviceControlService.getSensorData(deviceId);
      const previousState = currentResult.isSuccess() ? currentResult.data : null;

      // エアコンを制御
      const controlResult = await this.deviceControlService.controlAircon(
        deviceId,
        isOn,
        Object.keys(settings).length > 0 ? settings : undefined
      );

      if (!controlResult.isSuccess()) {
        return Result.failure(new Error(`Aircon control failed: ${controlResult.error}`));
      }

      const aircon = controlResult.data!;

      this.logger.info(`Aircon controlled: ${request.deviceId}, action: ${request.action}`);

      return Result.success({
        success: true,
        deviceId: request.deviceId,
        previousState,
        newState: {
          isOn: aircon.isOn,
          settings: aircon.settings,
          currentTemperature: aircon.currentTemperature,
          currentHumidity: aircon.currentHumidity,
          status: aircon.status
        },
        message: `Aircon ${request.action} completed successfully`
      });
    } catch (error) {
      this.logger.error('Error controlling aircon:', error);
      return Result.failure(new Error(`Failed to control aircon: ${error}`));
    }
  }

  async executeAutoControl(deviceId: string): Promise<Result<DeviceControlResult[]>> {
    try {
      const deviceIdObj: DeviceId = { value: deviceId };
      const currentTime = new Date();

      // 自動制御が必要かチェック
      const shouldControlResult = await this.deviceControlService.shouldAutoControl(
        deviceIdObj,
        currentTime
      );

      if (!shouldControlResult.isSuccess()) {
        return Result.failure(new Error(`Auto control check failed: ${shouldControlResult.error}`));
      }

      if (!shouldControlResult.data) {
        this.logger.info(`Auto control not needed for device: ${deviceId}`);
        return Result.success([]);
      }

      // デバイスタイプに応じて自動制御を実行
      // この実装は簡略化されており、実際にはデバイスタイプを判定する必要があります
      const results: DeviceControlResult[] = [];

      // 例：夜間のライト自動点灯
      const hour = currentTime.getHours();
      if (hour >= 18 || hour <= 6) {
        const lightControlRequest: DeviceControlRequest = {
          deviceId,
          action: 'on',
          settings: { brightness: 50 }
        };

        const lightResult = await this.controlLight(lightControlRequest);
        if (lightResult.isSuccess()) {
          results.push(lightResult.data!);
        }
      }

      this.logger.info(`Auto control executed for device: ${deviceId}, results: ${results.length}`);
      return Result.success(results);
    } catch (error) {
      this.logger.error('Error executing auto control:', error);
      return Result.failure(new Error(`Failed to execute auto control: ${error}`));
    }
  }

  private determineTargetState(action: string, deviceType: string): boolean {
    switch (action) {
      case 'on':
        return true;
      case 'off':
        return false;
      case 'toggle':
        // トグルの場合は現在の状態を取得して反転する必要がありますが、
        // 簡略化のためここではデフォルトでオンにします
        return true;
      default:
        throw new Error(`Unknown action: ${action} for device type: ${deviceType}`);
    }
  }
}
