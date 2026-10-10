import { rootDomain } from "@/lib/config";
import { classifyHost } from "@/lib/hosts";
import { legalPages, legalUrl, type LegalPage } from "@/lib/legal-links";
import { resolvePublicSite } from "@/lib/public-site";
import { guides } from "@/content/guides";
import { sectorPages } from "@/content/sectors";

const protocol = rootDomain.startsWith("localhost") ? "http" : "https";

function sitemap(urls: { loc: string; lastmod?: Date }[]) {
  const body = urls
    .map(({ loc, lastmod }) => `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ""}</url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}

export async function GET(request: Request) {
  const host = classifyHost(request.headers.get("host"));

  if (host.kind === "root") {
    const base = `${protocol}://${rootDomain}`;
    return sitemap([
      { loc: `${base}/` },
      ...sectorPages.map((p) => ({ loc: `${base}/${p.slug}` })),
      ...["/fiyatlar", "/ornekler", "/sss", "/rehber", "/iletisim"].map((path) => ({ loc: `${base}${path}` })),
      ...guides.map((g) => ({ loc: `${base}/rehber/${g.slug}`, lastmod: new Date(`${g.updatedAt ?? g.publishedAt}T12:00:00+03:00`) })),
      ...(Object.keys(legalPages) as LegalPage[]).map((page) => ({ loc: legalUrl(page) })),
    ]);
  }

  if (host.kind === "site" || host.kind === "custom") {
    const result = await resolvePublicSite(host.kind === "site" ? host.subdomain : host.host);
    // Asıl adres başka bir host ise site haritası oradan sunulur
    if (result.kind === "redirect") return Response.redirect(`${result.to.replace(/\/$/, "")}/sitemap.xml`, 308);
    if (result.kind === "site") {
      const lastmod = result.data.publishedAt ?? undefined;
      const urls = [{ loc: `${result.url}/`, lastmod }];
      // Restoranların ayrı menü sayfası (QR menü)
      if (result.data.site.sector === "restoran") urls.push({ loc: `${result.url}/menu`, lastmod });
      return sitemap(urls);
    }
  }

  return new Response("Bulunamadı", { status: 404 });
}
