import type { Sector } from "@/lib/config";
import type { SectionDef } from "./engine/types";
import { ustaSections } from "./usta/sections";

// Hazır olan şablonlar. Restoran, kuaför ve klinik 6. fazda eklenecek.
const templates: Partial<Record<Sector, { sections: SectionDef[] }>> = {
  usta: { sections: ustaSections },
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
