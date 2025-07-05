import * as SunCalc from 'suncalc';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory.ts';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface LocationApiResponse {
  status: string;
  message?: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
}

export interface SunsetData {
  sunset: Date;
  location: LocationData;
}

export class SunsetCalculationService {
  private readonly logger: ILogger;

  constructor() {
    this.logger = LoggerFactory.create('SunsetCalculationService');
  }

  /**
   * 現在地の位置情報を取得
   */
  private async getCurrentLocation(): Promise<LocationData> {
    try {
      this.logger.debug('位置情報を取得中...');

      const response = await fetch(
        'http://ip-api.com/json/?fields=status,message,country,city,lat,lon'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as LocationApiResponse;

      if (data.status === 'fail') {
        throw new Error(`Location API error: ${data.message}`);
      }

      const location: LocationData = {
        latitude: data.lat,
        longitude: data.lon,
        city: data.city,
        country: data.country
      };

      this.logger.debug(
        `位置情報取得成功: ${location.city}, ${location.country} (${location.latitude.toFixed(4)}°, ${location.longitude.toFixed(4)}°)`
      );

      return location;
    } catch (error) {
      this.logger.warn('位置情報の取得に失敗、デフォルト位置（大阪）を使用:', error);

      // フォールバック: 大阪の位置情報
      return {
        latitude: 34.6967,
        longitude: 135.5154,
        city: 'Osaka',
        country: 'Japan'
      };
    }
  }

  /**
   * 指定日の日の入り時刻を計算
   */
  async calculateSunsetTime(date: Date = new Date()): Promise<SunsetData> {
    try {
      this.logger.debug(`${date.toLocaleDateString('ja-JP')}の日の入り時刻を計算中...`);

      const location = await this.getCurrentLocation();
      const times = SunCalc.getTimes(date, location.latitude, location.longitude);

      const sunsetData: SunsetData = {
        sunset: times.sunset,
        location
      };

      this.logger.info(
        `🌇 日の入り時刻計算完了: ${times.sunset.toLocaleString('ja-JP')} (${location.city}, ${location.country})`
      );

      return sunsetData;
    } catch (error) {
      this.logger.error('日の入り時刻の計算に失敗:', error);
      throw new Error(
        `日の入り時刻の計算に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * 複数日の日の入り時刻を一括計算
   */
  async calculateSunsetTimesForRange(startDate: Date, days: number): Promise<SunsetData[]> {
    const results: SunsetData[] = [];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      try {
        const sunsetData = await this.calculateSunsetTime(currentDate);
        results.push(sunsetData);
      } catch (error) {
        this.logger.error(
          `${currentDate.toLocaleDateString('ja-JP')}の日の入り時刻計算に失敗:`,
          error
        );
      }
    }

    this.logger.info(`📊 ${days}日間の日の入り時刻計算完了: ${results.length}件成功`);
    return results;
  }

  /**
   * 日の出時刻も含めた太陽の情報を取得
   */
  async getSolarInfo(date: Date = new Date()): Promise<{
    sunrise: Date;
    sunset: Date;
    solarNoon: Date;
    dayLength: number; // 分単位
    location: LocationData;
  }> {
    try {
      const location = await this.getCurrentLocation();
      const times = SunCalc.getTimes(date, location.latitude, location.longitude);

      // 昼の長さを計算（分単位）
      const dayLengthMs = times.sunset.getTime() - times.sunrise.getTime();
      const dayLength = Math.round(dayLengthMs / (1000 * 60));

      return {
        sunrise: times.sunrise,
        sunset: times.sunset,
        solarNoon: times.solarNoon,
        dayLength,
        location
      };
    } catch (error) {
      this.logger.error('太陽情報の取得に失敗:', error);
      throw new Error(
        `太陽情報の取得に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * 指定した時刻が日の入り前後かを判定
   */
  async isSunsetTime(
    checkTime = new Date(),
    marginMinutes = 30
  ): Promise<{
    isSunsetTime: boolean;
    timeUntilSunset: number; // 分単位（負の値は日の入り後を示す）
    sunsetData: SunsetData;
  }> {
    const sunsetData = await this.calculateSunsetTime(checkTime);
    const timeUntilSunsetMs = sunsetData.sunset.getTime() - checkTime.getTime();
    const timeUntilSunset = Math.round(timeUntilSunsetMs / (1000 * 60));

    const isSunsetTime = Math.abs(timeUntilSunset) <= marginMinutes;

    return {
      isSunsetTime,
      timeUntilSunset,
      sunsetData
    };
  }
}
