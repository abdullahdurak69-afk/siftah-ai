import type { SetupInput } from "../engine/setup";
import type { SectionRow } from "../engine/types";
import { restoranPresets, type RestoranPreset, type RestoranPresetKey } from "./presets";
import { restoranSections } from "./sections";

const defaultHours = [
  { gun: "Pazartesi – Cumartesi", saat: "10:00 – 22:00" },
  { gun: "Pazar", saat: "11:00 – 22:00" },
];

// Sihirbaz bilgilerinden, seçilen türün örnek menüsüyle dolu bir site üretir. Menü fiyatsız gelir.
export function buildRestoranContent(siteName: string, input: SetupInput): SectionRow[] {
  const preset: RestoranPreset = restoranPresets[input.profession as RestoranPresetKey];

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
        yemeksepeti: "",
        getir: "",
        trendyol: "",
        googlePuan: null,
        yorumSayisi: null,
      },
    },
    hero: {
      enabled: true,
      content: { ustBaslik: `${input.ilce} · ${preset.label}`, baslik: preset.heroTitle, aciklama: preset.intro, gorsel: null },
    },
    ozellikler: { enabled: true, content: { liste: preset.features } },
    hakkimizda: { enabled: true, content: { baslik: preset.aboutTitle, metin: preset.about, gorsel: null } },
    menu: {
      enabled: true,
      content: {
        baslik: "Menümüz",
        aciklama: "",
        fiyatlariGoster: true,
        not: "Fiyatlarımıza KDV dahildir.",
        kategoriler: preset.categories
          .filter((_, i) => input.choices.includes(i))
          .map((c) => ({
            ad: c.ad,
            aciklama: c.aciklama ?? "",
            urunler: c.urunler.map((u) => ({ ad: u.ad, aciklama: u.aciklama, fiyat: null, fotograf: null, etiketler: u.etiketler ?? [] })),
          })),
      },
    },
    // Fotoğraf yüklenene kadar kapalı kalır
    galeri: { enabled: false, content: { baslik: "Galeri", aciklama: "", fotograflar: [] } },
    rezervasyon: { enabled: true, content: preset.reservation },
    // Yorumlar asla örnek olarak üretilmez
    yorumlar: { enabled: false, content: { baslik: "Misafirlerimiz Ne Diyor?", yorumlar: [], tumYorumlarLinki: "" } },
    sss: { enabled: true, content: { baslik: "Sık Sorulan Sorular", aciklama: "", sorular: preset.faq } },
    iletisim: { enabled: true, content: { baslik: "Bize Ulaşın", aciklama: `${siteName}, ${input.ilce} / ${input.il}` } },
  };

  return restoranSections.map((section, position) => ({
    key: section.key,
    position,
    enabled: content[section.key].enabled,
    content: content[section.key].content,
  }));
}
