"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { domains } from "@/db/schema";
import { findManageableSite } from "@/lib/dal";
import { domainsCacheTag, normalizeDomainInput, runDomainCheck } from "@/lib/domains";
import { siteCacheTag } from "@/lib/sites";

export type DomainActionResult =
  | { ok: true; verified?: boolean; problems?: string[]; warnings?: string[] }
  | { ok: false; message: string };

const noAccess = { ok: false, message: "Domain ayarlarını sadece site sahibi değiştirebilir." } as const;

function refreshCaches(subdomain: string) {
  updateTag(domainsCacheTag);
  updateTag(siteCacheTag(subdomain));
}

export async function addDomain(siteId: string, input: string): Promise<DomainActionResult> {
  const site = (await findManageableSite(siteId))?.site;
  if (!site) return noAccess;

  const normalized = normalizeDomainInput(input);
  if (!normalized.ok) return { ok: false, message: normalized.error };

  const [existing] = await db.select({ id: domains.id }).from(domains).where(eq(domains.siteId, site.id));
  if (existing) return { ok: false, message: "Bu siteye zaten bir domain bağlı. Önce onu kaldırın." };

  let id: string;
  try {
    [{ id }] = await db
      .insert(domains)
      .values({ siteId: site.id, hostname: normalized.value.hostname })
      .returning({ id: domains.id });
  } catch (error) {
    const code = (error as { cause?: { code?: string } })?.cause?.code;
    if (code === "23505") return { ok: false, message: "Bu domain başka bir siteye bağlı." };
    throw error;
  }

  // DNS daha önce ayarlandıysa domain hemen doğrulanır
  const result = await runDomainCheck(id);
  if (result?.newlyVerified) refreshCaches(site.subdomain);
  return { ok: true, verified: result?.check.verified, problems: result?.check.problems, warnings: result?.check.warnings };
}

export async function checkDomain(siteId: string): Promise<DomainActionResult> {
  const site = (await findManageableSite(siteId))?.site;
  if (!site) return noAccess;

  const [domain] = await db.select({ id: domains.id }).from(domains).where(eq(domains.siteId, site.id));
  if (!domain) return { ok: false, message: "Bağlı bir domain yok." };

  const result = await runDomainCheck(domain.id);
  if (result?.newlyVerified) refreshCaches(site.subdomain);
  return { ok: true, verified: result?.check.verified, problems: result?.check.problems, warnings: result?.check.warnings };
}

export async function removeDomain(siteId: string): Promise<DomainActionResult> {
  const site = (await findManageableSite(siteId))?.site;
  if (!site) return noAccess;

  await db.delete(domains).where(eq(domains.siteId, site.id));
  refreshCaches(site.subdomain);
  return { ok: true };
}
