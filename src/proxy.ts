import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { panelSubdomain, rootDomain } from "@/lib/config";

// Panelde girişsiz açılabilen sayfalar
const publicPanelPaths = ["/giris", "/kayit"];

// Gelen isteğin host'una bakıp doğru bölüme yönlendirir:
//   platformadi.com           -> tanıtım sitesi (app/ kökü)
//   app.platformadi.com       -> CMS paneli (app/panel)
//   firma.platformadi.com     -> müşteri sitesi (app/site/[subdomain])
//   firmam.com (custom)       -> müşteri sitesi (4. fazda domain tablosundan çözülecek)
export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const { pathname, search } = request.nextUrl;

  if (host === rootDomain || host === `www.${rootDomain}`) {
    // İç rotalar ana domain'den doğrudan açılamaz
    if (pathname.startsWith("/panel") || pathname.startsWith("/site")) {
      return NextResponse.rewrite(new URL("/404", request.url));
    }
    return NextResponse.next();
  }

  if (host === `${panelSubdomain}.${rootDomain}`) {
    // İyimser kontrol: çerez yoksa girişe yönlendir. Asıl doğrulama sayfalarda ve action'larda yapılır.
    if (!publicPanelPaths.includes(pathname) && !getSessionCookie(request)) {
      return NextResponse.redirect(new URL("/giris", request.url));
    }
    return NextResponse.rewrite(new URL(`/panel${pathname === "/" ? "" : pathname}${search}`, request.url));
  }

  if (host.endsWith(`.${rootDomain}`)) {
    const subdomain = host.slice(0, -(rootDomain.length + 1));
    return NextResponse.rewrite(new URL(`/site/${subdomain}${pathname === "/" ? "" : pathname}`, request.url));
  }

  // Custom domain: şimdilik desteklenmiyor (4. faz)
  return NextResponse.rewrite(new URL("/404", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
