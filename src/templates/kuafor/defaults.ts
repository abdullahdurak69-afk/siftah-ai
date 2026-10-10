import type { SetupInput } from "../engine/setup";
import type { SectionRow } from "../engine/types";
import { kuaforPresets, type KuaforPreset, type KuaforPresetKey } from "./presets";
import { kuaforSections } from "./sections";

const defaultHours = [
  { gun: "Salı – Cumartesi", saat: "10:00 – 20:00" },
  { gun: "Pazar", saat: "11:00 – 18:00" },
  { gun: "Pazartesi", saat: "Kapalı" },
];

// Sihirbaz bilgilerinden, seçilen türün örnek hizmet listesiyle dolu bir site üretir. Fiyatlar boş gelir.
export function buildKuaforContent(siteName: string, input: SetupInput): SectionRow[] {
  const preset: KuaforPreset = kuaforPresets[input.profession as KuaforPresetKey];

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
        haritaLinki: "",
        instagram: "",
        googlePuan: null,
        yorumSayisi: null,
      },
    },
    hero: {
      enabled: true,
      content: { ustBaslik: `${input.ilce} · ${preset.label}`, baslik: preset.heroTitle, aciklama: preset.intro, gorsel: null },
    },
    hizmetler: {
      enabled: true,
      content: {
        baslik: "Hizmetlerimiz",
        aciklama: "",
        fiyatlariGoster: true,
        not: "",
        kategoriler: preset.categories
          .filter((_, i) => input.choices.includes(i))
          .map((c) => ({
            ikon: c.ikon,
            ad: c.ad,
            hizmetler: c.hizmetler.map((h) => ({ ad: h.ad, aciklama: h.aciklama ?? "", sure: h.sure ?? "", fiyat: null, fiyatNotu: "" })),
          })),
      },
    },
    // Fotoğraf ve kişi bilgisi eklenene kadar kapalı kalanlar
    ekip: { enabled: false, content: { baslik: "Ekibimiz", aciklama: "", kisiler: [] } },
    oncesonra: { enabled: false, content: { baslik: "Önce / Sonra", aciklama: "", ciftler: [] } },
    galeri: { enabled: false, content: { baslik: "Galeri", aciklama: "", fotograflar: [] } },
    randevu: { enabled: true, content: preset.appointment },
    yorumlar: { enabled: false, content: { baslik: "Müşterilerimiz Ne Diyor?", yorumlar: [], tumYorumlarLinki: "" } },
    sss: { enabled: true, content: { baslik: "Sık Sorulan Sorular", aciklama: "", sorular: preset.faq } },
    iletisim: { enabled: true, content: { baslik: "Bize Ulaşın", aciklama: `${siteName}, ${input.ilce} / ${input.il}` } },
  };

  return kuaforSections.map((section, position) => ({
    key: section.key,
    position,
    enabled: content[section.key].enabled,
    content: content[section.key].content,
  }));
}
