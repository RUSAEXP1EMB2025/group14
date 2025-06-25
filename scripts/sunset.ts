import * as SunCalc from 'suncalc';

// 東京の緯度・経度（任意の場所に変更可）
const latitude = 35.6895;
const longitude = 139.6917;

// 現在の日付
const now = new Date();

// 日の入り時刻を取得
const times = SunCalc.getTimes(now, latitude, longitude);
const sunset = times.sunset;

// 日本時間で表示
const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tokyo',
};

console.log(`本日の日の入り時刻：${sunset.toLocaleTimeString('ja-JP', options)}`);