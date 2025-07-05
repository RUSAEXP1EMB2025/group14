import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { Aircon, Device, Light, Sensor } from '../entities/index.ts';
import type { AirconSettings, DeviceId, LightSettings } from '../entities/index.ts';
import type { IDeviceRepository } from '../repositories/index.ts';

export class DeviceControlService {
  constructor(
    private readonly deviceRepository: IDeviceRepository,
    private readonly logger: ILogger
  ) {}

  async controlLight(
    deviceId: DeviceId,
    isOn: boolean,
    settings?: Partial<LightSettings>
  ): Promise<Result<Light>> {
    try {
      const deviceResult = await this.deviceRepository.findById(deviceId);
      if (!deviceResult.isSuccess() || !deviceResult.data) {
        return Result.failure(new Error(`Device not found: ${deviceId.value}`));
      }

      const device = deviceResult.data;
      if (device.type !== 'light') {
        return Result.failure(new Error(`Device ${deviceId.value} is not a light`));
      }

      if (!(device instanceof Light)) {
        return Result.failure(new Error(`Device ${deviceId.value} is not a Light instance`));
      }

      let updatedLight = isOn ? device.toggle() : device;
      if (!isOn && device.isOn) {
        updatedLight = device.toggle();
      }

      // 設定を適用
      if (settings && isOn) {
        if (settings.brightness !== undefined) {
          updatedLight = updatedLight.setBrightness(settings.brightness);
        }
        if (settings.color !== undefined) {
          updatedLight = updatedLight.setColor(settings.color);
        }
        if (settings.temperature !== undefined) {
          updatedLight = updatedLight.setColorTemperature(settings.temperature);
        }
      }

      // Nature Remo APIでデバイス制御を実行
      const controlResult = await this.deviceRepository.updateDeviceState(deviceId.value, {
        power: isOn,
        brightness: settings?.brightness,
        color: settings?.color,
        temperature: settings?.temperature
      });

      if (!controlResult.isSuccess()) {
        return Result.failure(new Error(`Failed to control light: ${controlResult.error}`));
      }

      this.logger.info(`Light controlled: ${deviceId.value}, isOn: ${isOn}`);
      return Result.success(updatedLight);
    } catch (error) {
      this.logger.error('Error controlling light:', error);
      return Result.failure(new Error(`Failed to control light: ${error}`));
    }
  }

  async controlAircon(
    deviceId: DeviceId,
    isOn: boolean,
    settings?: Partial<AirconSettings>
  ): Promise<Result<Aircon>> {
    try {
      const deviceResult = await this.deviceRepository.findById(deviceId);
      if (!deviceResult.isSuccess() || !deviceResult.data) {
        return Result.failure(new Error(`Device not found: ${deviceId.value}`));
      }

      const device = deviceResult.data;
      if (device.type !== 'aircon') {
        return Result.failure(new Error(`Device ${deviceId.value} is not an aircon`));
      }

      if (!(device instanceof Aircon)) {
        return Result.failure(new Error(`Device ${deviceId.value} is not an Aircon instance`));
      }

      let updatedAircon = isOn ? device.toggle() : device;
      if (!isOn && device.isOn) {
        updatedAircon = device.toggle();
      }

      // 設定を適用
      if (settings && isOn) {
        if (settings.temperature !== undefined) {
          updatedAircon = updatedAircon.setTemperature(settings.temperature);
        }
        if (settings.mode !== undefined) {
          updatedAircon = updatedAircon.setMode(settings.mode);
        }
        if (settings.fanSpeed !== undefined) {
          updatedAircon = updatedAircon.setFanSpeed(settings.fanSpeed);
        }
      }

      // Nature Remo APIでデバイス制御を実行
      const controlResult = await this.deviceRepository.updateDeviceState(deviceId.value, {
        power: isOn,
        temperature: settings?.temperature,
        mode: settings?.mode,
        fanSpeed: settings?.fanSpeed
      });

      if (!controlResult.isSuccess()) {
        return Result.failure(new Error(`Failed to control aircon: ${controlResult.error}`));
      }

      this.logger.info(`Aircon controlled: ${deviceId.value}, isOn: ${isOn}`);
      return Result.success(updatedAircon);
    } catch (error) {
      this.logger.error('Error controlling aircon:', error);
      return Result.failure(new Error(`Failed to control aircon: ${error}`));
    }
  }

  async getSensorData(deviceId: DeviceId): Promise<Result<Sensor>> {
    try {
      const deviceResult = await this.deviceRepository.findById(deviceId);
      if (!deviceResult.isSuccess() || !deviceResult.data) {
        return Result.failure(new Error(`Device not found: ${deviceId.value}`));
      }

      const device = deviceResult.data;
      if (device.type !== 'sensor') {
        return Result.failure(new Error(`Device ${deviceId.value} is not a sensor`));
      }

      if (!(device instanceof Sensor)) {
        return Result.failure(new Error(`Device ${deviceId.value} is not a Sensor instance`));
      }

      this.logger.info(`Sensor data retrieved: ${deviceId.value}`);
      return Result.success(device);
    } catch (error) {
      this.logger.error('Error getting sensor data:', error);
      return Result.failure(new Error(`Failed to get sensor data: ${error}`));
    }
  }

  async shouldAutoControl(deviceId: DeviceId, currentTime: Date): Promise<Result<boolean>> {
    try {
      const deviceResult = await this.deviceRepository.findById(deviceId);
      if (!deviceResult.isSuccess() || !deviceResult.data) {
        return Result.failure(new Error(`Device not found: ${deviceId.value}`));
      }

      const device = deviceResult.data;

      if (!device.isOnline()) {
        return Result.success(false);
      }

      // 時間帯による制御判定（例：夜間のライト制御）
      const hour = currentTime.getHours();
      if (device.type === 'light') {
        // 夜間（18時-6時）はライトを自動制御
        return Result.success(hour >= 18 || hour <= 6);
      }

      if (device.type === 'aircon') {
        // 日中（8時-22時）はエアコンを自動制御
        return Result.success(hour >= 8 && hour <= 22);
      }

      return Result.success(false);
    } catch (error) {
      this.logger.error('Error checking auto control:', error);
      return Result.failure(new Error(`Failed to check auto control: ${error}`));
    }
  }

  async getAllDevices(): Promise<Result<Device[]>> {
    try {
      this.logger.debug('Fetching all devices');
      const result = await this.deviceRepository.findAll();

      if (!result.isSuccess()) {
        this.logger.error('Failed to fetch devices from repository:', result.error);
        return Result.failure(result.error ?? new Error('Unknown error'));
      }

      const devices = result.data || [];
      this.logger.debug(`Successfully retrieved ${devices.length} devices`);
      return Result.success(devices);
    } catch (error) {
      this.logger.error('Error getting all devices:', error);
      return Result.failure(new Error(`Failed to get all devices: ${error}`));
    }
  }
}
