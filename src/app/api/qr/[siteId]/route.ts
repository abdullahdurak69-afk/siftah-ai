import { findEditableSite } from "@/lib/dal";
import { menuUrl, qrPng, qrSvg } from "@/lib/qr";

// QR menü kodunu indirme: /api/qr/<site>?format=png|svg (panel kullanıcıları)
export async function GET(request: Request, { params }: RouteContext<"/api/qr/[siteId]">) {
  const { siteId } = await params;
  const site = await findEditableSite(siteId);
  if (!site || site.sector !== "restoran") return new Response("Bulunamadı", { status: 404 });

  const format = new URL(request.url).searchParams.get("format") === "svg" ? "svg" : "png";
  const url = menuUrl(site.subdomain);
  const filename = `${site.subdomain}-qr-menu.${format}`;
  const headers = { "content-disposition": `attachment; filename="${filename}"`, "cache-control": "private, no-store" };

  if (format === "svg") {
    return new Response(await qrSvg(url), { headers: { ...headers, "content-type": "image/svg+xml" } });
  }
  return new Response(new Uint8Array(await qrPng(url)), { headers: { ...headers, "content-type": "image/png" } });
}
