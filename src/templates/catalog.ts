import type { Sector } from "@/lib/config";
import type { PresetOption, SetupInput, WizardCopy } from "./engine/setup";
import type { SectionRow } from "./engine/types";
import { buildRestoranContent } from "./restoran/defaults";
import { restoranPresets } from "./restoran/presets";
import { buildUstaContent } from "./usta/defaults";
import { presets as ustaPresets } from "./usta/presets";

// Kurulum sihirbazı için şablon kataloğu: türler (ön ayarlar), sihirbaz metinleri ve içerik üretici.
// Sunucu tarafında kullanılır; örnek metinler istemciye sadece özet olarak (PresetOption) gider.

type Catalog = {
  presets: PresetOption[];
  wizard: WizardCopy;
  build: (siteName: string, input: SetupInput) => SectionRow[];
};

const catalogs: Partial<Record<Sector, Catalog>> = {
  usta: {
    presets: Object.entries(ustaPresets).map(([key, p]) => ({
      key,
      label: p.label,
      icon: p.services[0]?.ikon ?? "anahtar",
      choices: p.services.map((s) => ({ ikon: s.ikon, baslik: s.baslik })),
    })),
    wizard: {
      presetStep: "Meslek",
      presetTitle: "{ad} ne iş yapıyor?",
      presetHint: "Seçtiğiniz mesleğe göre hizmetler ve sık sorulan sorular hazır gelir.",
      choicesStep: "Hizmetler",
      choicesTitle: "Hangi hizmetleri veriyorsunuz?",
      choicesHint: "Açıklamaları daha sonra düzenleyebilir, yeni hizmet ekleyebilirsiniz.",
      areas: true,
    },
    build: buildUstaContent,
  },
  restoran: {
    presets: Object.entries(restoranPresets).map(([key, p]) => ({
      key,
      label: p.label,
      icon: p.icon,
      choices: p.categories.map((c) => ({ ikon: c.ikon, baslik: c.ad })),
    })),
    wizard: {
      presetStep: "Tür",
      presetTitle: "{ad} nasıl bir işletme?",
      presetHint: "Seçtiğiniz türe göre örnek menü, tanıtım metni ve sık sorulan sorular hazır gelir.",
      choicesStep: "Menü",
      choicesTitle: "Menünüzde hangi kategoriler olsun?",
      choicesHint: "Kategoriler örnek ürünlerle gelir; ürünleri ve fiyatları daha sonra kendinize göre düzenlersiniz.",
      areas: false,
    },
    build: buildRestoranContent,
  },
};

export function getCatalog(sector: Sector) {
  return catalogs[sector];
}

// Panelde gösterilen tür adı: "TV ve Uydu Servisi", "Kafe"...
export function presetLabel(sector: Sector, profession: string | null) {
  return catalogs[sector]?.presets.find((p) => p.key === profession)?.label ?? null;
}
