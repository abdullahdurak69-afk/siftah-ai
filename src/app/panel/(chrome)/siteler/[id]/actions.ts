"use server";

import { randomBytes } from "node:crypto";
import { updateTag } from "next/cache";
import { and, desc, eq, notInArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { previewLinks, siteSections, siteVersions, sites, type SiteSnapshot } from "@/db/schema";
import { findEditableSite, getCurrentUser } from "@/lib/dal";
import { rootUrl } from "@/lib/config";
import { resolveSiteImages } from "@/lib/images";
import { getDraftSections, siteCacheTag } from "@/lib/sites";
import { emptyObject, flattenErrors, objectSchema } from "@/templates/engine/fields";
import { getSectionDef, getTemplate } from "@/templates/registry";
import { themes } from "@/templates/themes";

export type ActionResult =
  | { ok: true; url?: string }
  | { ok: false; message?: string; errors?: Record<string, string> };

const noAccess: ActionResult = { ok: false, message: "Bu siteyi düzenleme yetkiniz yok." };
const versionsToKeep = 10;
const previewLinkDays = 7;

// Taslakta değişiklik olduğunu işaretler. Zaman damgaları yayın sürümüyle aynı saatten (veritabanı) gelir.
function touch(siteId: string) {
  return db.update(sites).set({ contentUpdatedAt: sql`now()` }).where(eq(sites.id, siteId));
}

export async function saveSection(siteId: string, key: string, content: unknown): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return noAccess;

  const def = getSectionDef(site.sector, key);
  if (!def) return { ok: false, message: "Bölüm bulunamadı." };

  const parsed = objectSchema(def.fields).safeParse(content);
  if (!parsed.success) {
    return { ok: false, message: "Bazı alanlarda hata var.", errors: flattenErrors(parsed.error) };
  }

  const verified = await resolveSiteImages(site.id, def.fields, parsed.data);

  await db
    .update(siteSections)
    .set({ content: verified })
    .where(and(eq(siteSections.siteId, site.id), eq(siteSections.key, key)));
  await touch(site.id);
  return { ok: true };
}

export async function setSectionEnabled(siteId: string, key: string, enabled: boolean): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return noAccess;

  const def = getSectionDef(site.sector, key);
  if (!def?.optional) return { ok: false, message: "Bu bölüm kapatılamaz." };

  await db
    .update(siteSections)
    .set({ enabled })
    .where(and(eq(siteSections.siteId, site.id), eq(siteSections.key, key)));
  await touch(site.id);
  return { ok: true };
}

export async function setTheme(siteId: string, theme: string): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return noAccess;
  if (!(theme in themes)) return { ok: false, message: "Geçersiz renk." };

  await db.update(sites).set({ theme, contentUpdatedAt: sql`now()` }).where(eq(sites.id, site.id));
  return { ok: true };
}

// Taslağın anlık görüntüsünü yeni bir sürüm olarak kaydeder ve siteyi yayına alır
export async function publishSite(siteId: string): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return noAccess;
  const user = await getCurrentUser();

  const template = getTemplate(site.sector);
  if (!template || !site.setupCompletedAt) return { ok: false, message: "Önce kurulumu tamamlayın." };

  const draft = await getDraftSections(site.id);
  const invalid: string[] = [];
  const sections: SiteSnapshot["sections"] = [];

  for (const def of template.sections) {
    const row = draft.find((s) => s.key === def.key);
    if (!row) continue;
    const parsed = objectSchema(def.fields).safeParse({ ...emptyObject(def.fields), ...row.content });
    if (!parsed.success) {
      // Kapalı bölümlerdeki eksikler yayını engellemez
      if (row.enabled || def.kind === "settings") invalid.push(def.title);
      continue;
    }
    sections.push({ key: row.key, position: row.position, enabled: row.enabled, content: parsed.data });
  }

  if (invalid.length > 0) {
    return { ok: false, message: `Yayınlamadan önce şu bölümleri tamamlayın: ${invalid.join(", ")}.` };
  }

  const snapshot: SiteSnapshot = { name: site.name, theme: site.theme, profession: site.profession, sections };

  await db.transaction(async (tx) => {
    const [version] = await tx
      .insert(siteVersions)
      .values({ siteId: site.id, snapshot, publishedBy: user?.id })
      .returning({ id: siteVersions.id });

    await tx
      .update(sites)
      .set({ publishedVersionId: version.id, status: site.status === "suspended" ? "suspended" : "published" })
      .where(eq(sites.id, site.id));

    // Son sürümleri sakla, eskileri sil (geri dönüş ekranı MVP sonrasında gelecek)
    const keep = tx
      .select({ id: siteVersions.id })
      .from(siteVersions)
      .where(eq(siteVersions.siteId, site.id))
      .orderBy(desc(siteVersions.createdAt))
      .limit(versionsToKeep);
    await tx.delete(siteVersions).where(and(eq(siteVersions.siteId, site.id), notInArray(siteVersions.id, keep)));
  });

  updateTag(siteCacheTag(site.subdomain));
  return { ok: true };
}

// Taslağı yayındaki sürüme geri döndürür
export async function discardChanges(siteId: string): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return noAccess;
  if (!site.publishedVersionId) return { ok: false, message: "Henüz yayınlanmış bir sürüm yok." };

  const [version] = await db.select().from(siteVersions).where(eq(siteVersions.id, site.publishedVersionId));
  if (!version) return { ok: false, message: "Yayındaki sürüm bulunamadı." };

  await db.transaction(async (tx) => {
    await tx.delete(siteSections).where(eq(siteSections.siteId, site.id));
    if (version.snapshot.sections.length > 0) {
      await tx.insert(siteSections).values(version.snapshot.sections.map((s) => ({ ...s, siteId: site.id })));
    }
    await tx
      .update(sites)
      .set({ theme: version.snapshot.theme, contentUpdatedAt: version.createdAt })
      .where(eq(sites.id, site.id));
  });

  return { ok: true };
}

export async function createPreviewLink(siteId: string): Promise<ActionResult> {
  const site = await findEditableSite(siteId);
  if (!site) return noAccess;
  const user = await getCurrentUser();

  const token = randomBytes(24).toString("base64url");
  await db.insert(previewLinks).values({
    siteId: site.id,
    token,
    expiresAt: sql`now() + make_interval(days => ${previewLinkDays})`,
    createdBy: user?.id,
  });

  return { ok: true, url: `${rootUrl}/onizleme/${token}` };
}
