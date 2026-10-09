// Sitenin ana rengi. Anahtarlar veritabanında saklanır.
export const themes = {
  turuncu: { label: "Turuncu", accent: "#f59e0b", accentHover: "#d97706", accentText: "#1c1917" },
  mavi: { label: "Mavi", accent: "#3b82f6", accentHover: "#2563eb", accentText: "#ffffff" },
  yesil: { label: "Yeşil", accent: "#10b981", accentHover: "#059669", accentText: "#022c22" },
  kirmizi: { label: "Kırmızı", accent: "#ef4444", accentHover: "#dc2626", accentText: "#ffffff" },
  mor: { label: "Mor", accent: "#8b5cf6", accentHover: "#7c3aed", accentText: "#ffffff" },
} as const;

export type ThemeKey = keyof typeof themes;

export function getTheme(key: string) {
  return themes[key as ThemeKey] ?? themes.turuncu;
}
