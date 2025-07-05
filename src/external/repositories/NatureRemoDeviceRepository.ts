import { createConfiguration } from '../../api/generated/configuration.ts';
import { DefaultApi } from '../../api/generated/index.ts';
import type { ApplianceResponse } from '../../api/generated/models/ApplianceResponse.ts';
import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type {
  DeviceId,
  DeviceName,
  DeviceStatus,
  DeviceType
} from '../../domain/entities/Device.ts';
import { Aircon, Device, Light } from '../../domain/entities/index.ts';
import type { IDeviceRepository } from '../../domain/repositories/IDeviceRepository.ts';

interface DeviceState {
  power?: boolean;
  brightness?: number;
  color?: string;
  temperature?: number;
  mode?: string;
  fanSpeed?: string;
}

export class NatureRemoDeviceRepository implements IDeviceRepository {
  private readonly api: DefaultApi;
  private readonly maxRetries = 3;
  private readonly baseDelayMs = 1000;

  constructor(
    token: string,
    private readonly logger: ILogger
  ) {
    try {
      const config = createConfiguration({
        authMethods: {
          oauth2: {
            accessToken: token
          }
        }
      });
      this.api = new DefaultApi(config);
      this.logger.debug('NatureRemoDeviceRepository initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize NatureRemoDeviceRepository', error);
      throw new Error(
        `Failed to initialize Nature Remo API client: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * レート制限エラーかどうかを判定
   */
  private isRateLimitError(error: unknown): boolean {
    const err = error as Record<string, unknown>;
    return (
      err?.status === 429 ||
      (err?.response as Record<string, unknown>)?.status === 429 ||
      (typeof err?.message === 'string' && err.message.includes('429'))
    );
  }

  /**
   * リトライ可能なエラーかどうかを判定
   */
  private isRetryableError(error: unknown): boolean {
    const err = error as Record<string, unknown>;
    return (
      this.isRateLimitError(error) ||
      (typeof err?.status === 'number' && err.status >= 500) ||
      (typeof (err?.response as Record<string, unknown>)?.status === 'number' &&
        ((err?.response as Record<string, unknown>)?.status as number) >= 500)
    );
  }

  /**
   * レート制限エラーから待機時間を抽出
   */
  private extractRetryAfter(error: unknown): number {
    try {
      const err = error as Record<string, unknown>;
      // レート制限ヘッダーから待機時間を取得
      const headers = (err?.response as Record<string, unknown>)?.headers || err?.headers || {};
      const headersObj = headers as Record<string, unknown>;
      const retryAfter = headersObj['retry-after'] || headersObj['x-rate-limit-reset'];

      if (typeof retryAfter === 'string') {
        const resetTime = Number.parseInt(retryAfter, 10);
        if (!Number.isNaN(resetTime)) {
          // Unix timestampの場合は現在時刻との差分を計算
          if (resetTime > 1000000000) {
            const now = Math.floor(Date.now() / 1000);
            return Math.max(1, resetTime - now) * 1000;
          }
          // 秒数の場合はそのまま使用
          return resetTime * 1000;
        }
      }

      return this.baseDelayMs;
    } catch {
      return this.baseDelayMs;
    }
  }

  /**
   * リトライロジック付きでAPIリクエストを実行
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // 最後の試行でない場合のみリトライを検討
        if (attempt < this.maxRetries && this.isRetryableError(error)) {
          const delay = this.isRateLimitError(error)
            ? this.extractRetryAfter(error)
            : this.baseDelayMs * 2 ** (attempt - 1);

          this.logger.warn(
            `${operationName} failed (attempt ${attempt}/${this.maxRetries}). ` +
              `Retrying in ${delay}ms. Error: ${lastError.message}`
          );

          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // リトライしない場合はエラーを投げる
        throw error;
      }
    }

    throw lastError;
  }

  async findAll(): Promise<Result<Device[]>> {
    try {
      this.logger.debug('Fetching all devices from Nature Remo');

      const response = await this.executeWithRetry(() => this.api._1appliancesGet(), 'findAll');
      const appliances = response || [];

      const devices = appliances.map((appliance: ApplianceResponse) =>
        this.mapApplianceToDevice(appliance)
      );

      this.logger.info(`Found ${devices.length} devices`);
      return Result.success(devices);
    } catch (error) {
      this.logger.error('Failed to fetch devices', error);
      return Result.failure(new Error('Failed to fetch devices from Nature Remo'));
    }
  }

  async findById(id: DeviceId): Promise<Result<Device | null, Error>> {
    try {
      this.logger.debug(`Fetching device with ID: ${id.value}`);

      const devicesResult = await this.findAll();
      if (!devicesResult.isSuccess()) {
        return Result.failure(devicesResult.error ?? new Error('Failed to fetch devices'));
      }

      const device = devicesResult.data?.find(d => d.id.value === id.value) || null;
      return Result.success(device);
    } catch (error) {
      this.logger.error(`Failed to fetch device ${id.value}`, error);
      return Result.failure(new Error(`Failed to fetch device ${id.value}`));
    }
  }

  async findByType(type: string): Promise<Result<Device[], Error>> {
    try {
      this.logger.debug(`Fetching devices of type: ${type}`);

      const devicesResult = await this.findAll();
      if (!devicesResult.isSuccess()) {
        return Result.failure(devicesResult.error ?? new Error('Failed to fetch devices'));
      }

      const filteredDevices = devicesResult.data?.filter(d => d.type === type) || [];
      return Result.success(filteredDevices);
    } catch (error) {
      this.logger.error(`Failed to fetch devices of type ${type}`, error);
      return Result.failure(new Error(`Failed to fetch devices of type ${type}`));
    }
  }

  async updateDeviceState(
    id: string,
    state: Record<string, unknown>
  ): Promise<Result<void, Error>> {
    try {
      this.logger.debug(`Updating device ${id} state`, state);

      const deviceResult = await this.findById({ value: id });
      if (!deviceResult.isSuccess() || !deviceResult.data) {
        return Result.failure(new Error(`Device ${id} not found`));
      }

      const device = deviceResult.data;

      // Record<string, unknown>をDeviceStateに変換
      const deviceState: DeviceState = {
        power: state.power as boolean | undefined,
        brightness: state.brightness as number | undefined,
        color: state.color as string | undefined,
        temperature: state.temperature as number | undefined,
        mode: state.mode as string | undefined,
        fanSpeed: state.fanSpeed as string | undefined
      };

      // デバイスタイプに応じた制御APIを呼び出し
      if (device.type === 'light') {
        return await this.controlLight(id, deviceState);
      }
      if (device.type === 'aircon') {
        return await this.controlAircon(id, deviceState);
      }
      return Result.failure(new Error(`Unsupported device type: ${device.type}`));
    } catch (error) {
      this.logger.error(`Failed to update device ${id} state`, error);
      return Result.failure(new Error(`Failed to update device ${id} state: ${error}`));
    }
  }

  private async controlLight(deviceId: string, state: DeviceState): Promise<Result<void, Error>> {
    try {
      this.logger.info(`Controlling light ${deviceId}:`, state);

      if (state.power !== undefined) {
        // Nature Remo APIでライト制御
        const buttonName = state.power ? 'on' : 'off';

        // 正しいAPI呼び出し方法: buttonパラメータを直接渡す
        const response = await this.executeWithRetry(
          () => this.api._1appliancesApplianceidLightPost(deviceId, buttonName),
          `light control (${buttonName})`
        );

        this.logger.info(
          `Light ${deviceId} turned ${state.power ? 'on' : 'off'} via API. Response:`,
          response
        );
      }

      // 明るさの制御（ライトがONの場合のみ）
      if (state.power !== false && state.brightness !== undefined) {
        try {
          // Nature Remo APIでの明るさ制御 - より適切なボタンマッピング
          let brightnessButton: string;

          if (state.brightness >= 90) {
            brightnessButton = 'on-100'; // 最大明度
          } else if (state.brightness <= 20) {
            brightnessButton = 'night'; // 夜間モード（低明度）
          } else if (state.brightness >= 60) {
            brightnessButton = 'on-favorite'; // お気に入り設定（中程度）
          } else {
            // 段階的な明度調整のため、現在の明度に応じてbright-up/bright-downを選択
            // 実際の実装では現在の状態を取得して比較する必要がありますが、
            // ここでは単純化して中間値として扱います
            brightnessButton = state.brightness >= 50 ? 'bright-up' : 'bright-down';
          }

          const brightnessResponse = await this.executeWithRetry(
            () => this.api._1appliancesApplianceidLightPost(deviceId, brightnessButton),
            `light brightness control (${brightnessButton})`
          );
          this.logger.info(
            `Light ${deviceId} brightness set to ${state.brightness}% (${brightnessButton}). Response:`,
            brightnessResponse
          );
        } catch (brightnessError) {
          this.logger.warn(`Failed to set brightness for light ${deviceId}:`, brightnessError);
          // 明るさ設定の失敗は警告として扱い、エラーを投げない
        }
      }

      return Result.success(undefined);
    } catch (error) {
      this.logger.error(`Failed to control light ${deviceId}`, error);
      return Result.failure(new Error(`Failed to control light: ${error}`));
    }
  }

  private async controlAircon(deviceId: string, state: DeviceState): Promise<Result<void, Error>> {
    try {
      this.logger.info(`Controlling aircon ${deviceId}:`, state);

      // パワー制御
      if (state.power !== undefined) {
        try {
          const button = state.power ? undefined : 'power-off'; // power-onは省略、power-offのみ指定
          const response = await this.executeWithRetry(
            () =>
              this.api._1appliancesApplianceidAirconSettingsPost(
                deviceId,
                undefined, // airDirection
                undefined, // airDirectionH
                undefined, // airVolume
                button, // button
                state.mode, // operationMode
                state.temperature?.toString(), // temperature
                undefined // temperatureUnit
              ),
            'aircon power control'
          );
          this.logger.info(
            `Aircon ${deviceId} settings updated. Power: ${state.power ? 'on' : 'off'}, Response:`,
            response
          );
        } catch (powerError) {
          this.logger.error(`Failed to control aircon settings for ${deviceId}:`, powerError);
          return Result.failure(new Error(`Failed to control aircon: ${powerError}`));
        }
      } else if (state.temperature !== undefined || state.mode !== undefined) {
        // 電源状態の指定がない場合の設定変更
        try {
          const response = await this.executeWithRetry(
            () =>
              this.api._1appliancesApplianceidAirconSettingsPost(
                deviceId,
                undefined, // airDirection
                undefined, // airDirectionH
                undefined, // airVolume
                undefined, // button (省略＝電源ON)
                state.mode, // operationMode
                state.temperature?.toString(), // temperature
                undefined // temperatureUnit
              ),
            'aircon settings update'
          );
          this.logger.info(
            `Aircon ${deviceId} settings updated. Temperature: ${state.temperature}, Mode: ${state.mode}, Response:`,
            response
          );
        } catch (settingsError) {
          this.logger.error(`Failed to update aircon settings for ${deviceId}:`, settingsError);
          return Result.failure(new Error(`Failed to update aircon settings: ${settingsError}`));
        }
      }

      return Result.success(undefined);
    } catch (error) {
      this.logger.error(`Failed to control aircon ${deviceId}`, error);
      return Result.failure(new Error(`Failed to control aircon: ${error}`));
    }
  }

  async findByName(name: string): Promise<Result<Device[], Error>> {
    try {
      const devicesResult = await this.findAll();
      if (!devicesResult.isSuccess()) {
        return Result.failure(devicesResult.error!);
      }

      const matchingDevices =
        devicesResult.data?.filter(device =>
          device.name.value.toLowerCase().includes(name.toLowerCase())
        ) || [];

      return Result.success(matchingDevices);
    } catch (error) {
      this.logger.error(`Failed to find devices by name: ${name}`, error);
      return Result.failure(new Error(`Failed to find devices by name: ${error}`));
    }
  }

  async findOnlineDevices(): Promise<Result<Device[], Error>> {
    try {
      const devicesResult = await this.findAll();
      if (!devicesResult.isSuccess()) {
        return Result.failure(devicesResult.error!);
      }

      const onlineDevices = devicesResult.data?.filter(device => device.isOnline) || [];
      return Result.success(onlineDevices);
    } catch (error) {
      this.logger.error('Failed to find online devices', error);
      return Result.failure(new Error(`Failed to find online devices: ${error}`));
    }
  }

  /**
   * デバイスを保存 (Nature Remo APIでは実装不可)
   */
  async save(device: Device): Promise<Result<Device>> {
    this.logger.warn('Save operation not supported by Nature Remo API', { deviceId: device.id });
    return Result.failure(new Error('Save operation not supported by Nature Remo API'));
  }

  /**
   * デバイスを削除 (Nature Remo APIでは実装不可)
   */
  async delete(id: DeviceId): Promise<Result<void>> {
    this.logger.warn('Delete operation not supported by Nature Remo API', { deviceId: id });
    return Result.failure(new Error('Delete operation not supported by Nature Remo API'));
  }

  /**
   * デバイスの存在確認
   */
  async exists(id: DeviceId): Promise<Result<boolean>> {
    try {
      this.logger.debug('Checking device existence', { deviceId: id });

      const deviceResult = await this.findById(id);
      if (!deviceResult.isSuccess()) {
        return Result.failure(deviceResult.error!);
      }

      return Result.success(deviceResult.data !== null);
    } catch (error) {
      this.logger.error('Failed to check device existence', error);
      return Result.failure(new Error(`Failed to check device existence: ${error}`));
    }
  }

  /**
   * デバイス状態を更新
   */
  async updateStatus(id: DeviceId, isOnline: boolean): Promise<Result<Device>> {
    this.logger.warn('Status update not supported by Nature Remo API', { deviceId: id, isOnline });
    return Result.failure(new Error('Status update not supported by Nature Remo API'));
  }

  /**
   * Nature Remo の Appliance を Device エンティティにマッピング
   */
  private mapApplianceToDevice(appliance: ApplianceResponse): Device {
    const deviceId: DeviceId = { value: appliance.id || '' };
    const deviceName: DeviceName = {
      value: appliance.nickname || appliance.model?.name || 'Unknown'
    };
    const deviceStatus: DeviceStatus = {
      isOnline: true, // Nature Remo APIでは常にオンラインと仮定
      lastUpdated: new Date()
    };

    // デバイスタイプを判定
    let deviceType: DeviceType;
    if (appliance.type === 'AC') {
      deviceType = 'aircon';
    } else if (appliance.type === 'LIGHT') {
      deviceType = 'light';
    } else {
      deviceType = 'sensor';
    }

    // エンティティのタイプに応じてインスタンスを作成
    if (deviceType === 'light') {
      return new Light(
        deviceId,
        deviceName,
        deviceStatus,
        { brightness: 100, color: '#FFFFFF', temperature: 6500 } // 設定
      );
    }
    if (deviceType === 'aircon') {
      return new Aircon(
        deviceId,
        deviceName,
        deviceStatus,
        { temperature: 24, mode: 'auto', fanSpeed: 'auto' } // 設定
      );
    }
    return new Device(deviceId, deviceName, deviceType, deviceStatus, []);
  }
}
