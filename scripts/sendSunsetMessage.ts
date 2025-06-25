import axios from 'axios';
import * as SunCalc from 'suncalc';
import * as cron from 'node-cron';

const latitude = 35.6895; // 東京
const longitude = 139.6917;
const userId = 'あなたのLINEのユーザーID'; // 1:1 botの場合
const accessToken = 'チャネルアクセストークン';

// 本日の日の入り時刻を JST で取得
const now = new Date();
const sunsetUTC = SunCalc.getTimes(now, latitude, longitude).sunset;
const sunsetJST = new Date(sunsetUTC.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

// 秒を無視して、分単位で一致をチェック
const sunsetHour = sunsetJST.getHours();
const sunsetMinute = sunsetJST.getMinutes();

console.log(`本日の日の入り時刻（JST）：${sunsetHour}:${sunsetMinute}`);

// 毎分チェック
cron.schedule('* * * * *', async () => {
    const nowJST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const currentHour = nowJST.getHours();
    const currentMinute = nowJST.getMinutes();

    if (currentHour === sunsetHour && currentMinute === sunsetMinute) {
        console.log('🌇 日の入り時刻になりました！LINEに送信します');
        await sendLineMessage("🌇 本日の日の入り時刻になりました！");
    }
});

async function sendLineMessage(message: string) {
    try {
        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: userId,
            messages: [{ type: 'text', text: message }],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
    } catch (error) {
        console.error("LINE送信エラー：", error);
    }
}