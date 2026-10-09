import { and, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { domains, sites } from "@/db/schema";
import { protocol, siteUrl } from "@/lib/config";

// Proxy katmanında çalışır (sayfa çizilmeden önce): böylece bulunamayan siteler gerçek 404,
// asıl adrese yönlendirmeler gerçek 308 olarak döner. Sayfa yanıtı akmaya başladıktan sonra
// durum kodu değiştirilemediği için bu kararlar sayfada verilemez.

export type HostRoute = { kind: "site"; subdomain: string } | { kind: "redirect"; to: string } | { kind: "not-found" };

// Her istekte veritabanına gitmemek için kısa süreli bellek önbelleği.
// Yayınlama veya domain değişikliği en geç bu süre sonunda yansır.
const ttlMs = 10_000;
const cache = new Map<string, { route: HostRoute; expires: number }>();

async function cached(key: string, load: () => Promise<HostRoute>) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.route;
  const route = await load();
  cache.set(key, { route, expires: Date.now() + ttlMs });
  if (cache.size > 5000) cache.clear();
  return route;
}

function isLive(row: { status: string; publishedVersionId: string | null }) {
  return row.status === "published" && row.publishedVersionId !== null;
}

// kaya.platformadi.com -> yayındaysa site; custom domain'i varsa oraya 308
export function routeSubdomain(subdomain: string) {
  return cached(`s:${subdomain}`, async () => {
    const [row] = await db
      .select({ status: sites.status, publishedVersionId: sites.publishedVersionId, domain: domains.hostname })
      .from(sites)
      .leftJoin(domains, and(eq(domains.siteId, sites.id), eq(domains.status, "verified")))
      .where(eq(sites.subdomain, subdomain))
      .limit(1);

    if (!row || !isLive(row)) return { kind: "not-found" };
    if (row.domain) return { kind: "redirect", to: `${protocol}://${row.domain}` };
    return { kind: "site", subdomain };
  });
}

// firmam.com -> site; www.firmam.com -> firmam.com'a 308; kayıtsız domain -> 404
export function routeCustomHost(host: string) {
  return cached(`d:${host}`, async () => {
    const bare = host.startsWith("www.") ? host.slice(4) : host;
    const [row] = await db
      .select({
        hostname: domains.hostname,
        subdomain: sites.subdomain,
        status: sites.status,
        publishedVersionId: sites.publishedVersionId,
      })
      .from(domains)
      .innerJoin(sites, eq(sites.id, domains.siteId))
      .where(and(eq(domains.status, "verified"), or(eq(domains.hostname, host), eq(domains.hostname, bare))))
      .limit(1);

    if (!row || !isLive(row)) return { kind: "not-found" };
    if (row.hostname !== host) {
      // www sadece ana domain'lerde yönlendirilir (site.firmam.com bağlıyken www.site.firmam.com yok sayılır)
      return row.hostname.split(".").length === host.split(".").length - 1
        ? { kind: "redirect", to: `${protocol}://${row.hostname}` }
        : { kind: "not-found" };
    }
    return { kind: "site", subdomain: row.subdomain };
  });
}

export { siteUrl };
