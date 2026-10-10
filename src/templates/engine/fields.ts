import { z } from "zod";

// Şablon alanlarının tanımı. Aynı tanımdan hem panel formu hem de Zod doğrulama şeması üretilir.
type Base = { label: string; hint?: string };

export type FieldDef =
  | (Base & { type: "text"; placeholder?: string; required?: boolean; max?: number })
  | (Base & { type: "textarea"; placeholder?: string; required?: boolean; max?: number })
  | (Base & { type: "phone"; placeholder?: string; required?: boolean })
  | (Base & { type: "url"; placeholder?: string; required?: boolean })
  | (Base & { type: "number"; placeholder?: string; min?: number; max?: number; step?: number })
  | (Base & { type: "tags"; placeholder?: string; max?: number })
  // set: panelde gösterilecek ikon grubu (src/templates/icons.tsx iconSets); yoksa hepsi
  | (Base & { type: "icon"; set?: "usta" | "restoran" | "kuafor" | "klinik" })
  // Onay kutusu (ör. "Fiyatları göster")
  | (Base & { type: "boolean" })
  | (Base & { type: "image"; aspect?: "wide" | "square" | "logo" })
  | (Base & { type: "images"; max?: number })
  | (Base & {
      type: "list";
      itemLabel: string;
      max?: number;
      fields: Fields;
      // Liste öğesi kapalıyken başlıkta gösterilecek alan
      summaryField?: string;
    });

export type Fields = Record<string, FieldDef>;

// Yüklenen bir fotoğrafın içerikte saklanan hali. src/srcSmall kaydederken veritabanından yeniden üretilir.
export type ImageValue = { id: string; src: string; srcSmall: string; width: number; height: number };

const imageSchema = z.object({
  id: z.uuid(),
  src: z.string(),
  srcSmall: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const phonePattern = /^[0-9+()\s-]{7,20}$/;

function textSchema(required: boolean | undefined, max: number, label: string) {
  const base = z.string().trim().max(max, `${label} en fazla ${max} karakter olabilir.`);
  return required ? base.min(1, `${label} zorunlu.`) : base;
}

export function fieldSchema(field: FieldDef): z.ZodType {
  switch (field.type) {
    case "text":
      return textSchema(field.required, field.max ?? 160, field.label);
    case "textarea":
      return textSchema(field.required, field.max ?? 1000, field.label);
    case "phone": {
      const base = z.string().trim();
      return field.required
        ? base.regex(phonePattern, "Geçerli bir telefon numarası girin.")
        : base.refine((v) => v === "" || phonePattern.test(v), "Geçerli bir telefon numarası girin.");
    }
    case "url": {
      const base = z.string().trim();
      const valid = (v: string) => z.url({ protocol: /^https?$/ }).safeParse(v).success;
      return field.required
        ? base.refine(valid, "Geçerli bir adres girin (https:// ile başlamalı).")
        : base.refine((v) => v === "" || valid(v), "Geçerli bir adres girin (https:// ile başlamalı).");
    }
    case "number": {
      let num = z.number(`${field.label} bir sayı olmalı.`);
      if (field.min !== undefined) num = num.min(field.min, `${field.label} en az ${field.min} olabilir.`);
      if (field.max !== undefined) num = num.max(field.max, `${field.label} en fazla ${field.max} olabilir.`);
      return num.nullable();
    }
    case "tags":
      return z
        .array(z.string().trim().min(1).max(80))
        .max(field.max ?? 50, `En fazla ${field.max ?? 50} öğe eklenebilir.`);
    case "icon":
      return z.string().max(40);
    case "boolean":
      return z.boolean();
    case "image":
      return imageSchema.nullable();
    case "images":
      return z.array(imageSchema).max(field.max ?? 24, `En fazla ${field.max ?? 24} fotoğraf eklenebilir.`);
    case "list":
      return z
        .array(objectSchema(field.fields))
        .max(field.max ?? 30, `En fazla ${field.max ?? 30} ${field.itemLabel.toLocaleLowerCase("tr")} eklenebilir.`);
  }
}

export function objectSchema(fields: Fields) {
  return z.object(Object.fromEntries(Object.entries(fields).map(([key, f]) => [key, fieldSchema(f)])));
}

// Boş bir form değeri üretir (yeni liste öğesi eklerken kullanılır)
export function emptyValue(field: FieldDef): unknown {
  switch (field.type) {
    case "number":
    case "image":
      return null;
    case "boolean":
      return false;
    case "tags":
    case "list":
    case "images":
      return [];
    default:
      return "";
  }
}

export function emptyObject(fields: Fields) {
  return Object.fromEntries(Object.entries(fields).map(([key, f]) => [key, emptyValue(f)]));
}

// Zod hatalarını "liste.2.baslik" gibi yollara göre düz bir sözlüğe çevirir
export function flattenErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    errors[path] ??= issue.message;
  }
  return errors;
}

// İçerikteki tüm fotoğrafları bulup her birini fn ile dönüştürür (null dönerse fotoğraf çıkarılır).
// Kaydederken fotoğrafların bu siteye ait olduğunu doğrulamak ve adreslerini sunucuda üretmek için kullanılır.
export function mapImages(
  fields: Fields,
  value: Record<string, unknown>,
  fn: (image: ImageValue) => ImageValue | null,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...value };
  for (const [key, field] of Object.entries(fields)) {
    const v = value[key];
    if (field.type === "image") out[key] = v ? fn(v as ImageValue) : null;
    else if (field.type === "images") out[key] = ((v as ImageValue[]) ?? []).map(fn).filter(Boolean);
    else if (field.type === "list")
      out[key] = ((v as Record<string, unknown>[]) ?? []).map((item) => mapImages(field.fields, item, fn));
  }
  return out;
}

export function collectImageIds(fields: Fields, value: Record<string, unknown>) {
  const ids = new Set<string>();
  mapImages(fields, value, (image) => {
    ids.add(image.id);
    return image;
  });
  return [...ids];
}
