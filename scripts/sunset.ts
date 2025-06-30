import * as SunCalc from 'suncalc';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

async function getCurrentLocation(): Promise<LocationData> {
  try {
    console.log('🌍 現在地を取得中...');
    
    const response = await fetch('http://ip-api.com/json/?fields=status,message,country,city,lat,lon');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'fail') {
      throw new Error(`Location API error: ${data.message}`);
    }
    
    return {
      latitude: data.lat,
      longitude: data.lon,
      city: data.city,
      country: data.country
    };
  } catch (error) {
    console.warn('⚠️  現在地の自動取得に失敗しました。東京の座標を使用します。');
    console.warn('エラー:', error instanceof Error ? error.message : error);
    
    // フォールバック：東京の座標
    return {
      latitude: 35.6895,
      longitude: 139.6917,
      city: 'Tokyo',
      country: 'Japan'
    };
  }
}

async function getSunsetTime(): Promise<void> {
  try {
    const location = await getCurrentLocation();
    
    console.log(`📍 位置情報: ${location.city}, ${location.country}`);
    console.log(`📐 座標: 緯度 ${location.latitude.toFixed(4)}°, 経度 ${location.longitude.toFixed(4)}°`);
    
    const now = new Date();
    console.log(`📅 日付: ${now.toLocaleDateString('ja-JP')}`);
    
    console.log('🌅 日の入り時刻を計算中...');
    const times = SunCalc.getTimes(now, location.latitude, location.longitude);
    const sunset = times.sunset;
    
    // 日本時間で表示
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Tokyo',
    };
    
    console.log('\n🌇 結果:');
    console.log(`本日の日の入り時刻：${sunset.toLocaleTimeString('ja-JP', options)}`);
    
    const sunrise = times.sunrise;
    console.log(`参考 - 本日の日の出時刻：${sunrise.toLocaleTimeString('ja-JP', options)}`);
    
    const now_time = new Date();
    const timeDiff = sunset.getTime() - now_time.getTime();
    const hoursUntilSunset = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesUntilSunset = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (timeDiff > 0) {
      console.log(`⏰ 日の入りまで：あと ${hoursUntilSunset}時間 ${minutesUntilSunset}分`);
    } else {
      console.log('🌙 既に日が沈んでいます');
    }
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
if (import.meta.main) {
  getSunsetTime();
}