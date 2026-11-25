# Claude Code Skills

繰り返す作業を定型化した Skills。置き場所は `.claude/skills/<名前>/SKILL.md`。
「/名前」で呼び出すか、依頼内容に応じて Claude が自動で選ぶ。

| Skill | 使いどころ | やること |
| --- | --- | --- |
| `start-issue` | Issue に着手するとき(`/start-issue 3`) | Issue 確認(依存・要件書)→ `develop` からブランチ作成 → 計画(作業・ファイル・確認方法・スコープ外の有無)の提示 |
| `prepare-commit-pr` | コミット・PR の前 | 差分から `.gitmessage` 形式のコミット案と PR ひな型どおりの本文案を作って提示。実行は操作ごとの承認後 |
| `check-requirements` | 実装後、PR の前 | 変更と `docs/requirements.md` を突き合わせ、充足・不足・食い違い・スコープ外・権限・秘密情報を表で報告(読み取り専用) |

## 標準の流れ

1. `/start-issue <番号>` でブランチを切り、計画を確認する
2. 実装する
3. `/check-requirements` で要件との差分を確認する
4. `/prepare-commit-pr` で案を作り、承認してからコミット・push・PR 作成

コミット・push・PR など外部に影響する操作は、どの Skill でも自動実行しない(CLAUDE.md の Git 運用)。

## 使ってみた結果

| Skill | 対象 | 結果 |
| --- | --- | --- |
| `start-issue` | Issue #3(DB スキーマ) | 依存 #2 がクローズ済みと確認、要件書 3・6 章を読み、受け入れ条件の確認までできた。ブランチ作成は本 Issue の作業中のため行っていない(手順 2 は未実施) |
| `check-requirements` | 本 Skills の変更(Issue #15) | 要件書 1 章(ハーネスは 10h 枠外)・8 章(アプリ機能の追加なし)と矛盾なし。秘密情報の混入なし。権限・DB 関連の項目は対象外のため「該当なし」と判定できた |
| `prepare-commit-pr` | 本 Skills の変更 | `.gitmessage` 形式のコミット案と PR ひな型の本文案を提示し、承認待ちで止まることを確認 |

## 制限事項・改善点

- `start-issue` のブランチ作成(手順 2)は、実際にブランチを切る Issue(#3 以降)で初めて確認する。
- 環境変数ファイル名を含むコマンドは hooks(`docs/claude-hooks.md`)に誤検知されるため、コミット・PR の本文では言い換える。
