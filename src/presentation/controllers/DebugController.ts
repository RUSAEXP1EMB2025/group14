import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type { IDeviceRepository } from '../../domain/repositories/IDeviceRepository.ts';
import type { DeviceAutomationService } from '../../application/services/DeviceAutomationService.ts';
import type { ManageScheduleUseCase } from '../../application/usecases/ManageScheduleUseCase.ts';
import { DefaultApi, createConfiguration } from '../../api/generated/index.ts';

export class DebugController {
  private apiClient?: DefaultApi;

  constructor(
    private readonly deviceRepository: IDeviceRepository,
    private readonly automationService: DeviceAutomationService,
    private readonly manageScheduleUseCase: ManageScheduleUseCase,
    private readonly logger: ILogger
  ) {
    const accessToken = process.env.NATURE_REMO_ACCESS_TOKEN;
    if (accessToken) {
      const configuration = createConfiguration({
        authMethods: {
          oauth2: {
            accessToken: accessToken
          }
        }
      });
      this.apiClient = new DefaultApi(configuration);
    }
  }

  async listDevices(): Promise<Response> {
    try {
      this.logger.info('Fetching all available devices for debugging');

      const result = await this.deviceRepository.findAll();

      if (result.isFailure()) {
        this.logger.error('Failed to fetch devices:', result.error);
        return new Response(
          JSON.stringify({
            error: 'Failed to fetch devices',
            details: result.error?.message
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }

      const devices = result.getValue() || [];

      this.logger.info(`Found ${devices.length} devices`);

      const deviceInfo = devices.map(device => ({
        id: device.id.value,
        name: device.name.value,
        type: device.type,
        status: device.status,
        isOnline: device.isOnline
      }));

      return new Response(
        JSON.stringify(
          {
            success: true,
            deviceCount: devices.length,
            devices: deviceInfo
          },
          null,
          2
        ),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    } catch (error) {
      this.logger.error('Error in listDevices:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
  }

  /**
   * Nature Remo APIの生のレスポンスを取得
   */
  async getRawDevices(): Promise<Response> {
    try {
      this.logger.info('Fetching raw devices from Nature Remo API');

      if (!this.apiClient) {
        return new Response(JSON.stringify({ error: 'NATURE_REMO_ACCESS_TOKEN not configured' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const rawData = await this.apiClient._1appliancesGet();
      this.logger.info(
        `Received ${Array.isArray(rawData) ? rawData.length : 'unknown'} raw appliances`
      );

      return new Response(
        JSON.stringify(
          {
            success: true,
            rawDevices: rawData
          },
          null,
          2
        ),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    } catch (error) {
      this.logger.error('Error in getRawDevices:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
  }

  /**
   * Nature Remo APIから生のAppliance詳細データを取得
   */
  async getApplianceDetails(): Promise<Response> {
    try {
      this.logger.info('Fetching detailed appliance information from Nature Remo API');

      if (!this.apiClient) {
        return new Response(JSON.stringify({ error: 'NATURE_REMO_ACCESS_TOKEN not configured' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const rawData = await this.apiClient._1appliancesGet();

      // 各デバイスの詳細情報を整理
      const detailedInfo = rawData.map(appliance => ({
        id: appliance.id,
        nickname: appliance.nickname,
        type: appliance.type,
        model: appliance.model,
        signals: appliance.signals
          ? appliance.signals.map(signal => ({
              id: signal.id,
              name: signal.name,
              image: signal.image
            }))
          : [],
        light: appliance.light || null,
        aircon: appliance.aircon || null,
        device: appliance.device || null
      }));

      this.logger.info(`Retrieved detailed info for ${detailedInfo.length} appliances`);

      return new Response(
        JSON.stringify(
          {
            success: true,
            applianceDetails: detailedInfo
          },
          null,
          2
        ),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    } catch (error) {
      this.logger.error('Error in getApplianceDetails:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
  }

  /**
   * デバッグ用サンセット通知スケジュールを作成
   */
  async createDebugSunsetSchedule(): Promise<Response> {
    try {
      this.logger.info('Creating debug sunset notification schedule...');

      // デバッグ用にLINE通知スケジュールを作成（1分後に実行）
      const notificationTime = new Date();
      notificationTime.setMinutes(notificationTime.getMinutes() + 1);

      const scheduleRequest = {
        name: `Debug Sunset Notification - ${new Date().toDateString()}`,
        config: {
          type: 'once' as const,
          executionTime: notificationTime
        },
        action: {
          type: 'line_notification',
          target: process.env.LINE_TEST_USER_ID || 'U3830da6f880adc8bec8cba85c00c56fa',
          parameters: {
            message: '🧪 DEBUG: 日の入り通知テスト\n\n電気を付けますか？',
            quickReply: [
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: '点灯する',
                  data: 'action=turn_on_lights&reason=debug_sunset'
                }
              }
            ]
          }
        }
      };

      const result = await this.manageScheduleUseCase.createSchedule(scheduleRequest);

      if (result.isFailure()) {
        this.logger.error('Failed to create debug sunset schedule:', result.error);
        return new Response(
          JSON.stringify({
            error: 'Failed to create debug sunset schedule',
            details: result.error?.message
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }

      const scheduleInfo = result.getValue();

      this.logger.info('Debug sunset schedule created successfully:', {
        scheduleId: scheduleInfo.id,
        notificationTime: notificationTime.toLocaleString(),
        message: scheduleRequest.action.parameters.message
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Debug sunset notification schedule created successfully',
          scheduleInfo: {
            id: scheduleInfo.id,
            name: scheduleInfo.name,
            notificationTime: notificationTime.toLocaleString(),
            timeUntilNotification: `${Math.round((notificationTime.getTime() - Date.now()) / 1000)} seconds`
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    } catch (error) {
      this.logger.error('Error in createDebugSunsetSchedule:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
  }
}
