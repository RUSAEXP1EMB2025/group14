import { Client, MessageEvent, TextMessage } from '@line/bot-sdk';
import { logger } from '../utils/logger';

export async function handleMessage(
  event: MessageEvent,
  client: Client
): Promise<void> {
  const { replyToken, message } = event;

  // テキストメッセージの場合
  if (message.type === 'text') {
    const textMessage = message as TextMessage;
    const userText = textMessage.text;

    logger.info(`受信メッセージ: "${userText}"`);

    // 簡単な応答ロジック
    let replyText = '';

    if (userText.includes('こんにちは') || userText.includes('おはよう')) {
      replyText = 'こんにちは！元気ですか？😊';
    } else if (userText.includes('ありがとう')) {
      replyText = 'どういたしまして！いつでもお声かけください🙌';
    } else if (userText.includes('天気')) {
      replyText = '今日の天気は調べられませんが、素敵な一日になりますように☀';
    } else {
      replyText = `「${userText}」と言われましたね！何かお手伝いできることはありますか？`;
    }

    try {
      await client.replyMessage(replyToken, {
        type: 'text',
        text: replyText,
      });
      logger.info(`返信送信完了: "${replyText}"`);
    } catch (error) {
      logger.error('返信送信エラー:', error);
    }
  } else {
    logger.info(`テキスト以外のメッセージ: ${message.type}`);

    // テキスト以外のメッセージへの応答
    await client.replyMessage(replyToken, {
      type: 'text',
      text: 'テキストメッセージを送信してください！',
    });
  }
}
