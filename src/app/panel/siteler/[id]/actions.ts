"use server";

import { updateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSections, sites } from "@/db/schema";
import { findEditableSite } from "@/lib/dal";
import { siteCacheTag } from "@/lib/sites";
import { flattenErrors, objectSchema } from "@/templates/engine/fields";
import { getSectionDef } from "@/templates/registry";
import { themes } from "@/templates/themes";

export type ActionResult = { ok: true } | { ok: false; message?: string; errors?: Record<string, string> };

export async function saveSection(siteId: string, key: string, content: unknown): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return { ok: false, message: "Bu siteyi düzenleme yetkiniz yok." };

  const def = getSectionDef(site.sector, key);
  if (!def) return { ok: false, message: "Bölüm bulunamadı." };

  const parsed = objectSchema(def.fields).safeParse(content);
  if (!parsed.success) {
    return { ok: false, message: "Bazı alanlarda hata var.", errors: flattenErrors(parsed.error) };
  }

  await db
    .update(siteSections)
    .set({ content: parsed.data })
    .where(and(eq(siteSections.siteId, site.id), eq(siteSections.key, key)));

  updateTag(siteCacheTag(site.subdomain));
  return { ok: true };
}

export async function setSectionEnabled(siteId: string, key: string, enabled: boolean): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return { ok: false, message: "Bu siteyi düzenleme yetkiniz yok." };

  const def = getSectionDef(site.sector, key);
  if (!def?.optional) return { ok: false, message: "Bu bölüm kapatılamaz." };

  await db
    .update(siteSections)
    .set({ enabled })
    .where(and(eq(siteSections.siteId, site.id), eq(siteSections.key, key)));

  updateTag(siteCacheTag(site.subdomain));
  return { ok: true };
}

export async function setTheme(siteId: string, theme: string): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return { ok: false, message: "Bu siteyi düzenleme yetkiniz yok." };
  if (!(theme in themes)) return { ok: false, message: "Geçersiz renk." };

  await db.update(sites).set({ theme }).where(eq(sites.id, site.id));
  updateTag(siteCacheTag(site.subdomain));
  return { ok: true };
}
