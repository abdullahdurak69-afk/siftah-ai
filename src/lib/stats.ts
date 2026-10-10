import "server-only";
import { createHash } from "node:crypto";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { siteStatsDaily, statVisitors } from "@/db/schema";
import { toIsoDate } from "@/lib/subscription";

// Çerezsiz ziyaretçi sayacı. Ziyaretçiyi tanımak için IP + tarayıcı bilgisi, o güne özel gizli bir tuzla
// hash'lenir; IP hiçbir yerde saklanmaz ve hash'ler ertesi gün silinir (src/app/api/cron/daily).
// Böylece aynı kişi gün içinde birden çok kez sayılmaz ama günler arası takip edilemez.

export type StatEvent = "view" | "tel" | "wa";

function dailySalt(day: string) {
  return createHash("sha256")
    .update(`${process.env.BETTER_AUTH_SECRET ?? "dev"}:stats:${day}`)
    .digest("hex");
}

export function visitorHash(day: string, siteId: string, ip: string, userAgent: string) {
  return createHash("sha256").update(`${dailySalt(day)}:${siteId}:${ip}:${userAgent}`).digest("base64url").slice(0, 22);
}

export async function recordStat(siteId: string, event: StatEvent, visitor: { ip: string; userAgent: string }) {
  const day = toIsoDate(new Date());

  if (event === "view") {
    // Bugün ilk kez görülen ziyaretçi mi?
    const inserted = await db
      .insert(statVisitors)
      .values({ day, siteId, hash: visitorHash(day, siteId, visitor.ip, visitor.userAgent) })
      .onConflictDoNothing()
      .returning({ hash: statVisitors.hash });
    const isNew = inserted.length > 0 ? 1 : 0;

    await db
      .insert(siteStatsDaily)
      .values({ siteId, day, views: 1, visitors: isNew })
      .onConflictDoUpdate({
        target: [siteStatsDaily.siteId, siteStatsDaily.day],
        set: { views: sql`${siteStatsDaily.views} + 1`, visitors: sql`${siteStatsDaily.visitors} + ${isNew}` },
      });
    return;
  }

  const column = event === "tel" ? siteStatsDaily.phoneClicks : siteStatsDaily.whatsappClicks;
  const key = event === "tel" ? "phoneClicks" : "whatsappClicks";
  await db
    .insert(siteStatsDaily)
    .values({ siteId, day, [key]: 1 })
    .onConflictDoUpdate({ target: [siteStatsDaily.siteId, siteStatsDaily.day], set: { [key]: sql`${column} + 1` } });
}

export type StatTotals = { views: number; visitors: number; phoneClicks: number; whatsappClicks: number };
export type StatDay = StatTotals & { day: string };

// Son `days` gün (bugün dahil), eksik günler sıfırla doldurulur
export async function getDailyStats(siteId: string, days: number, now: Date): Promise<StatDay[]> {
  const today = toIsoDate(now);
  const first = toIsoDate(new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000));

  const rows = await db
    .select({
      day: sql<string>`${siteStatsDaily.day}::text`,
      views: siteStatsDaily.views,
      visitors: siteStatsDaily.visitors,
      phoneClicks: siteStatsDaily.phoneClicks,
      whatsappClicks: siteStatsDaily.whatsappClicks,
    })
    .from(siteStatsDaily)
    .where(and(eq(siteStatsDaily.siteId, siteId), gte(siteStatsDaily.day, first), sql`${siteStatsDaily.day} <= ${today}`));
  const byDay = new Map(rows.map((r) => [r.day, r]));

  const result: StatDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = toIsoDate(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
    result.push(byDay.get(day) ?? { day, views: 0, visitors: 0, phoneClicks: 0, whatsappClicks: 0 });
  }
  return result;
}

export async function getStatTotals(siteId: string, sinceIsoDate: string): Promise<StatTotals> {
  const [row] = await db
    .select({
      views: sql<number>`coalesce(sum(${siteStatsDaily.views}), 0)::int`,
      visitors: sql<number>`coalesce(sum(${siteStatsDaily.visitors}), 0)::int`,
      phoneClicks: sql<number>`coalesce(sum(${siteStatsDaily.phoneClicks}), 0)::int`,
      whatsappClicks: sql<number>`coalesce(sum(${siteStatsDaily.whatsappClicks}), 0)::int`,
    })
    .from(siteStatsDaily)
    .where(and(eq(siteStatsDaily.siteId, siteId), gte(siteStatsDaily.day, sinceIsoDate)));
  return row;
}

// Önceki günlerin ziyaretçi hash'lerini siler (günlük cron)
export async function purgeVisitorHashes(now: Date) {
  await db.delete(statVisitors).where(lt(statVisitors.day, toIsoDate(now)));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}
