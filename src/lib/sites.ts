import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sites } from "@/db/schema";

export function siteCacheTag(subdomain: string) {
  return `site:${subdomain}`;
}

// Ziyaretçiye gösterilen site verisi önbellekten okunur; yayınlanınca bu etiket yenilenir (3. faz)
export async function getSiteBySubdomain(subdomain: string) {
  "use cache";
  cacheTag(siteCacheTag(subdomain));
  cacheLife("hours");

  const [site] = await db
    .select({ id: sites.id, name: sites.name, sector: sites.sector, status: sites.status })
    .from(sites)
    .where(eq(sites.subdomain, subdomain))
    .limit(1);

  return site ?? null;
}
