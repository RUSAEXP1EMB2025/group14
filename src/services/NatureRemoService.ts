import type {
  SensorData,
  DeviceControlRequest,
  NatureRemoDevice,
  NatureRemoAppliance
} from '../types/index.ts';
import { logger } from '../utils/logger.ts';
import { createConfiguration, DefaultApi } from '../api/generated/index.ts';
import type { DeviceResponse, ApplianceResponse } from '../api/generated/index.ts';

export class NatureRemoService {
  private apiClient: DefaultApi;

  constructor(accessToken: string) {
    const configuration = createConfiguration({
      authMethods: {
        oauth2: {
          accessToken: accessToken
        }
      }
    });

    this.apiClient = new DefaultApi(configuration);
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.apiClient._1usersMeGet();
      logger.info('API接続テスト成功:', result);
      return { success: true };
    } catch (error) {
      logger.error('API接続テストエラー:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async listDevicesAndAppliances(): Promise<{
    devices: NatureRemoDevice[];
    appliances: NatureRemoAppliance[];
  }> {
    try {
      const [devicesResponse, appliancesResponse] = await Promise.all([
        this.apiClient._1devicesGet(),
        this.apiClient._1appliancesGet()
      ]);

      const devices = devicesResponse as DeviceResponse[];
      const appliances = appliancesResponse as ApplianceResponse[];

      return {
        devices: devices as NatureRemoDevice[],
        appliances: appliances as NatureRemoAppliance[]
      };
    } catch (error) {
      logger.error('デバイス・家電一覧取得エラー:', error);
      throw error;
    }
  }

  async getSensorData(): Promise<SensorData> {
    try {
      const devicesResponse = await this.apiClient._1devicesGet();
      const devices = devicesResponse as DeviceResponse[];

      if (!devices || devices.length === 0) {
        throw new Error('No devices found');
      }

      const device = devices[0];
      if (!device) {
        throw new Error('No device data available');
      }

      const events = device.newestEvents || {};

      return {
        temperature: events.te?.val || 0,
        humidity: events.hu?.val || 0,
        illuminance: events.il?.val || 0,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('センサーデータ取得エラー:', error);
      throw error;
    }
  }

  private async findApplianceByType(type: 'LIGHT' | 'AC'): Promise<string> {
    try {
      const { appliances } = await this.listDevicesAndAppliances();
      const appliance = appliances.find((app: NatureRemoAppliance) => app.type === type);

      if (!appliance) {
        throw new Error(
          `${type} type appliance not found. Please register your ${type.toLowerCase()} in Nature Remo app.`
        );
      }

      return appliance.id;
    } catch (error) {
      logger.error(`家電検索エラー (${type}):`, error);
      throw error;
    }
  }

  async controlLight(action: 'on' | 'off' | 'adjust', brightness?: number): Promise<void> {
    logger.info(`照明制御: ${action}${brightness ? ` (明度: ${brightness})` : ''}`);

    try {
      const applianceId = await this.findApplianceByType('LIGHT');

      let buttonName: string;
      switch (action) {
        case 'on':
          buttonName = 'on';
          break;
        case 'off':
          buttonName = 'off';
          break;
        case 'adjust':
          buttonName = 'bright';
          break;
        default:
          buttonName = 'on';
      }

      const response = await this.apiClient._1appliancesApplianceidLightPost(
        applianceId,
        buttonName
      );
      logger.info('照明制御API応答:', response);
      logger.info(`照明制御完了: ${buttonName} ボタンを押しました`);
    } catch (error) {
      logger.error('照明制御エラー:', error);
      throw error;
    }
  }

  async controlAircon(action: 'on' | 'off', temperature?: number): Promise<void> {
    logger.info(`エアコン制御: ${action}${temperature ? ` (温度: ${temperature}度)` : ''}`);

    try {
      const applianceId = await this.findApplianceByType('AC');

      const emptyString = '';
      const targetTemperature = temperature?.toString() || '24';
      const temperatureUnit = 'c';

      if (action === 'on') {
        const response = await this.apiClient._1appliancesApplianceidAirconSettingsPost(
          applianceId,
          emptyString, // airDirection
          emptyString, // airDirectionH
          emptyString, // airVolume
          emptyString, // button
          'cool', // operationMode
          targetTemperature, // temperature
          temperatureUnit // temperatureUnit
        );
        logger.info('エアコンON API応答:', response);
      } else {
        const response = await this.apiClient._1appliancesApplianceidAirconSettingsPost(
          applianceId,
          emptyString, // airDirection
          emptyString, // airDirectionH
          emptyString, // airVolume
          'power-off', // button
          emptyString, // operationMode
          emptyString, // temperature
          emptyString // temperatureUnit
        );
        logger.info('エアコンOFF API応答:', response);
      }

      logger.info('エアコン制御完了');
    } catch (error) {
      logger.error('エアコン制御エラー:', error);
      throw error;
    }
  }

  async executeDeviceControl(request: DeviceControlRequest): Promise<void> {
    switch (request.deviceType) {
      case 'light': {
        const brightness =
          typeof request.parameters?.brightness === 'number'
            ? request.parameters.brightness
            : undefined;
        await this.controlLight(request.action, brightness);
        break;
      }
      case 'aircon': {
        if (request.action === 'adjust') {
          throw new Error('Adjust action is not supported for air conditioner');
        }
        const temperature =
          typeof request.parameters?.temperature === 'number'
            ? request.parameters.temperature
            : undefined;
        await this.controlAircon(request.action, temperature);
        break;
      }
      default: {
        const exhaustiveCheck: never = request.deviceType;
        throw new Error(`Unsupported device type: ${exhaustiveCheck}`);
      }
    }
  }

  async getApplianceDetails(applianceId: string): Promise<NatureRemoAppliance> {
    try {
      const { appliances } = await this.listDevicesAndAppliances();
      const appliance = appliances.find((app: NatureRemoAppliance) => app.id === applianceId);

      if (!appliance) {
        throw new Error(`Appliance with ID ${applianceId} not found`);
      }

      return appliance;
    } catch (error) {
      logger.error(`家電詳細取得エラー (${applianceId}):`, error);
      throw error;
    }
  }

  async getAllSignals(applianceId: string): Promise<unknown[]> {
    try {
      const signalsResponse = await this.apiClient._1appliancesApplianceidSignalsGet(applianceId);
      return Array.isArray(signalsResponse) ? signalsResponse : [];
    } catch (error) {
      logger.error(`信号一覧取得エラー (${applianceId}):`, error);
      throw error;
    }
  }

  async getAvailableLightButtons(): Promise<string[]> {
    try {
      const applianceId = await this.findApplianceByType('LIGHT');
      const appliance = await this.getApplianceDetails(applianceId);

      return [`照明 (${appliance.nickname}) の基本操作: on, off, bright`];
    } catch (error) {
      logger.error('利用可能照明ボタン取得エラー:', error);
      return [];
    }
  }
}
