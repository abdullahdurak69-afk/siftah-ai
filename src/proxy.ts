import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { classifyHost } from "@/lib/hosts";
import { routeCustomHost, routeSubdomain, type HostRoute } from "@/lib/host-routing";

// Panelde girişsiz açılabilen sayfalar
const publicPanelPaths = ["/giris", "/sifremi-unuttum", "/sifre-belirle"];

// Yeniden yazma her zaman mevcut isteğin URL'i üzerinden yapılır; aksi halde production'da Next.js
// hedefi dış bir adres sanıp kendine HTTP ile bağlanmaya çalışır.
function rewriteTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.rewrite(url);
}

// Askıdaki site: sayfa yerine doğrudan 503 döner (arama motorları geçici durum olarak anlar)
function suspendedResponse(name: string) {
  const safeName = name.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${safeName}</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#f8fafc;color:#0f172a;padding:24px;text-align:center}h1{font-size:1.5rem;margin:0 0 8px}p{color:#475569;margin:0}</style></head><body><main><h1>${safeName}</h1><p>Bu web sitesi geçici olarak yayında değil.</p></main></body></html>`;
  return new NextResponse(html, {
    status: 503,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "retry-after": "86400" },
  });
}

function siteResponse(request: NextRequest, route: HostRoute, rest: string) {
  if (route.kind === "not-found") return rewriteTo(request, "/404");
  if (route.kind === "suspended") return suspendedResponse(route.name);
  if (route.kind === "redirect") return NextResponse.redirect(`${route.to}${rest || "/"}${request.nextUrl.search}`, 308);
  // QR menü sayfası sadece restoranlarda var
  if (rest === "/menu" && route.sector !== "restoran") return rewriteTo(request, "/404");
  return rewriteTo(request, `/site/${route.subdomain}${rest}`);
}

// Gelen isteğin host'una bakıp doğru bölüme yönlendirir:
//   platformadi.com           -> tanıtım sitesi (app/ kökü)
//   app.platformadi.com       -> CMS paneli (app/panel)
//   firma.platformadi.com     -> müşteri sitesi (app/site/[subdomain]); custom domain'i varsa oraya 308
//   firmam.com (custom)       -> müşteri sitesi (domains tablosundan çözülür); www -> ana domain 308
export async function proxy(request: NextRequest) {
  const host = classifyHost(request.headers.get("host"));
  const { pathname } = request.nextUrl;
  const rest = pathname === "/" ? "" : pathname;

  switch (host.kind) {
    case "root":
      // İç rotalar ana domain'den doğrudan açılamaz
      if (pathname.startsWith("/panel") || pathname.startsWith("/site")) {
        return rewriteTo(request, "/404");
      }
      return NextResponse.next();

    case "panel":
      // İyimser kontrol: çerez yoksa girişe yönlendir. Asıl doğrulama sayfalarda ve action'larda yapılır.
      if (!publicPanelPaths.includes(pathname) && !getSessionCookie(request)) {
        const login = request.nextUrl.clone();
        login.pathname = "/giris";
        login.search = "";
        return NextResponse.redirect(login);
      }
      return rewriteTo(request, `/panel${rest}`);

    case "site":
      // Önizleme linkleri taslak siteleri gösterir; token kontrolünü sayfa yapar
      if (pathname.startsWith("/onizleme/")) return rewriteTo(request, `/site/${host.subdomain}${rest}`);
      return siteResponse(request, await routeSubdomain(host.subdomain), rest);

    case "custom":
      return siteResponse(request, await routeCustomHost(host.host), rest);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
