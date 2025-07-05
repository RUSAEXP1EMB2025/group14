import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type { ScheduleConfig, ScheduleType, TaskAction } from '../../domain/entities/index.ts';
import { ControlDeviceUseCase, ManageScheduleUseCase } from '../usecases/index.ts';
import type {
  CreateScheduleRequest,
  DeviceControlRequest,
  ScheduleExecutionResult
} from '../usecases/index.ts';
import type { DeviceControlResult } from './DeviceControlService.ts';

export interface AutomationRule {
  readonly id: string;
  readonly name: string;
  readonly trigger: {
    type: 'time' | 'sensor' | 'manual';
    conditions: Record<string, unknown>;
  };
  readonly actions: DeviceControlRequest[];
  readonly enabled: boolean;
}

export interface AutomationExecutionResult {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly executionTime: Date;
  readonly success: boolean;
  readonly actionsExecuted: number;
  readonly errors: string[];
}

export class DeviceAutomationService {
  constructor(
    private readonly controlDeviceUseCase: ControlDeviceUseCase,
    private readonly manageScheduleUseCase: ManageScheduleUseCase,
    private readonly logger: ILogger
  ) {}

  async setupSunsetAutomation(): Promise<Result<string>> {
    try {
      this.logger.info('Setting up sunset automation');

      const scheduleRequest: CreateScheduleRequest = {
        name: 'Sunset Light Automation',
        config: {
          type: 'sunset' as ScheduleType,
          timezone: 'Asia/Tokyo'
        },
        action: {
          type: 'device_control',
          target: 'light_001',
          parameters: {
            action: 'on',
            settings: {
              brightness: 70,
              temperature: 3000
            }
          }
        }
      };

      const scheduleResult = await this.manageScheduleUseCase.createSchedule(scheduleRequest);

      if (!scheduleResult.isSuccess()) {
        return Result.failure(
          new Error(`Failed to create sunset schedule: ${scheduleResult.error}`)
        );
      }

      const scheduleId = scheduleResult.data!.id.value;
      this.logger.info(`Sunset automation scheduled: ${scheduleId}`);

      return Result.success(scheduleId);
    } catch (error) {
      this.logger.error('Error setting up sunset automation:', error);
      return Result.failure(new Error(`Failed to setup sunset automation: ${error}`));
    }
  }

  async setupTemperatureMonitoring(intervalMinutes = 30): Promise<Result<string>> {
    try {
      this.logger.info(`Setting up temperature monitoring (${intervalMinutes} minute intervals)`);

      const scheduleRequest: CreateScheduleRequest = {
        name: 'Temperature Monitoring',
        config: {
          type: 'interval' as ScheduleType,
          intervalMinutes: intervalMinutes,
          timezone: 'Asia/Tokyo'
        },
        action: {
          type: 'temperature_check',
          target: 'sensor_001',
          parameters: {
            targetTemperature: 24,
            tolerance: 2,
            airconDeviceId: 'aircon_001'
          }
        }
      };

      const scheduleResult = await this.manageScheduleUseCase.createSchedule(scheduleRequest);

      if (!scheduleResult.isSuccess()) {
        return Result.failure(
          new Error(`Failed to create temperature monitoring schedule: ${scheduleResult.error}`)
        );
      }

      const scheduleId = scheduleResult.data!.id.value;
      this.logger.info(`Temperature monitoring scheduled: ${scheduleId}`);

      return Result.success(scheduleId);
    } catch (error) {
      this.logger.error('Error setting up temperature monitoring:', error);
      return Result.failure(new Error(`Failed to setup temperature monitoring: ${error}`));
    }
  }

