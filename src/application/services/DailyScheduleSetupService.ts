import { ManageScheduleUseCase } from '../usecases/ManageScheduleUseCase.ts';
import type { CreateScheduleRequest } from '../usecases/ManageScheduleUseCase.ts';
import type { ScheduleId } from '../../domain/entities/Schedule.ts';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory.ts';
import type { ILogger } from '../../core/interfaces/ILogger.ts';
import type { LineNotificationTaskExecutor } from '../../infrastructure/scheduler/executors/LineNotificationTaskExecutor.ts';
import type { ScheduleExecutionContext } from '../../infrastructure/scheduler/ScheduleExecutionEngine.ts';
import * as SunCalc from 'suncalc';
import * as cron from 'node-cron';

interface LocationData {
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

async function getCurrentLocation(): Promise<LocationData> {
  try {
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

    return {
      latitude: data.lat,
      longitude: data.lon,
      city: data.city,
      country: data.country
    };
  } catch (_error) {
    return {
      latitude: 35.6895,
      longitude: 139.6917,
      city: 'Tokyo',
      country: 'Japan'
    };
  }
}

async function calculateSunsetTime(
  date: Date = new Date()
): Promise<{ sunset: Date; location: LocationData }> {
  const location = await getCurrentLocation();
  const times = SunCalc.getTimes(date, location.latitude, location.longitude);

  return {
    sunset: times.sunset,
    location
  };
}

export class DailyScheduleSetupService {
  private readonly logger: ILogger;
  private dailySetupCronJob?: cron.ScheduledTask;
  private sunsetCronJob?: cron.ScheduledTask;
  private lastSetupDate = '';
  private lineNotificationExecutor?: LineNotificationTaskExecutor;

  constructor(
    private readonly manageScheduleUseCase: ManageScheduleUseCase,
    lineNotificationExecutor?: LineNotificationTaskExecutor
  ) {
    this.logger = LoggerFactory.create('DailyScheduleSetupService');
    this.lineNotificationExecutor = lineNotificationExecutor;
  }

  start(): void {
    this.logger.info('🌅 Starting daily schedule setup service');

    this.setupTodaySchedule();

    this.scheduleDailySetup();
  }

  stop(): void {
    if (this.dailySetupCronJob) {
      this.dailySetupCronJob.stop();
      this.dailySetupCronJob = undefined;
      this.logger.info('🛑 Daily schedule setup service stopped');
    }
    
    if (this.sunsetCronJob) {
      this.sunsetCronJob.stop();
      this.sunsetCronJob = undefined;
      this.logger.info('🛑 Sunset notification cron stopped');
    }
  }

  private async setupTodaySchedule(): Promise<void> {
    try {
      const now = new Date();
      const sunsetResult = await calculateSunsetTime(now);

      if (now > sunsetResult.sunset) {
        this.logger.info("🌆 Today's sunset has passed, setting up tomorrow's schedule");
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        await this.setupScheduleForDate(tomorrow);
      } else {
        this.logger.info("🌅 Setting up today's sunset schedule");
        await this.setupScheduleForDate(now);
      }
    } catch (error) {
      this.logger.error("❌ Failed to setup today's schedule:", error);
    }
  }

  private scheduleDailySetup(): void {
    this.dailySetupCronJob = cron.schedule('0 8 * * *', () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0] ?? '';
      
      if (this.lastSetupDate === today) {
        this.logger.debug(`🔄 Daily setup already completed for ${today}, skipping`);
        return;
      }
      
      this.logger.info(`🌅 Morning schedule setup time reached for ${today}`);
      this.lastSetupDate = today;
      this.setupTodaySchedule();
    }, {
      timezone: 'Asia/Tokyo'
    });

