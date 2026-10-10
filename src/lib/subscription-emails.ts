import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { siteMembers, user } from "@/db/schema";
import { panelUrl, platformName, supportContact } from "@/lib/config";
import { renderEmail, sendEmail } from "@/lib/email";
import { formatNumber, getStatTotals } from "@/lib/stats";
import { formatDate, graceDays, toIsoDate } from "@/lib/subscription";

type Site = { id: string; name: string };

export async function siteOwnerEmails(siteId: string) {
  const rows = await db
    .select({ email: user.email })
    .from(siteMembers)
    .innerJoin(user, eq(user.id, siteMembers.userId))
    .where(and(eq(siteMembers.siteId, siteId), eq(siteMembers.role, "owner")));
  return rows.map((r) => r.email);
}

export async function superAdminEmails() {
  const rows = await db.select({ email: user.email }).from(user).where(eq(user.isSuperAdmin, true));
  return rows.map((r) => r.email);
}

function contactLine() {
  const contact = [supportContact.phone, supportContact.email].filter(Boolean).join(" · ");
  return contact ? `Yenileme ve sorularınız için: ${contact}` : "Yenileme için bizimle iletişime geçebilirsiniz.";
}

// "Son bir yılda siteniz 1.240 kez ziyaret edildi..." (veri yoksa boş)
async function statsSummary(siteId: string, now: Date) {
  const since = toIsoDate(new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000));
  const t = await getStatTotals(siteId, since);
  if (t.visitors === 0) return [];
  const parts = [`${formatNumber(t.visitors)} ziyaretçi`];
  if (t.phoneClicks > 0) parts.push(`${formatNumber(t.phoneClicks)} telefon araması`);
  if (t.whatsappClicks > 0) parts.push(`${formatNumber(t.whatsappClicks)} WhatsApp mesajı`);
  return [{ paragraph: `Son bir yılda siteniz üzerinden: ${parts.join(", ")}.` }];
}

export async function paymentReceivedEmail(site: Site, amount: number, newEnd: Date) {
  const owners = await siteOwnerEmails(site.id);
  const { html, text } = renderEmail("Ödemeniz alındı, teşekkürler", [
    {
      paragraph: `"${site.name}" sitenizin ${formatNumber(amount)} TL tutarındaki abonelik ödemesi kaydedildi. Aboneliğiniz ${formatDate(newEnd)} tarihine kadar geçerlidir.`,
    },
    { button: { label: "Panele git", url: `${panelUrl}/siteler/${site.id}` } },
  ]);
  for (const to of owners) {
    await sendEmail({ to, subject: `${site.name} · Ödemeniz alındı`, html, text, kind: "payment-received", siteId: site.id });
  }
}

export type ReminderKind = "d30" | "d7" | "d1" | "expired" | "suspended";

export async function reminderEmail(site: Site, kind: ReminderKind, endsAt: Date, now: Date) {
  const owners = await siteOwnerEmails(site.id);
  if (owners.length === 0) return 0;

  const end = formatDate(endsAt);
  const suspendDate = formatDate(new Date(endsAt.getTime() + graceDays * 24 * 60 * 60 * 1000));
  const stats = await statsSummary(site.id, now);

  const content = {
    d30: {
      subject: `${site.name} · Aboneliğiniz ${end} tarihinde bitiyor`,
      title: "Aboneliğinizin yenilenme zamanı yaklaşıyor",
      text: `"${site.name}" sitenizin yıllık aboneliği ${end} tarihinde sona eriyor.`,
    },
    d7: {
      subject: `${site.name} · Aboneliğinizin bitmesine 7 gün kaldı`,
      title: "Aboneliğinizin bitmesine 1 hafta kaldı",
      text: `"${site.name}" sitenizin yıllık aboneliği ${end} tarihinde sona eriyor.`,
    },
    d1: {
      subject: `${site.name} · Aboneliğiniz yarın bitiyor`,
      title: "Aboneliğiniz yarın bitiyor",
      text: `"${site.name}" sitenizin yıllık aboneliği ${end} tarihinde sona eriyor.`,
    },
    expired: {
      subject: `${site.name} · Aboneliğinizin süresi doldu`,
      title: "Aboneliğinizin süresi doldu",
      text: `"${site.name}" sitenizin aboneliği ${end} tarihinde sona erdi. Siteniz ${suspendDate} tarihine kadar yayında kalacak; bu tarihe kadar yenilenmezse geçici olarak ziyaretçilere kapanır.`,
    },
    suspended: {
      subject: `${site.name} · Siteniz geçici olarak kapatıldı`,
      title: "Siteniz geçici olarak kapatıldı",
      text: `"${site.name}" sitenizin aboneliği yenilenmediği için site şu an ziyaretçilere kapalı. İçerikleriniz silinmedi; ödeme yapıldığında siteniz hemen yeniden açılır.`,
    },
  }[kind];

  const { html, text } = renderEmail(content.title, [
    { paragraph: content.text },
    ...stats,
    { paragraph: contactLine() },
    { button: { label: "Panele git", url: `${panelUrl}/siteler/${site.id}` } },
  ]);

  for (const to of owners) {
    await sendEmail({ to, subject: content.subject, html, text, kind: `reminder-${kind}`, siteId: site.id });
  }
  return owners.length;
}

const kindLabels: Record<ReminderKind, string> = {
  d30: "30 gün kaldı",
  d7: "7 gün kaldı",
  d1: "1 gün kaldı",
  expired: "süresi doldu (tolerans)",
  suspended: "askıya alındı",
};

// Günlük cron sonunda: bugün hatırlatma giden siteler admine tek e-postada bildirilir
export async function adminDigestEmail(items: { site: Site; kind: ReminderKind; endsAt: Date; sentTo: number }[]) {
  if (items.length === 0) return;
  const admins = await superAdminEmails();
  const { html, text } = renderEmail("Bugünkü abonelik hatırlatmaları", [
    {
      list: items.map(
        (i) => `${i.site.name}: ${kindLabels[i.kind]} (bitiş ${formatDate(i.endsAt)})${i.sentTo === 0 ? " · site sahibi yok, müşteriye e-posta gitmedi" : ""}`,
      ),
    },
    { button: { label: "Yönetim paneli", url: `${panelUrl}/admin` } },
  ]);
  for (const to of admins) {
    await sendEmail({ to, subject: `${platformName} · ${items.length} abonelik hatırlatması`, html, text, kind: "admin-digest" });
  }
}
