/**
 * Sensor Entity - センサーデバイスに特化したエンティティ
 */

import { Device } from './Device.ts';
import type { DeviceId, DeviceName, DeviceStatus } from './Device.ts';

export interface SensorReading {
  readonly value: number;
  readonly unit: string;
  readonly timestamp: Date;
  readonly accuracy?: number; // Accuracy in percentage
}

export interface SensorReadings {
  readonly temperature?: SensorReading;
  readonly humidity?: SensorReading;
  readonly pressure?: SensorReading;
  readonly illuminance?: SensorReading;
  readonly motion?: SensorReading;
}

export class Sensor extends Device {
  constructor(
    id: DeviceId,
    name: DeviceName,
    status: DeviceStatus,
    public readonly readings: SensorReadings,
    public readonly sensorTypes: ReadonlyArray<string> = [],
    capabilities: ReadonlyArray<string> = ['temperature', 'humidity']
  ) {
    super(id, name, 'sensor', status, capabilities);
  }

  /**
   * 指定されたセンサータイプの読み取り値を取得
   */
  getReading(sensorType: keyof SensorReadings): SensorReading | undefined {
    return this.readings[sensorType];
  }

  /**
   * 温度を取得
   */
  getTemperature(): number | undefined {
    return this.readings.temperature?.value;
  }

  /**
   * 湿度を取得
   */
  getHumidity(): number | undefined {
    return this.readings.humidity?.value;
  }

  /**
   * 気圧を取得
   */
  getPressure(): number | undefined {
    return this.readings.pressure?.value;
  }

  /**
   * 照度を取得
   */
  getIlluminance(): number | undefined {
    return this.readings.illuminance?.value;
  }

  /**
   * 動きを検知しているかどうか
   */
  isMotionDetected(): boolean {
    const motionReading = this.readings.motion;
    return motionReading ? motionReading.value > 0 : false;
  }

  /**
   * センサーの読み取り値を更新
   */
  updateReadings(newReadings: Partial<SensorReadings>): Sensor {
    return new Sensor(
      this.id,
      this.name,
      this.updateStatus({ lastUpdated: new Date() }).status,
      { ...this.readings, ...newReadings },
      this.sensorTypes,
      this.capabilities
    );
  }

  /**
   * 指定されたセンサータイプをサポートしているかどうか
   */
  supportsSensorType(sensorType: string): boolean {
    return this.sensorTypes.includes(sensorType);
  }

  /**
   * 最新の読み取り時刻を取得
   */
  getLatestReadingTime(): Date | undefined {
    const readings = Object.values(this.readings).filter(Boolean);
    if (readings.length === 0) return undefined;

    return readings.reduce(
      (latest, reading) => (reading.timestamp > latest ? reading.timestamp : latest),
      readings[0].timestamp
    );
  }

  /**
   * データが古すぎるかどうかを判定
   */
  isDataStale(maxAgeMinutes = 30): boolean {
    const latestTime = this.getLatestReadingTime();
    if (!latestTime) return true;

    const now = new Date();
    const ageMinutes = (now.getTime() - latestTime.getTime()) / (1000 * 60);
    return ageMinutes > maxAgeMinutes;
  }
}
