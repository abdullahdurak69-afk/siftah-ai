import "server-only";
import { lt, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { panelUrl, platformName, sectors } from "@/lib/config";
import { renderEmail, sendEmail } from "@/lib/email";
import { superAdminEmails } from "@/lib/subscription-emails";

// Tanıtım sitesindeki başvuru formu. Kayıt kapalı olduğu için yeni müşteri buradan gelir; başvuru kaydedilir ve
// süper admine e-postayla bildirilir. Müşteriliğe dönüşmeyen başvurular bir yıl sonra silinir (KVKK metni).

const phonePattern = /^[0-9+()\s-]{7,20}$/;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Adınızı girin.").max(80),
  phone: z.string().trim().regex(phonePattern, "Geçerli bir telefon numarası girin."),
  businessName: z.string().trim().max(100).default(""),
  sector: z.string().trim().max(40).default(""),
  message: z.string().trim().max(1000).default(""),
  source: z.string().trim().max(100).default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const leadStatuses = {
  new: { text: "Yeni", className: "bg-amber-100 text-amber-800" },
  contacted: { text: "Arandı", className: "bg-sky-100 text-sky-800" },
  closed: { text: "Kapandı", className: "bg-slate-100 text-slate-600" },
} as const;

export type LeadStatus = keyof typeof leadStatuses;

// Aynı kaynaktan kısa sürede çok başvuru gelmesin (tek sunucu olduğu için bellekte tutulur)
const recent = new Map<string, number[]>();
const windowMs = 60 * 60 * 1000;
const maxPerWindow = 5;

export function leadRateLimited(key: string, now: number) {
  const times = (recent.get(key) ?? []).filter((t) => now - t < windowMs);
  if (times.length >= maxPerWindow) return true;
  times.push(now);
  recent.set(key, times);
  if (recent.size > 10_000) recent.clear();
  return false;
}

export async function saveLead(input: LeadInput) {
  const [lead] = await db.insert(leads).values(input).returning();

  const sectorLabel = sectors[input.sector as keyof typeof sectors] ?? input.sector;
  const lines = [
    `Ad: ${input.name}`,
    `Telefon: ${input.phone}`,
    input.businessName && `İşletme: ${input.businessName}`,
    sectorLabel && `Sektör: ${sectorLabel}`,
    input.source && `Sayfa: ${input.source}`,
  ].filter(Boolean) as string[];

  const { html, text } = renderEmail("Yeni başvuru", [
    { list: lines },
    ...(input.message ? [{ paragraph: input.message }] : []),
    { button: { label: "Başvurular", url: `${panelUrl}/admin/basvurular` } },
  ]);
  for (const to of await superAdminEmails()) {
    await sendEmail({ to, subject: `${platformName} · Yeni başvuru: ${input.businessName || input.name}`, html, text, kind: "lead" });
  }
  return lead;
}

// Günlük cron: bir yıldan eski başvuruları siler
export async function purgeOldLeads() {
  const deleted = await db
    .delete(leads)
    .where(lt(leads.createdAt, sql`now() - interval '1 year'`))
    .returning({ id: leads.id });
  return deleted.length;
}
