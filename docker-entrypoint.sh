#!/bin/bash
set -e

echo "🚀 Starting LINE Bot development environment..."

# 環境変数の確認
if [ -z "$LINE_CHANNEL_ACCESS_TOKEN" ]; then
    echo "❌ LINE_CHANNEL_ACCESS_TOKEN is not set"
    echo "💡 Please set environment variables in .env file"
    exit 1
fi

# Ngrokの認証トークンを設定
if [ -n "$NGROK_AUTHTOKEN" ]; then
    echo "🔐 Setting up ngrok authtoken..."
    ngrok authtoken "$NGROK_AUTHTOKEN"
    echo "✅ Ngrok authtoken configured"
else
    echo "⚠️  NGROK_AUTHTOKEN not set. Ngrok will run with limitations."
    echo "💡 Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken"
fi

# Bunの依存関係を確認
echo "🔍 Checking dependencies..."
bun install

# 開発サーバーを起動
echo "🚀 Starting development server..."
exec bun run dev
