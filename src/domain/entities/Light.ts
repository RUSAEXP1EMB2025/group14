import { Device } from './Device.ts';
import type { DeviceId, DeviceName, DeviceStatus } from './Device.ts';

export interface LightSettings {
  readonly brightness: number;
  readonly color?: string;
  readonly temperature?: number;
}

export class Light extends Device {
  constructor(
    id: DeviceId,
    name: DeviceName,
    status: DeviceStatus,
    public readonly settings: LightSettings,
    public readonly isOn: boolean = false,
    capabilities: ReadonlyArray<string> = ['power', 'brightness']
  ) {
    super(id, name, 'light', status, capabilities);
    this.validateLightSettings();
  }

  private validateLightSettings(): void {
    if (this.settings.brightness < 0 || this.settings.brightness > 100) {
      throw new Error('Light brightness must be between 0 and 100');
    }
    if (
      this.settings.temperature &&
      (this.settings.temperature < 1000 || this.settings.temperature > 10000)
    ) {
      throw new Error('Color temperature must be between 1000K and 10000K');
    }
  }

  toggle(): Light {
    return new Light(this.id, this.name, this.status, this.settings, !this.isOn, this.capabilities);
  }

  setBrightness(brightness: number): Light {
    if (brightness < 0 || brightness > 100) {
      throw new Error('Brightness must be between 0 and 100');
    }

    return new Light(
      this.id,
      this.name,
      this.status,
      { ...this.settings, brightness },
      this.isOn,
      this.capabilities
    );
  }

  setColorTemperature(temperature: number): Light {
    if (!this.hasCapability('color_temperature')) {
      throw new Error('This light does not support color temperature control');
    }

    return new Light(
      this.id,
      this.name,
      this.status,
      { ...this.settings, temperature },
      this.isOn,
      this.capabilities
    );
  }

  setColor(color: string): Light {
    if (!this.hasCapability('color')) {
      throw new Error('This light does not support color control');
    }

    return new Light(
      this.id,
      this.name,
      this.status,
      { ...this.settings, color },
      this.isOn,
      this.capabilities
    );
  }

  isLightOn(): boolean {
    return this.isOn && this.isOnline();
  }
}
