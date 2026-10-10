"use server";

import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leads, payments, sites, user } from "@/db/schema";
import { requireSuperAdmin } from "@/lib/dal";
import { auth } from "@/lib/auth";
import { endOfDay, extendedEndDate } from "@/lib/subscription";
import { paymentReceivedEmail } from "@/lib/subscription-emails";
import { leadStatuses, type LeadStatus } from "@/lib/leads";

export type AdminActionResult = { ok: true; message?: string } | { ok: false; message: string };

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih girin.");

const paymentSchema = z.object({
  amount: z.coerce.number().int("Tutarı tam TL olarak girin.").min(0, "Tutar negatif olamaz.").max(10_000_000),
  paidOn: isoDate,
  months: z.coerce.number().int().min(1).max(36),
  note: z.string().trim().max(500).optional(),
  notify: z.boolean(),
});

// Ödemeyi kaydeder ve bitiş tarihini uzatır. Geçerli abonelik varsa mevcut bitişin üstüne eklenir.
export async function recordPayment(siteId: string, input: z.input<typeof paymentSchema>): Promise<AdminActionResult> {
  const admin = await requireSuperAdmin();
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { amount, paidOn, months, note, notify } = parsed.data;

  const [site] = await db.select().from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, message: "Site bulunamadı." };

  const newEnd = endOfDay(extendedEndDate(site.subscriptionEndsAt, paidOn, months));
  await db.transaction(async (tx) => {
    await tx.insert(payments).values({
      siteId: site.id,
      amount,
      paidOn,
      periodEndsAt: newEnd,
      note: note || null,
      recordedBy: admin.id,
    });
    await tx.update(sites).set({ subscriptionEndsAt: newEnd }).where(eq(sites.id, site.id));
  });

  if (notify) await paymentReceivedEmail(site, amount, newEnd);
  return { ok: true };
}

// Bitiş tarihini elle değiştirir (ücretsiz uzatma, hatalı kaydın düzeltilmesi). Boş bırakılırsa kayıt silinir.
export async function setSubscriptionEnd(siteId: string, date: string): Promise<AdminActionResult> {
  await requireSuperAdmin();
  if (date && !isoDate.safeParse(date).success) return { ok: false, message: "Geçerli bir tarih girin." };

  const [updated] = await db
    .update(sites)
    .set({ subscriptionEndsAt: date ? endOfDay(date) : null })
    .where(eq(sites.id, siteId))
    .returning({ id: sites.id });
  return updated ? { ok: true } : { ok: false, message: "Site bulunamadı." };
}

// Yanlış girilen ödeme kaydını siler. Bitiş tarihi bir önceki ödemenin belirlediği tarihe döner.
export async function deletePayment(paymentId: string): Promise<AdminActionResult> {
  await requireSuperAdmin();
  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId));
  if (!payment) return { ok: false, message: "Ödeme bulunamadı." };

  await db.transaction(async (tx) => {
    await tx.delete(payments).where(eq(payments.id, payment.id));
    const [site] = await tx.select({ endsAt: sites.subscriptionEndsAt }).from(sites).where(eq(sites.id, payment.siteId));
    // Sadece bu ödemenin belirlediği tarih hâlâ geçerliyse geri alınır; elle değiştirilmişse dokunulmaz
    if (site?.endsAt?.getTime() === payment.periodEndsAt.getTime()) {
      const [previous] = await tx
        .select({ periodEndsAt: payments.periodEndsAt })
        .from(payments)
        .where(eq(payments.siteId, payment.siteId))
        .orderBy(desc(payments.createdAt))
        .limit(1);
      await tx
        .update(sites)
        .set({ subscriptionEndsAt: previous?.periodEndsAt ?? null })
        .where(eq(sites.id, payment.siteId));
    }
  });
  return { ok: true };
}

// Kullanıcıya şifre belirleme bağlantısı gönderir (davet linki kaybolduysa veya şifresini unuttuysa)
export async function sendPasswordLink(userId: string): Promise<AdminActionResult> {
  await requireSuperAdmin();
  const [row] = await db.select({ email: user.email }).from(user).where(eq(user.id, userId));
  if (!row) return { ok: false, message: "Kullanıcı bulunamadı." };
  await auth.api.requestPasswordReset({ body: { email: row.email } });
  return { ok: true, message: `${row.email} adresine bağlantı gönderildi.` };
}

// Tanıtım sitesinden gelen başvurunun durumu (yeni, arandı, kapandı)
export async function setLeadStatus(leadId: string, status: LeadStatus): Promise<AdminActionResult> {
  await requireSuperAdmin();
  if (!(status in leadStatuses) || !z.uuid().safeParse(leadId).success) return { ok: false, message: "Geçersiz istek." };
  await db.update(leads).set({ status }).where(eq(leads.id, leadId));
  return { ok: true };
}
