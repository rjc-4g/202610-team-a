# 日程調整アプリ

社内向けの日程調整 Web アプリ(学習目的・開発環境のみ)。要件は [docs/requirements.md](docs/requirements.md) を参照。

## 起動方法

前提: Docker / Docker Compose

1. `.env.example` をコピーして `.env` を作り、パスワードを設定する(`POSTGRES_PASSWORD` と `DATABASE_URL` は同じ値にする)

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
