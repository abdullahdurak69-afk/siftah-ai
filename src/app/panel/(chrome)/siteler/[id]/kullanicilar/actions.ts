"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { siteMembers, user } from "@/db/schema";
import { findManageableSite } from "@/lib/dal";
import { inviteToSite, sendInvite } from "@/lib/invites";

export type MemberActionResult = { ok: true; message?: string } | { ok: false; message: string };

const noAccess = { ok: false, message: "Kullanıcıları sadece site sahibi yönetebilir." } as const;

const inviteSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı.").max(80, "Ad çok uzun."),
  email: z.email("Geçerli bir e-posta adresi girin.").max(200),
  role: z.enum(["owner", "editor"]),
});

export async function inviteMember(siteId: string, input: { name: string; email: string; role: string }): Promise<MemberActionResult> {
  const access = await findManageableSite(siteId);
  if (!access) return noAccess;

  const parsed = inviteSchema.safeParse({ ...input, email: input.email.trim() });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  // Site sahibi sadece editör ekleyebilir; sahip atamak admin işidir (abonelik ve sözleşme sahibiyle yapılır)
  if (parsed.data.role === "owner" && access.role !== "admin") {
    return { ok: false, message: "Site sahibi eklemek için bizimle iletişime geçin." };
  }

  const result = await inviteToSite({ site: access.site, ...parsed.data, inviter: access.user });
  if (!result.ok) return result;
  return {
    ok: true,
    message: result.created
      ? `${parsed.data.email} adresine davet gönderildi.`
      : `${parsed.data.email} siteye eklendi ve bilgilendirildi.`,
  };
}

async function findMember(siteId: string, userId: string) {
  const [member] = await db
    .select({ role: siteMembers.role, email: user.email })
    .from(siteMembers)
    .innerJoin(user, eq(user.id, siteMembers.userId))
    .where(and(eq(siteMembers.siteId, siteId), eq(siteMembers.userId, userId)));
  return member;
}

export async function removeMember(siteId: string, userId: string): Promise<MemberActionResult> {
  const access = await findManageableSite(siteId);
  if (!access) return noAccess;

  const member = await findMember(access.site.id, userId);
  if (!member) return { ok: false, message: "Kullanıcı bulunamadı." };
  if (access.role !== "admin") {
    if (userId === access.user.id) return { ok: false, message: "Kendinizi siteden çıkaramazsınız." };
    if (member.role === "owner") return { ok: false, message: "Site sahibini sadece yönetici çıkarabilir." };
  }

  // Kullanıcının hesabı silinmez; sadece bu siteye erişimi kalkar
  await db.delete(siteMembers).where(and(eq(siteMembers.siteId, access.site.id), eq(siteMembers.userId, userId)));
  return { ok: true };
}

export async function resendMemberInvite(siteId: string, userId: string): Promise<MemberActionResult> {
  const access = await findManageableSite(siteId);
  if (!access) return noAccess;

  const member = await findMember(access.site.id, userId);
  if (!member) return { ok: false, message: "Kullanıcı bulunamadı." };

  await sendInvite(userId, member.email, access.site, access.user);
  return { ok: true, message: `${member.email} adresine yeni davet gönderildi.` };
}
