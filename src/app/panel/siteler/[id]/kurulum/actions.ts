"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSections, sites } from "@/db/schema";
import { findEditableSite } from "@/lib/dal";
import { siteCacheTag } from "@/lib/sites";
import { flattenErrors } from "@/templates/engine/fields";
import { buildUstaContent, ustaSetupSchema } from "@/templates/usta/defaults";
import type { ActionResult } from "../actions";

export async function completeSetup(siteId: string, input: unknown): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return { ok: false, message: "Bu siteyi düzenleme yetkiniz yok." };
  if (site.sector !== "usta") return { ok: false, message: "Bu sektörün şablonu henüz hazır değil." };

  const parsed = ustaSetupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Bazı alanlarda hata var.", errors: flattenErrors(parsed.error) };
  }

  const rows = buildUstaContent(site.name, parsed.data);

  // Kurulum içeriği baştan üretir; tekrar çalıştırılırsa mevcut içerik sıfırlanır
  await db.transaction(async (tx) => {
    await tx.delete(siteSections).where(eq(siteSections.siteId, site.id));
    await tx.insert(siteSections).values(rows.map((row) => ({ ...row, siteId: site.id })));
    await tx
      .update(sites)
      .set({ profession: parsed.data.profession, setupCompletedAt: new Date() })
      .where(eq(sites.id, site.id));
  });

  updateTag(siteCacheTag(site.subdomain));
  return { ok: true };
}
