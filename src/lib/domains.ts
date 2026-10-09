import "server-only";
import { Resolver } from "node:dns/promises";
import { cacheLife, cacheTag } from "next/cache";
import { and, eq, or } from "drizzle-orm";
import { parse } from "tldts";
import { db } from "@/db";
import { domains, sites } from "@/db/schema";
import { cnameTarget, rootHostname, serverIpv4 } from "@/lib/config";

export const domainsCacheTag = "domains";

// --- Girdi doğrulama ---

export type NormalizedDomain = { hostname: string; isApex: boolean };

// "https://www.Firmam.com.tr/hakkimizda" -> { hostname: "firmam.com.tr", isApex: true }
export function normalizeDomainInput(input: string): { ok: true; value: NormalizedDomain } | { ok: false; error: string } {
  let raw = input.trim().toLowerCase();
  if (!raw) return { ok: false, error: "Domain adını girin." };
  if (!/^[a-z]+:\/\//.test(raw)) raw = `http://${raw}`;

  let hostname: string;
  try {
    // URL, Türkçe karakterli domain'leri de punycode'a çevirir (xn--...)
    hostname = new URL(raw).hostname.replace(/\.$/, "");
  } catch {
    return { ok: false, error: "Geçerli bir domain girin (ör. firmaniz.com)." };
  }

  const parsed = parse(hostname);
  if (parsed.isIp) return { ok: false, error: "IP adresi değil, domain adı girin (ör. firmaniz.com)." };
  if (!parsed.domain || !parsed.isIcann) return { ok: false, error: "Geçerli bir domain girin (ör. firmaniz.com)." };
  if (parsed.domain === rootHostname || hostname.endsWith(`.${rootHostname}`)) {
    return { ok: false, error: "Platformun kendi adresleri bağlanamaz." };
  }
  if (hostname.length > 253) return { ok: false, error: "Domain adı çok uzun." };

  // www.firmam.com yazıldıysa ana domain'i bağla; www otomatik yönlenir
  const sub = parsed.subdomain ?? "";
  if (sub === "" || sub === "www") return { ok: true, value: { hostname: parsed.domain, isApex: true } };
  return { ok: true, value: { hostname, isApex: false } };
}

export function isApexDomain(hostname: string) {
  return (parse(hostname).subdomain ?? "") === "";
}

// --- DNS talimatları ---

export type DnsRecord = { type: "A" | "CNAME"; name: string; value: string; note?: string };

export function dnsInstructions(hostname: string): DnsRecord[] {
  if (isApexDomain(hostname)) {
    return [
      { type: "A", name: "@", value: serverIpv4 || "SUNUCU_IP", note: "Mevcut A kaydı varsa bu değerle değiştirin." },
      { type: "CNAME", name: "www", value: hostname, note: "www ile girenler otomatik olarak ana adrese yönlenir." },
    ];
  }
  const parsed = parse(hostname);
  return [{ type: "CNAME", name: parsed.subdomain ?? hostname, value: cnameTarget }];
}

// --- DNS kontrolü ---

export type DnsCheck = { verified: boolean; problems: string[]; warnings: string[] };

// Yerel DNS önbelleğine takılmamak için herkese açık çözümleyiciler kullanılır
function resolver() {
  const r = new Resolver({ timeout: 4000, tries: 2 });
  r.setServers(["1.1.1.1", "8.8.8.8"]);
  return r;
}

async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export async function checkDomainDns(hostname: string): Promise<DnsCheck> {
  const problems: string[] = [];
  const warnings: string[] = [];

  if (!serverIpv4) {
    return { verified: false, problems: ["Sunucu IP adresi henüz ayarlanmadı (PLATFORM_SERVER_IP)."], warnings };
  }

  const dns = resolver();

  if (isApexDomain(hostname)) {
    const a = (await safe(() => dns.resolve4(hostname))) ?? [];
    const aaaa = (await safe(() => dns.resolve6(hostname))) ?? [];

    if (a.length === 0) problems.push(`${hostname} için A kaydı bulunamadı. DNS değişikliği yeni yapıldıysa birkaç saat sürebilir.`);
    else if (!a.includes(serverIpv4)) problems.push(`${hostname} şu an ${a.join(", ")} adresini gösteriyor, ${serverIpv4} olmalı.`);
    else if (a.length > 1) problems.push(`${hostname} için birden fazla A kaydı var (${a.join(", ")}). Sadece ${serverIpv4} kalmalı.`);

    // IPv6 kaydı başka bir sunucuyu gösterirse bazı ziyaretçiler eski siteye gider ve sertifika alınamaz
    if (aaaa.length > 0) problems.push(`${hostname} için AAAA (IPv6) kaydı var (${aaaa.join(", ")}). Bu kaydı silin.`);

    const www = `www.${hostname}`;
    const wwwCname = (await safe(() => dns.resolveCname(www))) ?? [];
    const wwwA = (await safe(() => dns.resolve4(www))) ?? [];
    const wwwOk = wwwCname.some((c) => c === hostname || c === cnameTarget) || wwwA.includes(serverIpv4);
    if (!wwwOk) warnings.push(`www.${hostname} henüz yönlendirilmemiş. "www" için CNAME kaydını ekleyin.`);
  } else {
    const cname = (await safe(() => dns.resolveCname(hostname))) ?? [];
    const a = (await safe(() => dns.resolve4(hostname))) ?? [];
    if (!cname.includes(cnameTarget) && !a.includes(serverIpv4)) {
      problems.push(
        cname.length > 0
          ? `${hostname} şu an ${cname.join(", ")} adresine yönleniyor, ${cnameTarget} olmalı.`
          : `${hostname} için CNAME kaydı bulunamadı. DNS değişikliği yeni yapıldıysa birkaç saat sürebilir.`,
      );
    }
  }

  return { verified: problems.length === 0, problems, warnings };
}

// --- Gelen istekleri siteye eşleme ---

export type HostMatch = { subdomain: string; hostname: string; isWww: boolean; siteId: string };

// Custom domain'den gelen isteğin hangi siteye ait olduğunu bulur (sadece doğrulanmış domain'ler)
export async function findSiteByHost(host: string): Promise<HostMatch | null> {
  "use cache";
  cacheTag(domainsCacheTag);
  cacheLife("hours");

  const bare = host.startsWith("www.") ? host.slice(4) : host;
  const [row] = await db
    .select({ hostname: domains.hostname, subdomain: sites.subdomain, siteId: sites.id })
    .from(domains)
    .innerJoin(sites, eq(sites.id, domains.siteId))
    .where(and(eq(domains.status, "verified"), or(eq(domains.hostname, host), eq(domains.hostname, bare))))
    .limit(1);

  if (!row) return null;
  // www sadece ana domain'lerde yönlendirilir
  const isWww = row.hostname !== host;
  if (isWww && !isApexDomain(row.hostname)) return null;
  return { ...row, isWww };
}

// Bir domain'in DNS'ini kontrol edip sonucu kaydeder. Önbellek yenilemeyi çağıran taraf yapar
// (server action'da updateTag, zamanlanmış görevde revalidateTag).
export async function runDomainCheck(domainId: string) {
  const [row] = await db
    .select({ id: domains.id, hostname: domains.hostname, status: domains.status, subdomain: sites.subdomain })
    .from(domains)
    .innerJoin(sites, eq(sites.id, domains.siteId))
    .where(eq(domains.id, domainId));
  if (!row) return null;

  const check = await checkDomainDns(row.hostname);
  const newlyVerified = check.verified && row.status !== "verified";

  await db
    .update(domains)
    .set({
      lastCheckedAt: new Date(),
      lastError: check.problems.length > 0 ? check.problems.join("\n") : null,
      // Doğrulanmış bir domain sonraki kontrollerde geçici DNS hatası yüzünden düşürülmez
      ...(newlyVerified ? { status: "verified" as const, verifiedAt: new Date() } : {}),
    })
    .where(eq(domains.id, row.id));

  return { check, newlyVerified, subdomain: row.subdomain, hostname: row.hostname };
}
