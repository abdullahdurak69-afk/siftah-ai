import { locative } from "@/lib/turkish";
import type { SetupInput } from "../engine/setup";
import type { SectionRow } from "../engine/types";
import { noAuthorizedService, presets, type PresetKey } from "./presets";
import { ustaSections } from "./sections";

// Sihirbaz bilgilerinden, meslek ön ayarındaki örnek metinlerle dolu bir site üretir
export function buildUstaContent(siteName: string, input: SetupInput): SectionRow[] {
  const preset = presets[input.profession as PresetKey];
  const bolgeler = input.bolgeler.length > 0 ? input.bolgeler : [input.ilce];

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
        calismaSaatleri: "",
        haritaLinki: "",
        googlePuan: null,
        yorumSayisi: null,
      },
    },
    hero: {
      enabled: true,
      content: {
        baslikOn: locative(input.ilce),
        baslikVurgu: preset.mainService,
        aciklama: preset.intro,
        kartBaslik: `Neden ${siteName}?`,
        kartMaddeleri: preset.whyUs,
        gorsel: null,
      },
    },
    one_cikanlar: { enabled: true, content: { kutular: preset.highlights } },
    hizmetler: {
      enabled: true,
      content: {
        baslik: "Hizmetlerimiz",
        aciklama: `${input.ilce} ve çevresinde verdiğimiz hizmetler.`,
        liste: preset.services.filter((_, i) => input.choices.includes(i)),
      },
    },
    // Fotoğraf yüklenene kadar kapalı kalır
    galeri: { enabled: false, content: { baslik: "Yaptığımız İşler", aciklama: "", fotograflar: [] } },
    markalar: {
      enabled: true,
      content: { baslik: "Tüm Markalara Servis", aciklama: noAuthorizedService, markalar: preset.brands },
    },
    surec: {
      enabled: true,
      content: { baslik: "Nasıl Çalışıyoruz?", aciklama: "Üç adımda sorununuzu çözüyoruz.", adimlar: preset.steps },
    },
    sss: {
      enabled: true,
      content: {
        baslik: "Sık Sorulan Sorular",
        aciklama: "Aklınıza takılan başka bir soru varsa telefonla veya WhatsApp'tan ulaşın.",
        sorular: preset.faq,
      },
    },
    bolgeler: {
      enabled: true,
      content: {
        baslik: "Hizmet Bölgelerimiz",
        aciklama: "Aşağıdaki bölgelerde yerinde servis veriyoruz:",
        bolgeler,
      },
    },
    // Yorumlar asla örnek olarak üretilmez; usta gerçek yorumlarını ekleyince açar
    yorumlar: { enabled: false, content: { baslik: "Müşterilerimiz Ne Diyor?", yorumlar: [], tumYorumlarLinki: "" } },
    iletisim: { enabled: true, content: { baslik: "İletişim", aciklama: "" } },
  };

  return ustaSections.map((section, position) => ({
    key: section.key,
    position,
    enabled: content[section.key].enabled,
    content: content[section.key].content,
  }));
}
