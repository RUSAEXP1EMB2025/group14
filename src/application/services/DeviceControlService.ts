import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory.ts';
import { DefaultApi, createConfiguration } from '../../api/generated/index.ts';
import type { ApplianceResponse } from '../../api/generated/index.ts';

export interface DeviceControlResult {
  readonly success: boolean;
  readonly message: string;
  readonly applianceId?: string;
}

export class DeviceControlService {
  private readonly logger: ILogger;
  private readonly api: DefaultApi;

  constructor() {
    this.logger = LoggerFactory.create('DeviceControlService');

    const accessToken = process.env.NATURE_REMO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('NATURE_REMO_ACCESS_TOKEN が設定されていません');
    }

    const configuration = createConfiguration({
      authMethods: {
        oauth2: {
          accessToken: accessToken
        }
      }
    });

    this.api = new DefaultApi(configuration);
  }

  /**
   * 電気を消す
   */
  async turnOffLights(): Promise<DeviceControlResult> {
    try {
      this.logger.info('💡 電気を消します...');

      // 家電一覧を取得
      const appliancesResponse = await this.api._1appliancesGet();
      const appliances = appliancesResponse as ApplianceResponse[];

      // ライト（照明）を検索
      const lightAppliance = appliances.find(appliance => appliance.type === 'LIGHT');

      if (!lightAppliance) {
        const message = '電気が見つかりませんでした';
        this.logger.warn(message);
        return {
          success: false,
          message
        };
      }

      this.logger.info(`🎯 対象の電気: ${lightAppliance.nickname} (ID: ${lightAppliance.id})`);

      // 電気を消す（offボタンを押す）
      await this.api._1appliancesApplianceidLightPost(lightAppliance.id!, 'off');

      const successMessage = `電気「${lightAppliance.nickname}」を消しました`;
      this.logger.info(`✅ ${successMessage}`);

      return {
        success: true,
        message: successMessage,
        applianceId: lightAppliance.id
      };
    } catch (error) {
      const errorMessage = `電気の制御に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage, error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * 電気を点ける
   */
  async turnOnLights(): Promise<DeviceControlResult> {
    try {
      this.logger.info('💡 電気を点けます...');

      // 家電一覧を取得
      const appliancesResponse = await this.api._1appliancesGet();
      const appliances = appliancesResponse as ApplianceResponse[];

      // ライト（照明）を検索
      const lightAppliance = appliances.find(appliance => appliance.type === 'LIGHT');

      if (!lightAppliance) {
        const message = '電気が見つかりませんでした';
        this.logger.warn(message);
        return {
          success: false,
          message
        };
      }

      this.logger.info(`🎯 対象の電気: ${lightAppliance.nickname} (ID: ${lightAppliance.id})`);

      // 電気を点ける（onボタンを押す）
      await this.api._1appliancesApplianceidLightPost(lightAppliance.id!, 'on');

      const successMessage = `電気「${lightAppliance.nickname}」を点けました`;
      this.logger.info(`✅ ${successMessage}`);

      return {
        success: true,
        message: successMessage,
        applianceId: lightAppliance.id
      };
    } catch (error) {
      const errorMessage = `電気の制御に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage, error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * エアコンをつける
   */
  async turnOnAircon(): Promise<DeviceControlResult> {
    try {
      this.logger.info('❄️ エアコンをつけます...');

      // 家電一覧を取得
      const appliancesResponse = await this.api._1appliancesGet();
      const appliances = appliancesResponse as ApplianceResponse[];

      // エアコンを検索
      const airconAppliance = appliances.find(appliance => appliance.type === 'AC');

      if (!airconAppliance) {
        const message = 'エアコンが見つかりませんでした';
        this.logger.warn(message);
        return {
          success: false,
          message
        };
      }

      this.logger.info(
        `🎯 対象のエアコン: ${airconAppliance.nickname} (ID: ${airconAppliance.id})`
      );

      // エアコンをつける
      await this.api._1appliancesApplianceidAirconSettingsPost(
        airconAppliance.id!,
        undefined, // airDirection
        undefined, // airDirectionH
        'auto', // airVolume
        undefined, // button (empty means powered on)
        'cool', // operationMode
        '24', // temperature
        'c' // temperatureUnit
      );

      const successMessage = `エアコン「${airconAppliance.nickname}」をつけました`;
      this.logger.info(`✅ ${successMessage}`);

      return {
        success: true,
        message: successMessage,
        applianceId: airconAppliance.id
      };
    } catch (error) {
      const errorMessage = `エアコンの制御に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage, error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * エアコンを消す
   */
  async turnOffAircon(): Promise<DeviceControlResult> {
    try {
      this.logger.info('❄️ エアコンを消します...');

      // 家電一覧を取得
      const appliancesResponse = await this.api._1appliancesGet();
      const appliances = appliancesResponse as ApplianceResponse[];

      // エアコンを検索
      const airconAppliance = appliances.find(appliance => appliance.type === 'AC');

      if (!airconAppliance) {
        const message = 'エアコンが見つかりませんでした';
        this.logger.warn(message);
        return {
          success: false,
          message
        };
      }

      this.logger.info(
        `🎯 対象のエアコン: ${airconAppliance.nickname} (ID: ${airconAppliance.id})`
      );

      // エアコンを消す
      await this.api._1appliancesApplianceidAirconSettingsPost(
        airconAppliance.id!,
        undefined, // airDirection
        undefined, // airDirectionH
        undefined, // airVolume
        'power-off', // button (power-off to turn off)
        undefined, // operationMode
        undefined, // temperature
        undefined // temperatureUnit
      );

      const successMessage = `エアコン「${airconAppliance.nickname}」を消しました`;
      this.logger.info(`✅ ${successMessage}`);

      return {
        success: true,
        message: successMessage,
        applianceId: airconAppliance.id
      };
    } catch (error) {
      const errorMessage = `エアコンの制御に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage, error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * 利用可能な電気の一覧を取得
   */
  async getAvailableLights(): Promise<Array<{ id: string; nickname: string; type: string }>> {
    try {
      // 家電一覧を取得
      const appliancesResponse = await this.api._1appliancesGet();
      const appliances = appliancesResponse as ApplianceResponse[];

      const lightAppliances = appliances.filter(appliance => appliance.type === 'LIGHT');

      return lightAppliances.map(appliance => ({
        id: appliance.id!,
        nickname: appliance.nickname || '名前なし',
        type: appliance.type!
      }));
    } catch (error) {
      this.logger.error('電気一覧の取得に失敗:', error);
      return [];
    }
  }
}
