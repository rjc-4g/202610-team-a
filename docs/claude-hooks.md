# Claude Code hooks

ルール違反や整形漏れを自動で防ぐための hooks。設定は `.claude/settings.json`、スクリプトは `.claude/hooks/`。
実行には Node.js が必要(hook はいずれも `node` で動く。Windows / macOS / Linux 共通)。

| hook | タイミング | 対象 | 目的 |
| --- | --- | --- | --- |
| `guard-protected-branch.mjs` | PreToolUse | Bash | `main` / `develop` 上での `git commit` をブロックする(CLAUDE.md の Git 運用) |
| `guard-env.mjs` | PreToolUse | Bash, Read, Edit, Write, MultiEdit | `.env` / `.env.*` の読み書きをブロックする。`.env.example` は許可 |
| `format-lint.mjs` | PostToolUse | Edit, Write, MultiEdit | 編集した JS/TS ファイルに `eslint --fix` を実行する。自動修正できないエラーが残ると Claude に差し戻す |

ブロック時は exit code 2 と理由(stderr)を返し、Claude に伝わる。

## 動作確認の結果

| ケース | 結果 |
| --- | --- |
| `develop` 上で `git commit` | ブロックされる |
| `feature/*` 上で `git commit` / `develop` 上で `git status` | 通る |
| `.env`、`.env.local` の Read / Edit、`cat .env` | ブロックされる |
| `.env.example` の Read、`cat .env.example`、`npm run dev` | 通る |
| `eslint` エラー(`any`)が残る TS ファイルの編集 | 差し戻される |
| `var` など自動修正できる指摘 | `const` に自動修正され通る |
| `README.md` など JS/TS 以外の編集 | 何もしない |

## 制限事項

- ブランチの判定は hook 実行時点のもの。`git switch -c x && git commit` のように 1 コマンドで切り替えてコミットすると、切り替え前のブランチで判定されてブロックされる(別コマンドに分ける)。
- `.env` の Bash 検査はコマンド文字列の照合のみ。変数や間接参照までは防げない。`permissions.deny` の `Read(./.env)` と併用する。
- 整形は `eslint --fix` のみ。Prettier は未導入。
