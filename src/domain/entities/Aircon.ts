import { Device } from './Device.ts';
import type { DeviceId, DeviceName, DeviceStatus } from './Device.ts';

export type AirconMode = 'cool' | 'heat' | 'dry' | 'fan' | 'auto';
export type FanSpeed = 'auto' | 'low' | 'medium' | 'high';

export interface AirconSettings {
  readonly temperature: number;
  readonly mode: AirconMode;
  readonly fanSpeed: FanSpeed;
  readonly humidity?: number;
}

export class Aircon extends Device {
  constructor(
    id: DeviceId,
    name: DeviceName,
    status: DeviceStatus,
    public readonly settings: AirconSettings,
    public readonly isOn: boolean = false,
    public readonly currentTemperature?: number,
    public readonly currentHumidity?: number,
    capabilities: ReadonlyArray<string> = ['power', 'temperature', 'mode', 'fan_speed']
  ) {
    super(id, name, 'aircon', status, capabilities);
    this.validateAirconSettings();
  }

  private validateAirconSettings(): void {
    if (this.settings.temperature < 16 || this.settings.temperature > 30) {
      throw new Error('Aircon temperature must be between 16°C and 30°C');
    }
    if (this.settings.humidity && (this.settings.humidity < 0 || this.settings.humidity > 100)) {
      throw new Error('Humidity must be between 0% and 100%');
    }
  }

  toggle(): Aircon {
    return new Aircon(
      this.id,
      this.name,
      this.status,
      this.settings,
      !this.isOn,
      this.currentTemperature,
      this.currentHumidity,
      this.capabilities
    );
  }

  setTemperature(temperature: number): Aircon {
    if (temperature < 16 || temperature > 30) {
      throw new Error('Temperature must be between 16°C and 30°C');
    }

    return new Aircon(
      this.id,
      this.name,
      this.status,
      { ...this.settings, temperature },
      this.isOn,
      this.currentTemperature,
      this.currentHumidity,
      this.capabilities
    );
  }

  setMode(mode: AirconMode): Aircon {
    return new Aircon(
      this.id,
      this.name,
      this.status,
      { ...this.settings, mode },
      this.isOn,
      this.currentTemperature,
      this.currentHumidity,
      this.capabilities
    );
  }

  setFanSpeed(fanSpeed: FanSpeed): Aircon {
    return new Aircon(
      this.id,
      this.name,
      this.status,
      { ...this.settings, fanSpeed },
      this.isOn,
      this.currentTemperature,
      this.currentHumidity,
      this.capabilities
    );
  }

  getTemperatureDifference(): number | null {
    if (!this.currentTemperature) {
      return null;
    }
    return Math.abs(this.settings.temperature - this.currentTemperature);
  }

  isRunning(): boolean {
    return this.isOn && this.isOnline();
  }

  updateEnvironment(temperature?: number, humidity?: number): Aircon {
    return new Aircon(
      this.id,
      this.name,
      this.status,
      this.settings,
      this.isOn,
      temperature ?? this.currentTemperature,
      humidity ?? this.currentHumidity,
      this.capabilities
    );
  }
}
