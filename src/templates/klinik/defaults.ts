import type { SetupInput } from "../engine/setup";
import type { SectionRow } from "../engine/types";
import { klinikPresets, type KlinikPreset, type KlinikPresetKey } from "./presets";
import { klinikSections } from "./sections";

const defaultHours = [
  { gun: "Pazartesi – Cuma", saat: "09:00 – 18:00" },
  { gun: "Cumartesi", saat: "09:00 – 14:00" },
  { gun: "Pazar", saat: "Kapalı" },
];

// Sihirbaz bilgilerinden, seçilen türün örnek hizmetleriyle dolu bir site üretir
export function buildKlinikContent(siteName: string, input: SetupInput): SectionRow[] {
  const preset: KlinikPreset = klinikPresets[input.profession as KlinikPresetKey];

  const content: Record<string, { enabled: boolean; content: Record<string, unknown> }> = {
    isletme: {
      enabled: true,
      content: {
        logo: null,
        cep: input.cep,
        whatsapp: input.whatsapp,
        sabit: input.sabit,
        adres: input.adres,
        ilce: input.ilce,
        il: input.il,
        saatler: defaultHours,
        acilNotu: "",
        haritaLinki: "",
        instagram: "",
      },
    },
    hero: {
      enabled: true,
      content: { ustBaslik: `${input.ilce} · ${preset.label}`, baslik: preset.heroTitle, aciklama: preset.intro, gorsel: null },
    },
    hakkimizda: { enabled: true, content: { baslik: preset.aboutTitle, metin: preset.about, gorsel: null } },
    hizmetler: {
      enabled: true,
      content: {
        baslik: "Hizmetlerimiz",
        aciklama: "",
        liste: preset.services.filter((_, i) => input.choices.includes(i)),
      },
    },
    // Hekim bilgileri ve fotoğraflar eklenene kadar kapalı kalanlar
    hekimler: { enabled: false, content: { baslik: "Ekibimiz", aciklama: "", kisiler: [] } },
    galeri: { enabled: false, content: { baslik: "Kliniğimiz", aciklama: "", fotograflar: [] } },
    randevu: { enabled: true, content: preset.appointment },
    sss: { enabled: true, content: { baslik: "Sık Sorulan Sorular", aciklama: "", sorular: preset.faq } },
    iletisim: { enabled: true, content: { baslik: "İletişim ve Ulaşım", aciklama: `${siteName}, ${input.ilce} / ${input.il}` } },
  };

  return klinikSections.map((section, position) => ({
    key: section.key,
    position,
    enabled: content[section.key].enabled,
    content: content[section.key].content,
  }));
}
