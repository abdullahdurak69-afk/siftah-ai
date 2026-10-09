"use server";

import { z } from "zod";
import { db } from "@/db";
import { siteMembers, sites } from "@/db/schema";
import { requireUser } from "@/lib/dal";
import { reservedSubdomains, sectors, type Sector } from "@/lib/config";
import { subdomainPattern } from "@/lib/slug";

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
  done?: boolean;
  errors?: Partial<Record<"name" | "subdomain" | "sector" | "form", string>>;
  values?: { name?: string; subdomain?: string; sector?: string };
};

export async function createSite(_prev: CreateSiteState, formData: FormData): Promise<CreateSiteState> {
  // Server action'lar ayrı bir uç nokta gibidir: kullanıcı burada tekrar doğrulanır
  const user = await requireUser();

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

  if (reservedSubdomains.has(subdomain)) {
    return { errors: { subdomain: "Bu adres kullanılamaz, başka bir adres seçin." }, values };
  }

  try {
    await db.transaction(async (tx) => {
      const [site] = await tx.insert(sites).values({ name, subdomain, sector }).returning({ id: sites.id });
      // Süper admin müşteri adına açıyorsa üye olmaz; müşteri sonradan davet edilir (5. faz)
      if (!user.isSuperAdmin) {
        await tx.insert(siteMembers).values({ siteId: site.id, userId: user.id, role: "owner" });
      }
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { errors: { subdomain: "Bu adres başka bir site tarafından kullanılıyor." }, values };
    }
    throw error;
  }

  // Yönlendirme istemcide yapılır: server action içindeki redirect, host bazlı proxy yönlendirmesinden geçmez
  return { done: true };
}

function isUniqueViolation(error: unknown) {
  const cause = (error as { cause?: { code?: string } })?.cause ?? error;
  return (cause as { code?: string })?.code === "23505";
}
