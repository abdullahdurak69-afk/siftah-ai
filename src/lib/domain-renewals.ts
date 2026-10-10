import "server-only";
import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { domains, sites, subscriptionReminders } from "@/db/schema";
import { panelUrl, platformName } from "@/lib/config";
import { renderEmail, sendEmail } from "@/lib/email";
import { superAdminEmails } from "@/lib/subscription-emails";
import { formatDate, toIsoDate } from "@/lib/subscription";

// Domain'ler çoğunlukla müşteri adına platform tarafından alınır ve yenilenir. Bitiş tarihi panelde süper admin
// tarafından girilir; günlük cron bitişe 30, 7 ve 1 gün kala ve süre dolunca süper admine hatırlatır.

export type DomainReminderKind = "domain-d30" | "domain-d7" | "domain-d1" | "domain-expired";

const dayMs = 24 * 60 * 60 * 1000;

// Takvim günü olarak bitişe kalan süre (Türkiye saatine göre): bitiş bugünse 0, dün bittiyse -1
export function domainDaysLeft(expiresAt: Date, now: number) {
  return Math.round((Date.parse(toIsoDate(expiresAt)) - Date.parse(toIsoDate(new Date(now)))) / dayMs);
}

// O an geçerli olan hatırlatma (cron bir gün kaçırılırsa sadece en günceli gider)
export function domainReminderKind(expiresAt: Date, now: number): DomainReminderKind | null {
  const days = domainDaysLeft(expiresAt, now);
  if (days < 0) return "domain-expired";
  if (days <= 1) return "domain-d1";
  if (days <= 7) return "domain-d7";
  if (days <= 30) return "domain-d30";
  return null;
}

const kindLabels: Record<DomainReminderKind, string> = {
  "domain-d30": "30 gün kaldı",
  "domain-d7": "7 gün kaldı",
  "domain-d1": "1 gün kaldı",
  "domain-expired": "süresi doldu",
};

type Item = { siteId: string; siteName: string; hostname: string; expiresAt: Date; kind: DomainReminderKind };

// Günlük cron: yaklaşan domain bitişlerini bulur, her biri için bir kez kaydeder ve süper admine tek e-posta gönderir
export async function sendDomainRenewalReminders(now: Date) {
  const rows = await db
    .select({ siteId: sites.id, siteName: sites.name, hostname: domains.hostname, expiresAt: domains.expiresAt })
    .from(domains)
    .innerJoin(sites, eq(sites.id, domains.siteId))
    .where(and(isNotNull(domains.expiresAt), eq(domains.status, "verified")));

  const due: Item[] = [];
  for (const row of rows) {
    const kind = domainReminderKind(row.expiresAt!, now.getTime());
    if (!kind) continue;

    const inserted = await db
      .insert(subscriptionReminders)
      .values({ siteId: row.siteId, kind, endsAt: row.expiresAt! })
      .onConflictDoNothing()
      .returning({ id: subscriptionReminders.id });
    if (inserted.length > 0) due.push({ ...row, expiresAt: row.expiresAt!, kind });
  }

  if (due.length > 0) {
    const admins = await superAdminEmails();
    const { html, text } = renderEmail("Yenilenmesi gereken domain'ler", [
      { paragraph: "Aşağıdaki domain'lerin kaydı yakında bitiyor. Yeniledikten sonra yeni bitiş tarihini panele girin." },
      { list: due.map((d) => `${d.hostname} (${d.siteName}): ${kindLabels[d.kind]}, bitiş ${formatDate(d.expiresAt)}`) },
      { button: { label: "Panele git", url: `${panelUrl}/siteler/${due[0].siteId}/domain` } },
    ]);
    for (const to of admins) {
      await sendEmail({ to, subject: `${platformName} · ${due.length} domain yenilemesi`, html, text, kind: "domain-renewal" });
    }
  }

  return due.map((d) => `${d.hostname}: ${d.kind}`);
}
