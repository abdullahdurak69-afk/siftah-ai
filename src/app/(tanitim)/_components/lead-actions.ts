"use server";

import { headers } from "next/headers";
import { leadRateLimited, leadSchema, saveLead } from "@/lib/leads";

export type LeadFormState = {
  ok?: boolean;
  errors?: Partial<Record<"name" | "phone" | "form", string>>;
  values?: Record<string, string>;
};

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const values = Object.fromEntries(
    ["name", "phone", "businessName", "sector", "message", "source"].map((k) => [k, String(formData.get(k) ?? "")]),
  );

  // Botların doldurduğu gizli alan: dolu gelirse sessizce başarılı say
  if (String(formData.get("website") ?? "") !== "") return { ok: true };

  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    const errors: LeadFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if ((key === "name" || key === "phone") && !errors[key]) errors[key] = issue.message;
    }
    return { errors: Object.keys(errors).length ? errors : { form: "Bilgileri kontrol edin." }, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "yerel";
  if (leadRateLimited(ip, Date.now())) {
    return { errors: { form: "Çok fazla başvuru gönderildi. Lütfen biraz sonra tekrar deneyin veya bizi arayın." }, values };
  }

  await saveLead(parsed.data);
  return { ok: true };
}
