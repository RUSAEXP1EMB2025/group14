# Bunの公式イメージを使用
FROM oven/bun:1

# 作業ディレクトリを設定
WORKDIR /app

# Ngrokをインストール
RUN apt-get update && apt-get install -y curl && \
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | tee /etc/apt/sources.list.d/ngrok.list && \
    apt-get update && apt-get install -y ngrok && \
    rm -rf /var/lib/apt/lists/*

# package.jsonとbun.lockbをコピー（依存関係のキャッシュ最適化のため）
COPY package.json bun.lockb* ./

# 依存関係をインストール
RUN bun install --frozen-lockfile

# アプリケーションのソースコードをコピー
COPY . .

# Ngrokの設定を行うスクリプトをコピー
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ポートを公開
EXPOSE 3000
EXPOSE 4040

# エントリーポイントを設定
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
