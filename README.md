# group14
# スマートホーム自動化システム (group14)

LINE Bot と Nature Remo を活用したスマートホーム自動化システムです。Google Calendar連携により、生活リズムに合わせた家電の自動制御を実現します。

## 概要

このシステムは、ユーザーの生活スケジュールに基づいて家電を自動制御し、より快適な住環境を提供します。LINE Bot経由での手動操作も可能で、柔軟な家電制御を実現しています。

## 主な機能

### 🌅 自動化機能
- **睡眠時の制御**: カレンダーから就寝時間を検出し、照明の自動消灯・エアコンの温度調整
- **起床時の制御**: 起床時間に合わせた照明の自動点灯
- **日の入り連動**: 天気APIから取得した日の入り時刻での照明制御提案
- **温度監視**: エアコン稼働中の定期的な温度チェックと自動調整

### 💬 LINE Bot機能
- **手動操作**: LINE経由での照明・エアコンの即座制御
- **確認システム**: 自動制御前のユーザー確認機能
- **状態通知**: デバイス状態や環境情報の通知

### 📅 カレンダー連携
- Google Calendar APIによる睡眠・起床スケジュールの自動取得
- 生活リズムに基づいた自動化ルールの適用

## 技術スタック

- **Runtime**: Bun
- **Language**: TypeScript
- **Architecture**: Clean Architecture (Domain-Driven Design)
- **Container**: Docker
- **Task Runner**: Task (Taskfile.yml)
- **APIs**: 
  - LINE Messaging API
  - Nature Remo Cloud API
  - Google Calendar API

## セットアップ

### 前提条件
- Docker
- Docker Compose
- Task (Taskfile runner)

### 環境変数の設定

```bash
# .envファイルを作成
cp .env.example .env

# 以下の値を設定
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret
NATURE_REMO_ACCESS_TOKEN=your_nature_remo_access_token
GOOGLE_CALENDAR_CREDENTIALS=your_google_calendar_credentials
PORT=3000
NODE_ENV=development
```

### 開発環境の起動

```bash
# 開発環境のセットアップ（初回のみ）
task setup

# 開発サーバーの起動（Docker + ngrok）
task dev

# ログの確認
task logs

# サービスの停止
task stop

# 再起動
task restart
```

## Docker環境での実行

### 基本的なDockerコマンド

```bash
# イメージのビルド
docker build -t group14 .

# コンテナの起動
docker run -p 3000:3000 --env-file .env group14

# コンテナ内でシェルを起動
task shell
```

### Task コマンド一覧

```bash
# 利用可能なタスクを表示
task

# 開発環境のセットアップ
task setup

# 依存関係のインストール
task install

# 開発サーバー起動
task dev

# サービス停止
task stop

# ログ表示
task logs

# コードリント
task lint

# リントエラー修正
task lint:fix

# コードフォーマット
task format

# クリーンアップ
task clean
```

## 使用方法

### LINE Botでの操作例

```
💡 照明操作:
- "照明をつけて"
- "照明を消して"
- "照明を明るくして"

❄️ エアコン操作:
- "エアコンをつけて"
- "温度を25度に設定"
- "エアコンを消して"
```

### 自動化設定

1. Google Calendarに睡眠・起床予定を登録
2. システムが自動的にスケジュールを検出
3. 設定時刻に自動制御を実行（事前確認あり）

## API仕様

### Webhook エンドポイント
- `POST /webhook` - LINE Bot Webhook
- `POST /calendar/webhook` - Google Calendar Webhook

### デバイス制御
- `POST /device/control` - 手動デバイス制御
- `GET /device/status` - デバイス状態取得

## 開発

### アーキテクチャ

```
src/
├── domain/          # ドメイン層 (エンティティ、リポジトリ)
├── application/     # アプリケーション層 (ユースケース、サービス)
├── infrastructure/  # インフラ層 (外部API)
├── presentation/    # プレゼンテーション層 (コントローラー、ルーター)
└── external/        # 外部サービス連携
```

### プロジェクト構造の特徴

- **Clean Architecture**: レイヤー分離による保守性の向上
- **Result型**: 型安全なエラーハンドリング
- **依存性注入**: テスタビリティの確保
- **スケジューラー**: cron式による柔軟なタスク実行

### コード品質管理

```bash
# コードの静的解析
task lint

# 自動修正
task lint:fix

# フォーマット
task format
```

## ライセンス

このプロジェクトは学習目的で作成されています。

## 貢献

プルリクエストやイシューの報告を歓迎します。開発ガイドラインについては、コードベースのアーキテクチャに従ってください。

---

**注意**: 本システムを使用する前に、各APIの利用規約を確認し、適切な認証情報を設定してください。
