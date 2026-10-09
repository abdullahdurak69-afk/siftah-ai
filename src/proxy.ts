import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { classifyHost } from "@/lib/hosts";

// Panelde girişsiz açılabilen sayfalar
const publicPanelPaths = ["/giris", "/kayit"];

// Gelen isteğin host'una bakıp doğru bölüme yönlendirir:
//   platformadi.com           -> tanıtım sitesi (app/ kökü)
//   app.platformadi.com       -> CMS paneli (app/panel)
//   firma.platformadi.com     -> müşteri sitesi (app/site/[subdomain])
//   firmam.com (custom)       -> müşteri sitesi (4. fazda domain tablosundan çözülecek)
export function proxy(request: NextRequest) {
  const host = classifyHost(request.headers.get("host"));
  const { pathname, search } = request.nextUrl;

  switch (host.kind) {
    case "root":
      // İç rotalar ana domain'den doğrudan açılamaz
      if (pathname.startsWith("/panel") || pathname.startsWith("/site")) {
        return NextResponse.rewrite(new URL("/404", request.url));
      }
      return NextResponse.next();

    case "panel":
      // İyimser kontrol: çerez yoksa girişe yönlendir. Asıl doğrulama sayfalarda ve action'larda yapılır.
      if (!publicPanelPaths.includes(pathname) && !getSessionCookie(request)) {
        return NextResponse.redirect(new URL("/giris", request.url));
      }
      return NextResponse.rewrite(new URL(`/panel${pathname === "/" ? "" : pathname}${search}`, request.url));

    case "site":
      return NextResponse.rewrite(new URL(`/site/${host.subdomain}${pathname === "/" ? "" : pathname}`, request.url));

    case "custom":
      // Custom domain: şimdilik desteklenmiyor (4. faz)
      return NextResponse.rewrite(new URL("/404", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
