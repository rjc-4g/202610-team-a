// PostToolUse(Edit|Write): 編集した JS/TS ファイルに eslint --fix を実行する。
// 自動修正できなかった問題は exit 2 で Claude に返す。
import { spawnSync } from "node:child_process";
import path from "node:path";

const input = JSON.parse(await new Response(process.stdin).text());
const file = input.tool_input?.file_path;
const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd;

if (file && /\.(?:[cm]?[jt]sx?)$/.test(file) && !path.relative(root, file).startsWith("..")) {
  const eslint = path.join(root, "node_modules", "eslint", "bin", "eslint.js");
  const r = spawnSync(process.execPath, [eslint, "--fix", file], {
    cwd: root,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    console.error(`eslint の指摘が残っています:\n${r.stdout}${r.stderr}`);
    process.exit(2);
  }
}
