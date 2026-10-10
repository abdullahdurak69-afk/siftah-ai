import type { Sector } from "@/lib/config";

// Sitenin ana rengi. Anahtarlar veritabanında saklanır.
export const themes = {
  turuncu: { label: "Turuncu", accent: "#f59e0b", accentHover: "#d97706", accentText: "#1c1917" },
  mavi: { label: "Mavi", accent: "#3b82f6", accentHover: "#2563eb", accentText: "#ffffff" },
  yesil: { label: "Yeşil", accent: "#10b981", accentHover: "#059669", accentText: "#022c22" },
  kirmizi: { label: "Kırmızı", accent: "#ef4444", accentHover: "#dc2626", accentText: "#ffffff" },
  mor: { label: "Mor", accent: "#8b5cf6", accentHover: "#7c3aed", accentText: "#ffffff" },
  bordo: { label: "Bordo", accent: "#9f1239", accentHover: "#881337", accentText: "#ffffff" },
  zeytin: { label: "Zeytin", accent: "#4d7c0f", accentHover: "#3f6212", accentText: "#ffffff" },
  pembe: { label: "Gül kurusu", accent: "#be185d", accentHover: "#9d174d", accentText: "#ffffff" },
  turkuaz: { label: "Turkuaz", accent: "#0d9488", accentHover: "#0f766e", accentText: "#ffffff" },
  lacivert: { label: "Lacivert", accent: "#1d4ed8", accentHover: "#1e40af", accentText: "#ffffff" },
  siyah: { label: "Siyah", accent: "#1c1917", accentHover: "#000000", accentText: "#ffffff" },
} as const;

export type ThemeKey = keyof typeof themes;

export function getTheme(key: string) {
  return themes[key as ThemeKey] ?? themes.turuncu;
}

// Yeni açılan sitenin sektöre uygun başlangıç rengi
export const defaultThemes: Record<Sector, ThemeKey> = {
  usta: "turuncu",
  restoran: "bordo",
  kuafor: "pembe",
  klinik: "turkuaz",
};
