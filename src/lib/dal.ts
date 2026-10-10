import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { siteMembers, siteSections, siteVersions, sites } from "@/db/schema";
import { auth } from "@/lib/auth";
import { emptyObject } from "@/templates/engine/fields";
import { getTemplate } from "@/templates/registry";

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

// Süper admin her sitede "admin" sayılır; diğerleri site_members tablosundaki rolleriyle
export type SiteRole = "admin" | "owner" | "editor";

export async function getSiteRole(user: CurrentUser, siteId: string): Promise<SiteRole | null> {
  if (user.isSuperAdmin) return "admin";
  const [member] = await db
    .select({ role: siteMembers.role })
    .from(siteMembers)
    .where(and(eq(siteMembers.siteId, siteId), eq(siteMembers.userId, user.id)))
    .limit(1);
  return member?.role ?? null;
}

// Domain, kullanıcılar ve abonelik bilgisi: sadece site sahibi ve admin
export function canManage(role: SiteRole | null) {
  return role === "admin" || role === "owner";
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Kullanıcının erişebildiği site ve rolü; erişimi yoksa null
export async function findSiteAccess(siteId: string) {
  const user = await requireUser();
  if (!uuidPattern.test(siteId)) return null;

  const [site] = await db.select().from(sites).where(eq(sites.id, siteId)).limit(1);
  if (!site) return null;
  const role = await getSiteRole(user, site.id);
  return role ? { site, role, user } : null;
}

// İçerik düzenleme (tüm roller)
export async function findEditableSite(siteId: string) {
  return (await findSiteAccess(siteId))?.site ?? null;
}

// Domain ve kullanıcı yönetimi (sahip ve admin)
export async function findManageableSite(siteId: string) {
  const access = await findSiteAccess(siteId);
  return access && canManage(access.role) ? access : null;
}

// Admin sayfaları ve action'ları için: süper admin değilse 404 (sayfanın varlığını da sızdırmaz)
export async function requireSuperAdmin() {
  const user = await requireUser();
  if (!user.isSuperAdmin) notFound();
  return user;
}

// Panel sayfaları için: yetki yoksa 404 gösterir (sitenin varlığını da sızdırmaz).
// Aynı istekte layout ve sayfa birlikte çağırdığı için react cache ile tekilleştirilir.
export const getEditableSite = cache(async (siteId: string) => {
  const access = await findSiteAccess(siteId);
  if (!access) notFound();
  const { site, role } = access;

  await ensureTemplateSections(site);

  const [sections, [published]] = await Promise.all([
    db.select().from(siteSections).where(eq(siteSections.siteId, site.id)).orderBy(asc(siteSections.position)),
    site.publishedVersionId
      ? db
          .select({ createdAt: siteVersions.createdAt })
          .from(siteVersions)
          .where(eq(siteVersions.id, site.publishedVersionId))
      : Promise.resolve([]),
  ]);

  const publishedAt = published?.createdAt ?? null;
  const hasUnpublishedChanges = !publishedAt || site.contentUpdatedAt > publishedAt;

  return { site, role, sections, publishedAt, hasUnpublishedChanges };
});

// Şablona sonradan eklenen bölümleri (ör. galeri) mevcut sitelere kapalı olarak ekler ve sırayı şablona göre düzeltir
async function ensureTemplateSections(site: typeof sites.$inferSelect) {
  const template = getTemplate(site.sector);
  if (!template || !site.setupCompletedAt) return;

  const existing = await db
    .select({ key: siteSections.key, position: siteSections.position })
    .from(siteSections)
    .where(eq(siteSections.siteId, site.id));
  const keys = new Set(existing.map((s) => s.key));
  const missing = template.sections.filter((def) => !keys.has(def.key));
  if (missing.length === 0) return;

  await db.transaction(async (tx) => {
    await tx.insert(siteSections).values(
      missing.map((def) => ({
        siteId: site.id,
        key: def.key,
        position: 0,
        enabled: false,
        content: def.initial ?? emptyObject(def.fields),
      })),
    );
    for (const [position, def] of template.sections.entries()) {
      await tx
        .update(siteSections)
        .set({ position })
        .where(and(eq(siteSections.siteId, site.id), eq(siteSections.key, def.key)));
    }
  });
}
