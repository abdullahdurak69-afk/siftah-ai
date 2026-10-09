import { revalidateTag } from "next/cache";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { domains } from "@/db/schema";
import { domainsCacheTag, runDomainCheck } from "@/lib/domains";
import { siteCacheTag } from "@/lib/sites";

// Bekleyen domain'leri kontrol eder. Sunucuda cron ile 10 dakikada bir çağrılır:
//   curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://app:3000/api/cron/domains
// Son 14 gün içinde eklenen ve hâlâ bekleyen domain'ler kontrol edilir.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Yetkisiz", { status: 403 });
  }

  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const pending = await db
    .select({ id: domains.id })
    .from(domains)
    .where(and(eq(domains.status, "pending"), gt(domains.createdAt, since)));

  const verified: string[] = [];
  for (const { id } of pending) {
    const result = await runDomainCheck(id);
    if (result?.newlyVerified) {
      verified.push(result.hostname);
      revalidateTag(domainsCacheTag, "max");
      revalidateTag(siteCacheTag(result.subdomain), "max");
    }
  }

  return Response.json({ checked: pending.length, verified });
}