    this.logger.info('⏰ Scheduled daily setup at 8:00 AM JST using cron');
  }

  private async setupScheduleForDate(date: Date): Promise<void> {
    try {
      const sunsetResult = await calculateSunsetTime(date);
      const sunset = sunsetResult.sunset;
      const location = sunsetResult.location;

      this.logger.info(
        `🌇 Calculated sunset time: ${sunset.toLocaleString()} for ${date.toDateString()}`
      );
      this.logger.info(
        `📍 Location: ${location.city}, ${location.country} (${location.latitude.toFixed(4)}°, ${location.longitude.toFixed(4)}°)`
      );

      if (this.sunsetCronJob) {
        this.sunsetCronJob.stop();
        this.sunsetCronJob = undefined;
        this.logger.info('🔄 Stopped previous sunset cron job');
      }

      const sunsetHour = sunset.getHours();
      const sunsetMinute = sunset.getMinutes();
      const cronExpression = `${sunsetMinute} ${sunsetHour} * * *`;

      this.logger.info(
        `⏰ Setting up sunset notification cron: "${cronExpression}" (${sunsetHour}:${sunsetMinute.toString().padStart(2, '0')})`
      );

      this.sunsetCronJob = cron.schedule(cronExpression, async () => {
        this.logger.info('🌅 Sunset time reached! Sending LINE notification');
        
        try {
          await this.sendSunsetNotification(location);
        } catch (error) {
          this.logger.error('❌ Failed to send sunset notification:', error);
        }
      }, {
        timezone: 'Asia/Tokyo'
      });

      this.logger.info('✅ Sunset notification cron job created successfully');

      if (process.env.NODE_ENV === 'development') {
        this.logger.debug('🧪 Development mode: Also creating traditional schedule for comparison');
        await this.createTraditionalSchedule(date, sunset, location);
      }

    } catch (error) {
      this.logger.error(`❌ Error setting up schedule for ${date.toDateString()}:`, error);
    }
  }

  private async sendSunsetNotification(location: LocationData): Promise<void> {
    if (this.lineNotificationExecutor) {
      try {
        this.logger.info('🚀 Sending sunset notification via LineNotificationTaskExecutor');
        
        await this.lineNotificationExecutor.sendTestMessage(
          `日が暮れてきました（${location.city}）。電気を点けますか？`
        );
        
        this.logger.info('✅ Sunset notification sent successfully via direct cron!');
      } catch (error) {
        this.logger.error('❌ Failed to send sunset notification:', error);
      }
    } else {
      this.logger.warn('⚠️ LineNotificationTaskExecutor not available, notification not sent');
    }
  }

  private async createTraditionalSchedule(date: Date, sunset: Date, location: LocationData): Promise<void> {
    const scheduleIdValue = `sunset_notification_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`;

    const scheduleRequest: CreateScheduleRequest = {
      name: scheduleIdValue,
      config: {
        type: 'once',
        executionTime: sunset
      },
      action: {
        type: 'line_notification',
        target: 'user',
        parameters: {
          message: `🧪 [TRADITIONAL] 日が暮れてきました（${location.city}）。電気を点けますか？`,
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: '💡 点灯する',
                  data: 'action=turn_on_lights&reason=sunset'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'postback',
                  label: '❌ 必要なし',
                  data: 'action=decline&reason=sunset'
                }
              }
            ]
          }
        }
      }
    };

    const result = await this.manageScheduleUseCase.createSchedule(scheduleRequest);
    if (result.isSuccess()) {
      this.logger.debug(
        `🧪 Traditional schedule created: ${scheduleIdValue} at ${sunset.toLocaleString()}`
      );
    } else {
      this.logger.error(`❌ Failed to create traditional schedule: ${result.getError().message}`);
    }
  }

  async createDebugSchedule(minutesFromNow = 1): Promise<void> {
    try {
      const now = new Date();
      const executeAt = new Date(now.getTime() + minutesFromNow * 60 * 1000);
      const scheduleIdValue = `debug_sunset_${Date.now()}`;

      const location = await getCurrentLocation();

      const scheduleRequest: CreateScheduleRequest = {
        name: scheduleIdValue,
        config: {
          type: 'once',
          executionTime: executeAt
        },
        action: {
          type: 'line_notification',
          target: 'user',
          parameters: {
            message: `🧪 [DEBUG] 日が暮れてきました（${location.city}）。電気を点けますか？`,
            quickReply: {
              items: [
                {
                  type: 'action',
                  action: {
                    type: 'postback',
                    label: '💡 点灯する',
                    data: 'action=turn_on_lights&reason=sunset'
                  }
                },
                {
                  type: 'action',
                  action: {
                    type: 'postback',
                    label: '❌ 必要なし',
                    data: 'action=decline&reason=sunset'
                  }
                }
              ]
            }
          }
        }
      };

      const result = await this.manageScheduleUseCase.createSchedule(scheduleRequest);
      if (result.isSuccess()) {
        this.logger.info(
          `🧪 Debug schedule created: ${scheduleIdValue} at ${executeAt.toLocaleString()}`
        );
      } else {
        this.logger.error(`❌ Failed to create debug schedule: ${result.getError().message}`);
      }
    } catch (error) {
      this.logger.error('❌ Error creating debug schedule:', error);
    }
  }
}
