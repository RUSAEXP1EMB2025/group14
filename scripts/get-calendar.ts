// scripts/get-calender.ts
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale('ja');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch {
    return null;
  }
}

async function saveCredentials(client: any) {
  const credentials = JSON.parse(await fs.promises.readFile(CREDENTIALS_PATH, 'utf-8'));
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: credentials.installed.client_id,
    client_secret: credentials.installed.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.promises.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) return client;

  const credentials = JSON.parse(await fs.promises.readFile(CREDENTIALS_PATH, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('🔑 以下のURLをブラウザで開き、コードを貼り付けてください:');
  console.log(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise<string>(resolve => rl.question('📥 認証コード: ', ans => {
    rl.close(); resolve(ans);
  }));

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  await saveCredentials(oAuth2Client);
  return oAuth2Client;
}

async function listEvents(auth: any) {
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
      orderBy: 'startTime',
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('📭 今週の予定はありません');
      return;
    }

    console.log('🗓 今週の予定:');
    for (const event of events) {
      const start = event.start?.dateTime || event.start?.date;
      let date;
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
