"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { siteSections, sites } from "@/db/schema";
import { findEditableSite } from "@/lib/dal";
import { getCatalog } from "@/templates/catalog";
import { flattenErrors } from "@/templates/engine/fields";
import { setupSchema } from "@/templates/engine/setup";
import type { ActionResult } from "../actions";

export async function completeSetup(siteId: string, input: unknown): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return { ok: false, message: "Bu siteyi düzenleme yetkiniz yok." };
  const catalog = getCatalog(site.sector);
  if (!catalog) return { ok: false, message: "Bu sektörün şablonu henüz hazır değil." };

  const parsed = setupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Bazı alanlarda hata var.", errors: flattenErrors(parsed.error) };
  }
  const preset = catalog.presets.find((p) => p.key === parsed.data.profession);
  if (!preset) return { ok: false, message: "Bir tür seçin.", errors: { profession: "Bir tür seçin." } };
  if (parsed.data.choices.some((i) => i >= preset.choices.length)) {
    return { ok: false, message: "Geçersiz seçim.", errors: { choices: "Seçimlerinizi kontrol edin." } };
  }

  const rows = catalog.build(site.name, parsed.data);

  // Kurulum içeriği baştan üretir; tekrar çalıştırılırsa mevcut içerik sıfırlanır
  await db.transaction(async (tx) => {
    await tx.delete(siteSections).where(eq(siteSections.siteId, site.id));
    await tx.insert(siteSections).values(rows.map((row) => ({ ...row, siteId: site.id })));
    await tx
      .update(sites)
      .set({ profession: parsed.data.profession, setupCompletedAt: new Date(), contentUpdatedAt: sql`now()` })
      .where(eq(sites.id, site.id));
  });

  // Ziyaretçiler yayındaki sürümü görür; kurulum sadece taslağı değiştirir
  return { ok: true };
}
