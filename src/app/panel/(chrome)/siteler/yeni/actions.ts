"use server";

import { z } from "zod";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { requireSuperAdmin } from "@/lib/dal";
import { reservedSubdomains, sectors, type Sector } from "@/lib/config";
import { subdomainPattern } from "@/lib/slug";
import { hasTemplate } from "@/templates/registry";
import { defaultThemes } from "@/templates/themes";

const createSiteSchema = z.object({
  name: z.string().trim().min(2, "İşletme adı en az 2 karakter olmalı.").max(80, "İşletme adı çok uzun."),
  subdomain: z
    .string()
    .trim()
    .toLowerCase()
    .regex(subdomainPattern, "Sadece küçük harf, rakam ve tire kullanın (en fazla 32 karakter)."),
  sector: z.enum(Object.keys(sectors) as [Sector, ...Sector[]], "Bir sektör seçin."),
});

export type CreateSiteState = {
  siteId?: string;
  errors?: Partial<Record<"name" | "subdomain" | "sector" | "form", string>>;
  values?: { name?: string; subdomain?: string; sector?: string };
};

export async function createSite(_prev: CreateSiteState, formData: FormData): Promise<CreateSiteState> {
  // Server action'lar ayrı bir uç nokta gibidir: kullanıcı burada tekrar doğrulanır.
  // Kayıt kapalı olduğu için siteleri sadece süper admin açar; müşteri sonradan davet edilir.
  await requireSuperAdmin();

  const values = {
    name: String(formData.get("name") ?? ""),
    subdomain: String(formData.get("subdomain") ?? ""),
    sector: String(formData.get("sector") ?? ""),
  };

  const parsed = createSiteSchema.safeParse(values);
  if (!parsed.success) {
    const errors: CreateSiteState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<CreateSiteState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { errors, values };
  }

  const { name, subdomain, sector } = parsed.data;

  if (!hasTemplate(sector)) {
    return { errors: { sector: "Bu sektörün şablonu henüz hazır değil." }, values };
  }

  if (reservedSubdomains.has(subdomain)) {
    return { errors: { subdomain: "Bu kısa ad kullanılamaz, başka bir ad seçin." }, values };
  }

  let siteId: string;
  try {
    siteId = await db.transaction(async (tx) => {
      const [site] = await tx.insert(sites).values({ name, subdomain, sector, theme: defaultThemes[sector] }).returning({ id: sites.id });
      return site.id;
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { errors: { subdomain: "Bu kısa ad başka bir site tarafından kullanılıyor." }, values };
    }
    throw error;
  }

  // Yönlendirme istemcide yapılır: server action içindeki redirect, host bazlı proxy yönlendirmesinden geçmez
  return { siteId };
}

function isUniqueViolation(error: unknown) {
  const cause = (error as { cause?: { code?: string } })?.cause ?? error;
  return (cause as { code?: string })?.code === "23505";
}
