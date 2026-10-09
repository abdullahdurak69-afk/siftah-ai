import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { siteMembers, siteSections, sites } from "@/db/schema";
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

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Kullanıcının düzenleme yetkisi olan siteyi döner; yoksa null
export async function findEditableSite(siteId: string) {
  const user = await requireUser();
  if (!uuidPattern.test(siteId)) return null;

  const [site] = await db.select().from(sites).where(eq(sites.id, siteId)).limit(1);
  if (!site || !(await canEditSite(user, site.id))) return null;
  return site;
}

// Panel sayfaları için: yetki yoksa 404 gösterir (sitenin varlığını da sızdırmaz).
// Aynı istekte layout ve sayfa birlikte çağırdığı için react cache ile tekilleştirilir.
export const getEditableSite = cache(async (siteId: string) => {
  const site = await findEditableSite(siteId);
  if (!site) notFound();

  const sections = await db
    .select()
    .from(siteSections)
    .where(eq(siteSections.siteId, site.id))
    .orderBy(asc(siteSections.position));

  return { site, sections };
});
