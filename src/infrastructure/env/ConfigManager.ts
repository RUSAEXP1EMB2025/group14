import { Result } from '../../core/base/Result.ts';

export interface AppConfig {
  readonly port: number;
  readonly nodeEnv: 'development' | 'production' | 'test';
  readonly line: {
    readonly channelAccessToken: string;
    readonly channelSecret: string;
  };
  readonly natureRemo: {
    readonly accessToken: string;
  };
  readonly ngrok?: {
    readonly authToken: string;
  };
  readonly google?: {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly redirectUri: string;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig | null = null;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 設定を初期化
   */
  initialize(): Result<AppConfig, Error> {
    try {
      const config: AppConfig = {
        port: Number.parseInt(process.env.PORT || '3000', 10),
        nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',

        line: {
          channelAccessToken: this.getRequiredEnv('LINE_CHANNEL_ACCESS_TOKEN'),
          channelSecret: this.getRequiredEnv('LINE_CHANNEL_SECRET')
        },

        natureRemo: {
          accessToken: this.getRequiredEnv('NATURE_REMO_ACCESS_TOKEN')
        },

        ngrok: process.env.NGROK_AUTHTOKEN
          ? {
              authToken: process.env.NGROK_AUTHTOKEN
            }
          : undefined,

        google: process.env.GOOGLE_CLIENT_ID
          ? {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: this.getRequiredEnv('GOOGLE_CLIENT_SECRET'),
              redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost'
            }
          : undefined
      };

      this.config = config;
      return Result.success(config);
    } catch (error) {
      return Result.failure(error as Error);
    }
  }

  /**
   * 設定を取得
   */
  getConfig(): AppConfig {
    if (!this.config) {
      const result = this.initialize();
      if (result.isFailure()) {
        throw result.getError();
      }
      this.config = result.getValue();
    }
    return this.config;
  }

  /**
   * 特定の設定値を取得
   */
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.getConfig()[key];
  }

  /**
   * 必須環境変数を取得
   */
  private getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`環境変数 ${key} が設定されていません`);
    }
    return value;
  }

  /**
   * オプション環境変数を取得
   */
  private getOptionalEnv(key: string, defaultValue: string): string {
    return process.env[key] ?? defaultValue;
  }

  /**
   * 開発環境かどうかを判定
   */
  isDevelopment(): boolean {
    return this.get('nodeEnv') === 'development';
  }

  /**
   * 本番環境かどうかを判定
   */
  isProduction(): boolean {
    return this.get('nodeEnv') === 'production';
  }

  /**
   * テスト環境かどうかを判定
   */
  isTest(): boolean {
    return this.get('nodeEnv') === 'test';
  }
}

// シングルトンインスタンスをエクスポート
export const configManager = ConfigManager.getInstance();

// 後方互換性のためのヘルパー関数
export function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません`);
  }
  return value;
}

export function getEnvVarWithDefault(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}
