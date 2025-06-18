// scripts/get-temperature.ts
import { createConfiguration, DefaultApi } from '../src/api/generated/index.ts';
import type { DeviceResponse, DeviceResponseNewestEventsValue } from '../src/api/generated/index.ts';

async function getCurrentTemperature(): Promise<void> {
  try {
    const accessToken = process.env.NATURE_REMO_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('NATURE_REMO_TOKEN環境変数が設定されていません');
    }

    console.log('🔍 APIクライアントを初期化中...');

    // 正しい認証設定：oauth2を使用
    const configuration = createConfiguration({
      authMethods: {
        oauth2: {
          accessToken: accessToken
        }
      }
    });

    const api = new DefaultApi(configuration);

    console.log('🔍 デバイス情報を取得中...');
    const devices = await api._1devicesGet() as DeviceResponse[];

    if (!devices || devices.length === 0) {
      throw new Error('デバイスが見つかりませんでした');
    }

    const device = devices[0];
    console.log(`📱 デバイス: ${device.name || device.id}`);

    // newestEventsの型は { [key: string]: DeviceResponseNewestEventsValue; }
    const events = device.newestEvents;
    if (!events) {
      throw new Error('センサーデータが見つかりませんでした');
    }

    console.log('\n📊 現在のセンサーデータ:');
    
    // 温度 (te)
    if (events.te) {
      console.log(`🌡️  温度: ${events.te.val}°C`);
      if (events.te.createdAt) {
        console.log(`   更新時刻: ${new Date(events.te.createdAt).toLocaleString('ja-JP')}`);
      }
    }

    // 湿度 (hu)
    if (events.hu) {
      console.log(`💧 湿度: ${events.hu.val}%`);
      if (events.hu.createdAt) {
        console.log(`   更新時刻: ${new Date(events.hu.createdAt).toLocaleString('ja-JP')}`);
      }
    }

    // 照度 (il)
    if (events.il) {
      console.log(`💡 照度: ${events.il.val}lx`);
      if (events.il.createdAt) {
        console.log(`   更新時刻: ${new Date(events.il.createdAt).toLocaleString('ja-JP')}`);
      }
    }

    // 動体検知 (mo)
    if (events.mo) {
      console.log(`🚶 動体検知: ${events.mo.val === 1 ? '検知あり' : 'なし'}`);
      if (events.mo.createdAt) {
        console.log(`   更新時刻: ${new Date(events.mo.createdAt).toLocaleString('ja-JP')}`);
      }
    }

    // 温度のみを強調表示
    const temperature = events.te?.val;
    if (temperature !== undefined) {
      console.log(`\n🎯 現在の温度: ${temperature}°C`);
    } else {
      throw new Error('温度データが取得できませんでした');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
if (import.meta.main) {
  getCurrentTemperature();
}