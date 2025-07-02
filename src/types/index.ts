// LINE Bot関連の型定義
export interface LineConfig {
  channelAccessToken: string;
  channelSecret: string;
}

// アプリケーション固有のビジネスロジック型（APIには存在しない）
export interface SensorData {
  temperature: number;
  humidity: number;
  illuminance: number;
  timestamp: Date;
}

export interface DeviceControlRequest {
  deviceType: 'light' | 'aircon';
  action: 'on' | 'off' | 'adjust';
  parameters?: {
    temperature?: number;
    brightness?: number;
  };
}

// 型エイリアス（必要に応じて）
export type { ApplianceResponse as NatureRemoAppliance } from '../api/generated/index.ts';
export type { DeviceResponse as NatureRemoDevice } from '../api/generated/index.ts';
