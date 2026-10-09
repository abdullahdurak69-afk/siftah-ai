import { rootDomain, siteUrl } from "@/lib/config";
import { classifyHost } from "@/lib/hosts";
import { getPublicSite } from "@/lib/sites";

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

  if (host.kind === "root") return sitemap([{ loc: `${protocol}://${rootDomain}/` }]);

  if (host.kind === "site") {
    const site = await getPublicSite(host.subdomain);
    if (site) return sitemap([{ loc: `${siteUrl(host.subdomain)}/`, lastmod: site.publishedAt ?? undefined }]);
  }

  return new Response("Bulunamadı", { status: 404 });
}
