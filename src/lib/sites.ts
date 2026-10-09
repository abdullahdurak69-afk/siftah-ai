import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSections, sites } from "@/db/schema";
import type { SectionRow } from "@/templates/engine/types";

export function siteCacheTag(subdomain: string) {
  return `site:${subdomain}`;
}

// Ziyaretçiye gösterilen site verisi önbellekten okunur; panelde kaydedilince bu etiket yenilenir
export async function getPublicSite(subdomain: string) {
  "use cache";
  cacheTag(siteCacheTag(subdomain));
  cacheLife("hours");

  const [site] = await db
    .select({
      id: sites.id,
      name: sites.name,
      sector: sites.sector,
      status: sites.status,
      theme: sites.theme,
      profession: sites.profession,
    })
    .from(sites)
    .where(eq(sites.subdomain, subdomain))
    .limit(1);

  if (!site) return null;

  const sections: SectionRow[] = await db
    .select({
      key: siteSections.key,
      position: siteSections.position,
      enabled: siteSections.enabled,
      content: siteSections.content,
    })
    .from(siteSections)
    .where(eq(siteSections.siteId, site.id))
    .orderBy(asc(siteSections.position));

  return { site, sections };
}
