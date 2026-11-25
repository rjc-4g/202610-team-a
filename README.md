# 日程調整アプリ

社内向けの日程調整 Web アプリ(学習目的・開発環境のみ)。要件は [docs/requirements.md](docs/requirements.md) を参照。

## 起動方法

前提: Docker / Docker Compose

1. `.env.example` をコピーして `.env` を作り、`POSTGRES_PASSWORD` にパスワードを設定する(`DATABASE_URL` は `docker-compose.yml` が組み立てる。記号を含むパスワードは URL に使えないため、英数字にする)

   ```sh
   cp .env.example .env
   ```

2. 起動する

   ```sh
   docker compose up --build
   ```

3. ブラウザで http://localhost:3000 を開く。DB 接続は http://localhost:3000/api/health で確認できる

- 停止: `docker compose down`
- DB のパスワードは初回起動時に設定される。あとから変える場合は `docker compose down -v` で DB のデータごと削除してから起動し直す
