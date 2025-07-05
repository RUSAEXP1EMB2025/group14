import { Result } from '../../core/base/Result.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { DeviceControlService } from '../services/DeviceControlService.ts';
import type { DeviceControlResult } from '../services/DeviceControlService.ts';

export interface DeviceControlRequest {
  readonly deviceId: string;
  readonly action: 'on' | 'off' | 'toggle';
  readonly settings?: Record<string, unknown>;
}

export class ControlDeviceUseCase {
  constructor(
    private readonly deviceControlService: DeviceControlService,
    private readonly logger: ILogger
  ) {}

  async controlLight(request: DeviceControlRequest): Promise<Result<DeviceControlResult>> {
    try {
      this.logger.info('Controlling light device', {
        deviceId: request.deviceId,
        action: request.action
      });

      let result: DeviceControlResult;

      switch (request.action) {
        case 'on':
          result = await this.deviceControlService.turnOnLights();
          break;
        case 'off':
          result = await this.deviceControlService.turnOffLights();
          break;
        case 'toggle':
          // For toggle, we'll default to turning off for sleep mode
          result = await this.deviceControlService.turnOffLights();
          break;
        default:
          throw new Error(`Unsupported light action: ${request.action}`);
      }

      if (result.success) {
        this.logger.info('Light control successful', { result });
        return Result.success(result);
      }

      this.logger.error('Light control failed', { result });
      return Result.failure(new Error(result.message));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error('Light control error', { error: errorMessage, request });

      return Result.failure(new Error(errorMessage));
    }
  }
}
