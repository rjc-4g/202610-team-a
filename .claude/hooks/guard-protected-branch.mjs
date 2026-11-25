// PreToolUse(Bash): main / develop 上での git commit をブロックする。
import { execFileSync } from "node:child_process";

const input = JSON.parse(await new Response(process.stdin).text());
const command = input.tool_input?.command ?? "";

if (/\bgit\s+(?:-\S+\s+)*commit\b/.test(command)) {
  let branch = "";
  try {
    branch = execFileSync("git", ["branch", "--show-current"], {
      cwd: input.cwd,
      encoding: "utf8",
    }).trim();
  } catch {
    // ブランチを判定できない場合は止めない
  }
  if (branch === "main" || branch === "develop") {
    console.error(
      `${branch} へ直接コミットできません。develop から feature/* 等のブランチを切って作業してください(CLAUDE.md の Git 運用)。`,
    );
    process.exit(2);
  }
}
