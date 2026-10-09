import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { domains, previewLinks, siteSections, siteVersions, sites } from "@/db/schema";
import { protocol, siteUrl } from "@/lib/config";
import type { SectionRow } from "@/templates/engine/types";

export function siteCacheTag(subdomain: string) {
  return `site:${subdomain}`;
}

export type RenderableSite = {
  site: { id: string; name: string; sector: (typeof sites.$inferSelect)["sector"]; theme: string; profession: string | null };
  sections: SectionRow[];
  publishedAt: Date | null;
  // Doğrulanmış custom domain varsa sitenin asıl adresi odur
  domain?: string | null;
};

export function siteBaseUrl(subdomain: string, domain?: string | null) {
  return domain ? `${protocol}://${domain}` : siteUrl(subdomain);
}

// Ziyaretçiye gösterilen site: her zaman yayındaki sürümün anlık görüntüsü. Yayınlanınca etiket yenilenir.
export async function getPublicSite(subdomain: string): Promise<RenderableSite | null> {
  "use cache";
  cacheTag(siteCacheTag(subdomain));
  cacheLife("hours");

  const [row] = await db
    .select({
      id: sites.id,
      sector: sites.sector,
      status: sites.status,
      snapshot: siteVersions.snapshot,
      publishedAt: siteVersions.createdAt,
      domain: domains.hostname,
    })
    .from(sites)
    .innerJoin(siteVersions, eq(siteVersions.id, sites.publishedVersionId))
    .leftJoin(domains, and(eq(domains.siteId, sites.id), eq(domains.status, "verified")))
    .where(eq(sites.subdomain, subdomain))
    .limit(1);

  // Hiç yayınlanmamış veya askıya alınmış siteler dışarıdan görünmez
  if (!row || row.status !== "published") return null;

  const { snapshot } = row;
  return {
    site: { id: row.id, sector: row.sector, name: snapshot.name, theme: snapshot.theme, profession: snapshot.profession },
    sections: snapshot.sections,
    publishedAt: row.publishedAt,
    domain: row.domain,
  };
}

// Panelde ve önizlemede gösterilen taslak hali (önbelleğe alınmaz)
export async function getDraftSections(siteId: string): Promise<SectionRow[]> {
  return db
    .select({
      key: siteSections.key,
      position: siteSections.position,
      enabled: siteSections.enabled,
      content: siteSections.content,
    })
    .from(siteSections)
    .where(eq(siteSections.siteId, siteId))
    .orderBy(asc(siteSections.position));
}

// Paylaşılabilir önizleme linki: token geçerliyse ve bu subdomain'e aitse taslağı döner
export async function getSiteByPreviewToken(subdomain: string, token: string): Promise<RenderableSite | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;

  const [site] = await db
    .select({ id: sites.id, name: sites.name, sector: sites.sector, theme: sites.theme, profession: sites.profession })
    .from(previewLinks)
    .innerJoin(sites, eq(sites.id, previewLinks.siteId))
    .where(and(eq(previewLinks.token, token), eq(sites.subdomain, subdomain), gt(previewLinks.expiresAt, sql`now()`)))
    .limit(1);

  if (!site) return null;
  return { site, sections: await getDraftSections(site.id), publishedAt: null };
}
