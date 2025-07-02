import type { MessageEvent, TextMessage } from '@line/bot-sdk';
import { LineService } from '../services/LineService.ts';
import { NatureRemoService } from '../services/NatureRemoService.ts';
import { logger } from '../utils/logger.ts';

export class MessageHandler {
  private lineService: LineService;
  private remoService: NatureRemoService;

  constructor(lineService: LineService, remoService: NatureRemoService) {
    this.lineService = lineService;
    this.remoService = remoService;
  }

  async handleMessage(event: MessageEvent): Promise<void> {
    const { replyToken, message } = event;

    if (message.type !== 'text') {
      await this.lineService.replyMessage(replyToken, 'テキストメッセージを送信してください！');
      return;
    }

    const textMessage = message as TextMessage;
    const userText = textMessage.text;
    logger.info(`受信メッセージ: "${userText}"`);

    try {
      // 確認応答の処理
      if (userText.includes(':')) {
        await this.handleConfirmationResponse(replyToken, userText);
        return;
      }

      // デバッグコマンドの処理
      if (await this.handleDebugCommands(replyToken, userText)) {
        return;
      }

      // 手動操作コマンドの処理
      if (await this.handleManualControl(replyToken, userText)) {
        return;
      }

      // 通常の会話応答
      await this.handleConversation(replyToken, userText);
    } catch (error) {
      logger.error('メッセージ処理エラー:', error);
      await this.lineService.replyMessage(
        replyToken,
        'エラーが発生しました。しばらく時間をおいて再度お試しください。'
      );
    }
  }

  private async handleDebugCommands(replyToken: string, userText: string): Promise<boolean> {
    const lowerText = userText.toLowerCase();

    // 接続テスト
    if (lowerText.includes('接続テスト') || lowerText.includes('connection test')) {
      const result = await this.remoService.testConnection();
      const message = result.success
        ? '✅ Nature Remo API接続成功！'
        : `❌ Nature Remo API接続失敗：${result.error}`;
      await this.lineService.replyMessage(replyToken, message);
      return true;
    }

    // デバイス一覧
    if (lowerText.includes('デバイス一覧') || lowerText.includes('device list')) {
      try {
        const { devices, appliances } = await this.remoService.listDevicesAndAppliances();
        let message = '📱 登録済みデバイス・家電一覧：\n\n';

        if (devices.length > 0) {
          message += '🔌 デバイス：\n';
          devices.forEach((device, index) => {
            message += `${index + 1}. ${device.name || 'Unknown'} (${device.id})\n`;
          });
          message += '\n';
        }

        if (appliances.length > 0) {
          message += '🏠 家電：\n';
          appliances.forEach((appliance, index) => {
            message += `${index + 1}. ${appliance.nickname || 'Unknown'} (${appliance.type}) - ${appliance.id}\n`;
          });
        }

        if (devices.length === 0 && appliances.length === 0) {
          message += '登録済みのデバイス・家電が見つかりません。';
        }

        await this.lineService.replyMessage(replyToken, message);
      } catch (error) {
        await this.lineService.replyMessage(
          replyToken,
          `デバイス一覧取得エラー: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
      return true;
    }

    // 照明ボタン一覧
    if (lowerText.includes('照明ボタン') || lowerText.includes('light buttons')) {
      try {
        const { appliances } = await this.remoService.listDevicesAndAppliances();
        const lightAppliance = appliances.find(app => app.type === 'LIGHT');

        if (!lightAppliance) {
          await this.lineService.replyMessage(replyToken, '照明が登録されていません。');
          return true;
        }

        // 照明の詳細とボタン一覧を取得する処理をここに追加
        await this.lineService.replyMessage(
          replyToken,
          `照明が見つかりました: ${lightAppliance.nickname} (${lightAppliance.id})`
        );
      } catch (error) {
        await this.lineService.replyMessage(
          replyToken,
          `照明ボタン取得エラー: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
      return true;
    }

    return false;
  }

  private async handleConfirmationResponse(replyToken: string, userText: string): Promise<void> {
    const [actionType, response] = userText.split(':');

    if (response === 'yes') {
      switch (actionType) {
        case 'sleep-light':
          await this.remoService.controlLight('off');
          await this.lineService.replyMessage(replyToken, '照明を消しました。おやすみなさい🌙');
          break;
        case 'sunset-light':
          await this.remoService.controlLight('on');
          await this.lineService.replyMessage(replyToken, '照明をつけました💡');
          break;
        case 'wakeup-confirm':
          await this.remoService.controlLight('off');
          await this.lineService.replyMessage(replyToken, 'おはようございます！照明を消しました☀');
          break;
        default:
          await this.lineService.replyMessage(replyToken, '不明な操作です');
      }
    } else {
      await this.lineService.replyMessage(replyToken, 'キャンセルしました');
    }
  }

  private async handleManualControl(replyToken: string, userText: string): Promise<boolean> {
    const lowerText = userText.toLowerCase();

    // 照明制御
    if (lowerText.includes('照明') || lowerText.includes('ライト')) {
      if (lowerText.includes('つけ') || lowerText.includes('オン')) {
        await this.remoService.controlLight('on');
        await this.lineService.replyMessage(replyToken, '照明をつけました💡');
        return true;
      }
      if (lowerText.includes('消し') || lowerText.includes('オフ')) {
        await this.remoService.controlLight('off');
        await this.lineService.replyMessage(replyToken, '照明を消しました');
        return true;
      }
    }

    // エアコン制御
    if (lowerText.includes('エアコン') || lowerText.includes('冷房')) {
      if (lowerText.includes('つけ') || lowerText.includes('オン')) {
        await this.remoService.controlAircon('on', 24);
        await this.lineService.replyMessage(replyToken, 'エアコンをつけました❄');
        return true;
      }
      if (lowerText.includes('消し') || lowerText.includes('オフ')) {
        await this.remoService.controlAircon('off');
        await this.lineService.replyMessage(replyToken, 'エアコンを消しました');
        return true;
      }
    }

    // センサー情報取得
    if (lowerText.includes('温度') || lowerText.includes('センサー')) {
      try {
        const sensorData = await this.remoService.getSensorData();
        const statusText = `現在の室内環境：
温度: ${sensorData.temperature}°C
湿度: ${sensorData.humidity}%
照度: ${sensorData.illuminance}`;
        await this.lineService.replyMessage(replyToken, statusText);
        return true;
      } catch (error) {
        await this.lineService.replyMessage(
          replyToken,
          `センサーデータ取得エラー: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        return true;
      }
    }

    return false;
  }

  private async handleConversation(replyToken: string, userText: string): Promise<void> {
    let replyText = '';

    if (userText.includes('こんにちは') || userText.includes('おはよう')) {
      replyText =
        'こんにちは！元気ですか？😊\n\n利用可能なコマンド：\n・照明つけて/消して\n・エアコンつけて/消して\n・温度\n・接続テスト\n・デバイス一覧';
    } else if (userText.includes('ありがとう')) {
      replyText = 'どういたしまして！いつでもお声かけください🙌';
    } else if (userText.includes('天気')) {
      replyText = '今日の天気は調べられませんが、素敵な一日になりますように☀';
    } else {
      replyText = `「${userText}」と言われましたね！何かお手伝いできることはありますか？\n\n📱 使い方：\n・照明つけて/消して\n・エアコンつけて/消して\n・温度（センサー情報）\n・接続テスト\n・デバイス一覧`;
    }

    await this.lineService.replyMessage(replyToken, replyText);
  }
}
