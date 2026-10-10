import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { account, siteMembers, user, verification } from "@/db/schema";
import { addedToSiteEmail, inviteEmail } from "@/lib/account-emails";

// Kayıt kapalı olduğu için hesaplar davetle açılır: şifresiz kullanıcı oluşturulur ve Better Auth'un şifre
// sıfırlama token'ı (reset-password:<token>) üretilir. Kullanıcı e-postadaki linkle şifresini belirleyince
// Better Auth hesabına şifre girişini ekler (src/app/panel/(chrome)/sifre-belirle).

export const inviteDays = 7;

type Site = { id: string; name: string };
type Inviter = { name: string };

export type InviteResult = { ok: true; created: boolean } | { ok: false; message: string };

async function createSetPasswordToken(userId: string) {
  const token = randomBytes(18).toString("base64url");
  await db.insert(verification).values({
    id: randomUUID(),
    identifier: `reset-password:${token}`,
    value: userId,
    expiresAt: new Date(Date.now() + inviteDays * 24 * 60 * 60 * 1000),
  });
  return token;
}

export async function inviteToSite(opts: {
  site: Site;
  email: string;
  name: string;
  role: "owner" | "editor";
  inviter: Inviter;
}): Promise<InviteResult> {
  const email = opts.email.trim().toLowerCase();
  const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);

  if (existing) {
    const [member] = await db
      .select({ role: siteMembers.role })
      .from(siteMembers)
      .where(and(eq(siteMembers.siteId, opts.site.id), eq(siteMembers.userId, existing.id)));
    if (member) return { ok: false, message: "Bu kişi zaten sitenin kullanıcısı." };

    await db.insert(siteMembers).values({ siteId: opts.site.id, userId: existing.id, role: opts.role });
    // Daha önce davet edilip şifresini hiç belirlemediyse yeni bir davet linki gider
    if (await hasPassword(existing.id)) {
      await addedToSiteEmail({ to: email, siteName: opts.site.name, siteId: opts.site.id, inviter: opts.inviter.name });
    } else {
      await sendInvite(existing.id, email, opts.site, opts.inviter);
    }
    return { ok: true, created: false };
  }

  const userId = randomUUID();
  await db.transaction(async (tx) => {
    await tx.insert(user).values({ id: userId, name: opts.name.trim(), email, emailVerified: false });
    await tx.insert(siteMembers).values({ siteId: opts.site.id, userId, role: opts.role });
  });
  await sendInvite(userId, email, opts.site, opts.inviter);
  return { ok: true, created: true };
}

export async function sendInvite(userId: string, email: string, site: Site, inviter: Inviter) {
  const token = await createSetPasswordToken(userId);
  await inviteEmail({ to: email, siteName: site.name, siteId: site.id, inviter: inviter.name, token, days: inviteDays });
}

async function hasPassword(userId: string) {
  const [row] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "credential")))
    .limit(1);
  return Boolean(row);
}

export type SiteMemberRow = {
  userId: string;
  name: string;
  email: string;
  role: "owner" | "editor";
  // Davet edildi ama şifresini henüz belirlemedi
  pending: boolean;
};

export async function listSiteMembers(siteId: string): Promise<SiteMemberRow[]> {
  const rows = await db
    .select({ userId: user.id, name: user.name, email: user.email, role: siteMembers.role })
    .from(siteMembers)
    .innerJoin(user, eq(user.id, siteMembers.userId))
    .where(eq(siteMembers.siteId, siteId))
    .orderBy(asc(siteMembers.createdAt));
  if (rows.length === 0) return [];

  const withPassword = await db
    .select({ userId: account.userId })
    .from(account)
    .where(and(inArray(account.userId, rows.map((r) => r.userId)), eq(account.providerId, "credential")));
  const active = new Set(withPassword.map((r) => r.userId));
  return rows.map((r) => ({ ...r, pending: !active.has(r.userId) }));
}
