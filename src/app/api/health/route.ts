import { Client } from "pg";

// DB 接続確認用。ORM 導入(#3)後に置き換える
export const dynamic = "force-dynamic";

export async function GET() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query("SELECT 1");
    return Response.json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error(error);
    return Response.json({ status: "error", db: "disconnected" }, { status: 500 });
  } finally {
    await client.end();
  }
}
