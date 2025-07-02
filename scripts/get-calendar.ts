// scripts/get-calendar.ts
import { google, Auth } from 'googleapis';
import * as fs from 'fs';
import * as readline from 'readline';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale('ja');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

async function loadSavedCredentialsIfExist(): Promise<Auth.OAuth2Client | null> {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as Auth.OAuth2Client;
  } catch {
    return null;
  }
}

async function saveCredentials(client: Auth.OAuth2Client): Promise<void> {
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: client.credentials.refresh_token
  });
  await fs.promises.writeFile(TOKEN_PATH, payload);
}

async function authorize(): Promise<Auth.OAuth2Client> {
  const client = await loadSavedCredentialsIfExist();
  if (client) return client;

  // 環境変数から認証情報を取得
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'urn:ietf:wg:oauth:2.0:oob';

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID と GOOGLE_CLIENT_SECRET を .env ファイルに設定してください');
  }

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('🔑 以下のURLをブラウザで開き、コードを貼り付けてください:');
  console.log(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise<string>(resolve =>
    rl.question('📥 認証コード: ', ans => {
      rl.close();
      resolve(ans);
    })
  );

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  await saveCredentials(oAuth2Client);
  return oAuth2Client;
}

async function listEvents(auth: Auth.OAuth2Client): Promise<void> {
  const calendar = google.calendar({ version: 'v3', auth });
  const now = dayjs();
  const endOfWeek = now.endOf('week');

  try {
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: endOfWeek.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('📭 今週の予定はありません');
      return;
    }

    console.log('🗓 今週の予定:');
    for (const event of events) {
      const start = event.start?.dateTime || event.start?.date;
      let date: string;
      if (event.start?.dateTime) {
        date = dayjs(start).format('YYYY/MM/DD HH:mm');
      } else {
        date = dayjs(start).format('YYYY/MM/DD');
      }
      console.log(`[${date}] ${event.summary}`);
    }
  } catch (err) {
    console.error('Google Calendar APIの呼び出しでエラーが発生しました:', err);
  }
}

authorize().then(listEvents).catch(console.error);
