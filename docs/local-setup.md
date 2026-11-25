# ローカル起動手順

Docker Compose で、アプリ(Next.js)と DB(PostgreSQL)をローカルで起動して動作確認するための手順。

## 前提

- OS: Windows
- Docker Desktop がインストールされ、起動していること。
  - 以下のコマンドでバージョンが出力されれば問題なし。
```bat
docker --version
docker compose version
```
- コマンドプロンプトでプロジェクトルートへ移動済みであること。
  - 以下のコマンドで `docker-compose.yml` が表示されれば正しい場所。

```bat
dir docker-compose.yml
```

## 2. `.env` を作る

```bat
copy .env.example .env
```

- `.env` は Git 管理外。秘密情報をコミットしないこと。
- すでに `.env` がある場合は上書きの確認が出る。既存の値を残したいなら `N` を選ぶ。
- ローカルで動かすだけなら、`.env.example` の値のままで動く。
- パスワードを変える場合は、`POSTGRES_PASSWORD` だけを変える。(`DATABASE_URL` は `docker-compose.yml` が `POSTGRES_*` から組み立てる)
- パスワードは URL の一部になるため、記号(`@` `:` `/` `#` など)を含めず、英数字にする。

## 3. 起動する

```bat
docker compose up --build
```

- このコマンドは起動したまま画面に残る。**このウィンドウは閉じず、以降の操作は別のコマンドプロンプトで行う。**
- 初回はビルドと依存パッケージのインストールに数分かかる。
- `db` が healthy になってから `app` が起動する。
- ログに Next.js の `Ready` が出れば起動完了。
- 止めるときは、このウィンドウで `Ctrl + C` を押す。

## 4. 動作確認

| 確認項目 | 方法 | 期待結果 |
|---|---|---|
| 画面表示 | ブラウザで http://localhost:3000 を開く | Next.js の雛型画面(HTTP 200) |
| DB 接続 | ブラウザで http://localhost:3000/api/health を開く | `{"status":"ok","db":"connected"}` |

コマンドで確認する場合は、別のコマンドプロンプトを開き、「実行場所」の移動をしてから実行する。

```bat
curl -i http://localhost:3000/api/health
```

### ホットリロード

1. 起動したまま `src\app\page.tsx` の文言を編集して保存する。
2. ブラウザが自動で更新されることを確認する。
3. 確認後、別のコマンドプロンプト(リポジトリのルート)で変更を元に戻す。

```bat
git restore src/app/page.tsx
```

### DB 停止時の `/api/health`

別のコマンドプロンプト(リポジトリのルート)で実行する。

```bat
docker compose stop db
curl -i http://localhost:3000/api/health
docker compose start db
```

- 期待結果: HTTP 500 と `{"status":"error","db":"disconnected"}` が返り、app が落ちない

## 5. 停止・再起動・初期化

別のコマンドプロンプト(リポジトリのルート)で実行する。

### 停止

起動したウィンドウで `Ctrl + C` を押した場合も、コンテナの停止までは行われないことがあるため、次のコマンドで停止する。

```bat
docker compose down
```

- コンテナとネットワークを削除する。DB のデータ(`db-data` ボリューム)は残る。

### 再起動

停止後に、もう一度起動するコマンド。

```bat
docker compose up
```

- 2 回目以降は、コード以外を変えていなければ `--build` は不要(起動が速い)。
- `Dockerfile`・`package.json`・`package-lock.json` を変えたときは `docker compose up --build -V` を使う(下の「依存パッケージを変えたとき」を参照)。
- 画面を占有したくない場合は `docker compose up -d`(バックグラウンド起動)。ログは `docker compose logs -f app` で見る(`Ctrl + C` でログ表示だけ止まる)。

### 依存パッケージを変えたとき

`package.json` の変更(パッケージの追加・更新)や、`git pull` で他の人の変更を取り込んだときは、次のコマンドで起動する。

```bat
docker compose up --build -V
```

- `--build`: 新しい依存でイメージを作り直す
- `-V`(`--renew-anon-volumes`): `node_modules`・`.next` の匿名ボリュームを作り直す
- DB のデータ(`db-data`)は残る

理由: `docker-compose.yml` は、ホストの `node_modules` で上書きされないよう、`/app/node_modules` を匿名ボリュームにしている。このボリュームは、最初の 1 回だけ、イメージの中身で初期化される。以降は `--build` でイメージを新しくしても、古い内容が使われ続ける。`-V` を付けないと、`Module not found` などのエラーになることがある。

### 初期化(DB を空に戻す)

```bat
docker compose down -v
docker compose up --build
```

- `-v` で DB のデータと、`node_modules`・`.next` の匿名ボリュームを削除する。
- イメージは残るため、再起動は速い。通常の初期化はこちらを使う。

### 完全削除(ディスク容量を空けたいとき)

```bat
docker compose down --rmi all --volumes --remove-orphans
```

- `--rmi all`: このプロジェクトが使うイメージをすべて削除する。ビルドした app のイメージに加え、`postgres:17-alpine` も対象になる。次回の起動時に、再ビルドと再ダウンロードが必要になる。
- `--volumes`: `-v` と同じ。
- `--remove-orphans`: compose ファイルに定義がない、残存コンテナも削除する。
- 通常の初期化には過剰。ディスク容量を空けたいときや、ビルドキャッシュが原因の不具合を疑うときに使う。
