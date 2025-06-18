// LINE Bot関連の型定義
export interface LineConfig {
  channelAccessToken: string;
  channelSecret: string;
}

// Nature Remo関連の型定義
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

export interface NatureRemoDevice {
  id: string;
  name: string;
  nickname: string;
  newest_events?: {
    te?: { val: number; created_at: string };
    hu?: { val: number; created_at: string };
    il?: { val: number; created_at: string };
  };
}

export interface NatureRemoAppliance {
  id: string;
  nickname: string;
  type: 'LIGHT' | 'AC' | string;
  model?: {
    id: string;
    manufacturer: string;
    remote_name: string;
    name: string;
    image: string;
  };
}
