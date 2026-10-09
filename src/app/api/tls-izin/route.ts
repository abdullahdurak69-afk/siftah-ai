import { timingSafeEqual } from "node:crypto";
import { findSiteByHost } from "@/lib/domains";

// Caddy, bir custom domain için SSL sertifikası almadan önce buraya sorar (on_demand_tls "ask").
// Sadece panelde eklenmiş ve DNS'i doğrulanmış domain'lere sertifika verilir; böylece
// sunucuya rastgele domain yönlendirerek sertifika kotası tüketilemez.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.CADDY_ASK_SECRET ?? "";
  const key = url.searchParams.get("key") ?? "";

  if (!secret || key.length !== secret.length || !timingSafeEqual(Buffer.from(key), Buffer.from(secret))) {
    return new Response("Yetkisiz", { status: 403 });
  }

  const domain = (url.searchParams.get("domain") ?? "").toLowerCase();
  const match = domain ? await findSiteByHost(domain) : null;
  return match ? new Response("ok") : new Response("Kayıtlı değil", { status: 404 });
}
