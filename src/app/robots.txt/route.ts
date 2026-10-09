import { rootDomain, siteUrl } from "@/lib/config";
import { classifyHost } from "@/lib/hosts";
import { getPublicSite } from "@/lib/sites";

const protocol = rootDomain.startsWith("localhost") ? "http" : "https";

// AI arama botlarına açıkça izin verilir (ChatGPT, Perplexity, Claude, Gemini)
const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended"];

function allowAll(sitemap: string, disallow: string[] = []) {
  const rules = ["Allow: /", ...disallow.map((path) => `Disallow: ${path}`)].join("\n");
  const agents = ["*", ...aiBots].map((bot) => `User-agent: ${bot}\n${rules}`).join("\n\n");
  return `${agents}\n\nSitemap: ${sitemap}\n`;
}

const disallowAll = "User-agent: *\nDisallow: /\n";

function text(body: string) {
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export async function GET(request: Request) {
  const host = classifyHost(request.headers.get("host"));

  switch (host.kind) {
    case "root":
      return text(allowAll(`${protocol}://${rootDomain}/sitemap.xml`));
    case "site": {
      // Taslak ve askıdaki siteler Google'a kapalı
      const site = await getPublicSite(host.subdomain);
      if (!site) return text(disallowAll);
      return text(allowAll(`${siteUrl(host.subdomain)}/sitemap.xml`, ["/onizleme/"]));
    }
    default:
      return text(disallowAll);
  }
}
