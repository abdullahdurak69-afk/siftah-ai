import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { siteMembers, sites } from "@/db/schema";
import { auth } from "@/lib/auth";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  isSuperAdmin: boolean;
};

// Veri erişim katmanı: yetki kontrolleri burada, veriye en yakın yerde yapılır
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const result = await auth.api.getSession({ headers: await headers() });
  if (!result) return null;
  const { id, name, email, isSuperAdmin } = result.user;
  return { id, name, email, isSuperAdmin: Boolean(isSuperAdmin) };
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/giris");
  return user;
}

export async function listSitesForCurrentUser() {
  const user = await requireUser();

  if (user.isSuperAdmin) {
    return db.select().from(sites).orderBy(desc(sites.createdAt));
  }

  return db
    .select({ site: sites })
    .from(sites)
    .innerJoin(siteMembers, eq(siteMembers.siteId, sites.id))
    .where(eq(siteMembers.userId, user.id))
    .orderBy(desc(sites.createdAt))
    .then((rows) => rows.map((r) => r.site));
}

export async function canEditSite(user: CurrentUser, siteId: string) {
  if (user.isSuperAdmin) return true;
  const [member] = await db
    .select({ role: siteMembers.role })
    .from(siteMembers)
    .where(and(eq(siteMembers.siteId, siteId), eq(siteMembers.userId, user.id)))
    .limit(1);
  return Boolean(member);
}
