import "server-only";
import { protocol } from "@/lib/config";
import { findSiteByHost } from "@/lib/domains";
import { getPublicSite, siteBaseUrl, type RenderableSite } from "@/lib/sites";

export type PublicSiteResolution =
  | { kind: "site"; data: RenderableSite; url: string }
  | { kind: "redirect"; to: string }
  | { kind: "not-found" };

// Sayfa için: proxy host'u zaten çözüp yönlendirmeleri yaptı, burada sadece içerik ve asıl adres (canonical) alınır
export async function loadPublicSite(subdomain: string) {
  const data = await getPublicSite(subdomain);
  return data ? { data, url: siteBaseUrl(subdomain, data.domain) } : null;
}

// robots.txt ve sitemap.xml için (bu dosyalar proxy'den geçmez, ham host ile gelir).
// Anahtar ya subdomain ("kaya") ya da custom domain'dir ("firmam.com").
export async function resolvePublicSite(key: string): Promise<PublicSiteResolution> {
  if (key.includes(".")) {
    const match = await findSiteByHost(key);
    if (!match) return { kind: "not-found" };
    if (match.isWww) return { kind: "redirect", to: `${protocol}://${match.hostname}/` };

    const data = await getPublicSite(match.subdomain);
    return data ? { kind: "site", data, url: siteBaseUrl(match.subdomain, data.domain) } : { kind: "not-found" };
  }

  const data = await getPublicSite(key);
  if (!data) return { kind: "not-found" };
  if (data.domain) return { kind: "redirect", to: `${siteBaseUrl(key, data.domain)}/` };
  return { kind: "site", data, url: siteBaseUrl(key) };
}
