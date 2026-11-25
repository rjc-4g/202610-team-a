# 日程調整アプリ

社内向けの日程調整 Web アプリ(学習目的・開発環境のみ)。要件は [docs/requirements.md](docs/requirements.md) を参照。

- 概要
  - 最適日の提案
  - ログイン
    - 管理者：イベント作成・回答状況の確認
    - ユーザ：回答の登録
- 目的
  - アプリ
    - グループ活動の日程調整の円滑化
  - 学習
    - Git(GitHub)・Docker・AI
    - Dockerの開発環境での動作をゴールとする

## 起動方法

前提: Docker / Docker Compose

1. `.env.example` をコピーして `.env` を作り、`POSTGRES_PASSWORD` にパスワードを設定する

   ```sh
   cp .env.example .env
   ```

2. 起動する

   ```sh
   docker compose up --build
   ```

3. ブラウザで http://localhost:3000 を開く。DB 接続は http://localhost:3000/api/health で確認できる

停止(`docker compose down`)をはじめ、再起動・初期化、依存パッケージを変えたときの手順、動作確認の方法は [ローカル起動手順](docs/local-setup.md) を参照。

## 開発ルール

https://github.com/rjc-4g/Document

## Author

[株式会社ＲＪＣ](https://www.r-jc.jp/) システム開発部第4グループ
