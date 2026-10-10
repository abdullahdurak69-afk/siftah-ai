import { isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { sites, subscriptionReminders } from "@/db/schema";
import { purgeVisitorHashes } from "@/lib/stats";
import { getSubscription } from "@/lib/subscription";
import { adminDigestEmail, reminderEmail, type ReminderKind } from "@/lib/subscription-emails";

// Günlük görevler. Sunucuda cron ile her sabah çağrılır (deploy/cron.sh daily):
//   - Abonelik hatırlatmaları: bitişe 30, 7, 1 gün kala, süre dolunca ve site askıya alınınca site sahibine
//   - Bugün hatırlatma giden sitelerin özeti süper admine
//   - Önceki günlerin ziyaretçi hash'lerinin silinmesi
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Yetkisiz", { status: 403 });
  }

  const now = new Date();
  const rows = await db
    .select({ id: sites.id, name: sites.name, endsAt: sites.subscriptionEndsAt })
    .from(sites)
    .where(isNotNull(sites.subscriptionEndsAt));

  const sent: Parameters<typeof adminDigestEmail>[0] = [];
  for (const site of rows) {
    const kind = reminderKind(getSubscription(site.endsAt, now.getTime()));
    if (!kind) continue;

    // Aynı bitiş tarihi için aynı hatırlatma bir kez gider (cron iki kez çalışsa da)
    const inserted = await db
      .insert(subscriptionReminders)
      .values({ siteId: site.id, kind, endsAt: site.endsAt! })
      .onConflictDoNothing()
      .returning({ id: subscriptionReminders.id });
    if (inserted.length === 0) continue;

    const sentTo = await reminderEmail(site, kind, site.endsAt!, now);
    sent.push({ site, kind, endsAt: site.endsAt!, sentTo });
  }

  await adminDigestEmail(sent);
  await purgeVisitorHashes(now);

  return Response.json({ sites: rows.length, reminders: sent.map((s) => `${s.site.name}: ${s.kind}`) });
}

// O an geçerli olan hatırlatma. Cron bir gün kaçırılırsa (ör. 7 gün kala) sadece en günceli gider.
function reminderKind(sub: ReturnType<typeof getSubscription>): ReminderKind | null {
  if (sub.state === "grace") return "expired";
  if (sub.state === "suspended") return "suspended";
  if (sub.state !== "expiring") return null;
  if (sub.daysLeft! <= 1) return "d1";
  if (sub.daysLeft! <= 7) return "d7";
  return "d30";
}
