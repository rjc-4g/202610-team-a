// PreToolUse: .env(.env.example 以外)への読み書きをブロックする。
const input = JSON.parse(await new Response(process.stdin).text());
const { tool_name: tool, tool_input: ti = {} } = input;

// .env / .env.local など。.env.example は許可
const isEnvPath = (p) => /^\.env(\.(?!example$).+)?$/.test(p.split(/[\\/]/).pop());
const envInCommand =
  /(^|[\s"'=<>/\\])\.env(\.(?!example(?![\w.-]))[\w.-]+)?(?![\w.-])/;

const blocked =
  (typeof ti.file_path === "string" && isEnvPath(ti.file_path)) ||
  (tool === "Bash" && envInCommand.test(ti.command ?? ""));

if (blocked) {
  console.error(
    ".env は秘密情報のため読み書きできません。変数名の追加は .env.example を編集し、値はユーザが .env に設定してください。",
  );
  process.exit(2);
}
