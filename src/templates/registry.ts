import type { Sector } from "@/lib/config";
import type { SectionDef } from "./engine/types";
import { restoranSections } from "./restoran/sections";
import { ustaSections } from "./usta/sections";

// Hazır olan şablonların bölüm tanımları. İstemci bileşenleri de kullandığı için burada sadece
// alan tanımları durur; tasarım src/templates/render.tsx, kurulum src/templates/catalog.ts içinde.
const templates: Partial<Record<Sector, { sections: SectionDef[] }>> = {
  usta: { sections: ustaSections },
  restoran: { sections: restoranSections },
};

export function getTemplate(sector: Sector) {
  return templates[sector];
}

export function getSectionDef(sector: Sector, key: string) {
  return templates[sector]?.sections.find((s) => s.key === key);
}

export function hasTemplate(sector: Sector) {
  return sector in templates;
}
