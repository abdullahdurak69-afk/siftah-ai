import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { domains, sites } from "@/db/schema";
import { classifyHost } from "@/lib/hosts";
import { recordStat, type StatEvent } from "@/lib/stats";

// Müşteri sitelerindeki sayaç betiğinin (src/templates/stats-beacon.tsx) gönderdiği olaylar.
// İstek sitenin kendi adresine gelir (proxy /api'yi yeniden yazmaz); site host'tan bulunur.

const events = new Set<StatEvent>(["view", "tel", "wa"]);
const botPattern = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python|java\//i;

// Host -> site id, kısa süreli bellek önbelleği (yayında olmayan siteler sayılmaz)
const ttlMs = 60_000;
const cache = new Map<string, { siteId: string | null; expires: number }>();

async function siteIdForHost(rawHost: string | null) {
  const host = classifyHost(rawHost);
  if (host.kind !== "site" && host.kind !== "custom") return null;
  const key = host.kind === "site" ? `s:${host.subdomain}` : `d:${host.host}`;

  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.siteId;

  const [row] =
    host.kind === "site"
      ? await db
          .select({ id: sites.id, status: sites.status })
          .from(sites)
          .where(eq(sites.subdomain, host.subdomain))
          .limit(1)
      : await db
          .select({ id: sites.id, status: sites.status })
          .from(domains)
          .innerJoin(sites, eq(sites.id, domains.siteId))
          .where(and(eq(domains.hostname, host.host), eq(domains.status, "verified")))
          .limit(1);

  const siteId = row?.status === "published" ? row.id : null;
  cache.set(key, { siteId, expires: Date.now() + ttlMs });
  if (cache.size > 5000) cache.clear();
  return siteId;
}

export async function POST(request: Request) {
  const event = (await request.text()).trim() as StatEvent;
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!events.has(event) || !userAgent || botPattern.test(userAgent)) return new Response(null, { status: 204 });

  const siteId = await siteIdForHost(request.headers.get("host"));
  if (!siteId) return new Response(null, { status: 204 });

  // Caddy gerçek ziyaretçi IP'sini X-Forwarded-For ile iletir
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "";
  await recordStat(siteId, event, { ip, userAgent });
  return new Response(null, { status: 204 });
}
