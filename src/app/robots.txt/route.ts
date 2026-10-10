import { rootDomain } from "@/lib/config";
import { classifyHost } from "@/lib/hosts";
import { resolvePublicSite } from "@/lib/public-site";

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
      return text(allowAll(`${protocol}://${rootDomain}/sitemap.xml`, ["/onizleme/"]));
    case "site":
    case "custom": {
      // Taslak ve askıdaki siteler Google'a kapalı. Site maps her zaman asıl adresi (custom domain varsa onu) gösterir.
      const result = await resolvePublicSite(host.kind === "site" ? host.subdomain : host.host);
      if (result.kind === "not-found") return text(disallowAll);
      const base = result.kind === "site" ? result.url : result.to.replace(/\/$/, "");
      return text(allowAll(`${base}/sitemap.xml`));
    }
    default:
      return text(disallowAll);
  }
}
