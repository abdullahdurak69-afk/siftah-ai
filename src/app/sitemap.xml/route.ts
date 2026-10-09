import { rootDomain } from "@/lib/config";
import { classifyHost } from "@/lib/hosts";
import { resolvePublicSite } from "@/lib/public-site";

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

  if (host.kind === "site" || host.kind === "custom") {
    const result = await resolvePublicSite(host.kind === "site" ? host.subdomain : host.host);
    // Asıl adres başka bir host ise site haritası oradan sunulur
    if (result.kind === "redirect") return Response.redirect(`${result.to.replace(/\/$/, "")}/sitemap.xml`, 308);
    if (result.kind === "site") return sitemap([{ loc: `${result.url}/`, lastmod: result.data.publishedAt ?? undefined }]);
  }

  return new Response("Bulunamadı", { status: 404 });
}
