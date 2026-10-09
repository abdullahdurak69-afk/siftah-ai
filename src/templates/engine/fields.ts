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
  | (Base & { type: "icon" })
  | (Base & {
      type: "list";
      itemLabel: string;
      max?: number;
      fields: Fields;
      // Liste öğesi kapalıyken başlıkta gösterilecek alan
      summaryField?: string;
    });

export type Fields = Record<string, FieldDef>;

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
      return null;
    case "tags":
    case "list":
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