  async executeAutomationRule(rule: AutomationRule): Promise<Result<AutomationExecutionResult>> {
    try {
      this.logger.info(`Executing automation rule: ${rule.name} (${rule.id})`);

      if (!rule.enabled) {
        return Result.success({
          ruleId: rule.id,
          ruleName: rule.name,
          executionTime: new Date(),
          success: false,
          actionsExecuted: 0,
          errors: ['Rule is disabled']
        });
      }

      const errors: string[] = [];
      let actionsExecuted = 0;

      for (const action of rule.actions) {
        try {
          let result: Result<DeviceControlResult>;

          if (this.isLightDevice(action.deviceId)) {
            result = await this.controlDeviceUseCase.controlLight(action);
          } else {
            // エアコン制御は現在サポートされていません
            errors.push(`Device type not supported: ${action.deviceId}`);
            continue;
          }

          if (result.isSuccess()) {
            actionsExecuted++;
            this.logger.info(`Action executed: ${action.deviceId} - ${action.action}`);
          } else {
            errors.push(`Action failed: ${action.deviceId} - ${result.error}`);
          }
        } catch (error) {
          errors.push(`Action error: ${action.deviceId} - ${error}`);
        }
      }

      const success = errors.length === 0;

      this.logger.info(
        `Automation rule executed: ${rule.name}, success: ${success}, actions: ${actionsExecuted}/${rule.actions.length}`
      );

      return Result.success({
        ruleId: rule.id,
        ruleName: rule.name,
        executionTime: new Date(),
        success,
        actionsExecuted,
        errors
      });
    } catch (error) {
      this.logger.error('Error executing automation rule:', error);
      return Result.failure(new Error(`Failed to execute automation rule: ${error}`));
    }
  }

  async executeScheduledTasks(): Promise<Result<ScheduleExecutionResult[]>> {
    try {
      this.logger.info('Executing scheduled tasks');

      const result = await this.manageScheduleUseCase.processScheduledTasks();

      if (!result.isSuccess()) {
        return Result.failure(new Error(`Failed to execute scheduled tasks: ${result.error}`));
      }

      const results = result.data!;
      const successCount = results.filter(r => r.success).length;

      this.logger.info(`Scheduled tasks executed: ${successCount}/${results.length} successful`);

      return Result.success(results);
    } catch (error) {
      this.logger.error('Error executing scheduled tasks:', error);
      return Result.failure(new Error(`Failed to execute scheduled tasks: ${error}`));
    }
  }

  async emergencyStop(): Promise<Result<string[]>> {
    try {
      this.logger.warn('Executing emergency stop - turning off all devices');

      const results: string[] = [];
      const errors: string[] = [];

      const lightDevices = ['light_001'];
      for (const deviceId of lightDevices) {
        try {
          const result = await this.controlDeviceUseCase.controlLight({
            deviceId,
            action: 'off'
          });

          if (result.isSuccess()) {
            results.push(`Light ${deviceId} turned off`);
          } else {
            errors.push(`Failed to turn off light ${deviceId}: ${result.error}`);
          }
        } catch (error) {
          errors.push(`Error turning off light ${deviceId}: ${error}`);
        }
      }

      // エアコン制御は現在サポートされていません
      // const airconDevices = ['aircon_001'];
      // for (const deviceId of airconDevices) {
      //   try {
      //     const result = await this.controlDeviceUseCase.controlAircon({
      //       deviceId,
      //       action: 'off'
      //     });

      //     if (result.isSuccess()) {
      //       results.push(`Aircon ${deviceId} turned off`);
      //     } else {
      //       errors.push(`Failed to turn off aircon ${deviceId}: ${result.error}`);
      //     }
      //   } catch (error) {
      //     errors.push(`Error turning off aircon ${deviceId}: ${error}`);
      //   }
      // }

      if (errors.length > 0) {
        this.logger.error('Emergency stop completed with errors:', errors);
      }

      this.logger.info(
        `Emergency stop completed: ${results.length} devices turned off, ${errors.length} errors`
      );

      return Result.success(results);
    } catch (error) {
      this.logger.error('Error during emergency stop:', error);
      return Result.failure(new Error(`Emergency stop failed: ${error}`));
    }
  }

  async getAutomationStatus(): Promise<Result<{ activeSchedules: number; lastExecution?: Date }>> {
    try {
      const schedulesResult = await this.manageScheduleUseCase.getActiveSchedules();

      if (!schedulesResult.isSuccess()) {
        return Result.failure(
          new Error(`Failed to get automation status: ${schedulesResult.error}`)
        );
      }

      const schedules = schedulesResult.data!;
      const lastExecution = schedules
        .map(s => s.lastExecuted)
        .filter(Boolean)
        .sort((a, b) => b!.getTime() - a!.getTime())[0];

      return Result.success({
        activeSchedules: schedules.length,
        lastExecution
      });
    } catch (error) {
      this.logger.error('Error getting automation status:', error);
      return Result.failure(new Error(`Failed to get automation status: ${error}`));
    }
  }

  private isLightDevice(deviceId: string): boolean {
    return deviceId.startsWith('light_');
  }

  private isAirconDevice(deviceId: string): boolean {
    return deviceId.startsWith('aircon_');
  }
}
