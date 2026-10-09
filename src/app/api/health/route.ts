import { sql } from "drizzle-orm";
import { db } from "@/db";

// Dış izleme servisi (UptimeRobot vb.) bu adresi düzenli olarak çağırır; veritabanına ulaşılamazsa 503 döner
export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
