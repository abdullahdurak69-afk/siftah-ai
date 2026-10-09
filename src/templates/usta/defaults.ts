import { z } from "zod";
import { locative } from "@/lib/turkish";
import type { SectionRow } from "../engine/types";
import { noAuthorizedService, presets, type PresetKey } from "./presets";
import { ustaSections } from "./sections";

const phone = z.string().trim().regex(/^[0-9+()\s-]{7,20}$/, "Geçerli bir telefon numarası girin.");
const optionalPhone = z.string().trim().refine((v) => v === "" || /^[0-9+()\s-]{7,20}$/.test(v), "Geçerli bir telefon numarası girin.");

// Kurulum sihirbazının topladığı bilgiler
export const ustaSetupSchema = z.object({
  profession: z.enum(Object.keys(presets) as [PresetKey, ...PresetKey[]], "Bir meslek seçin."),
  cep: phone,
  whatsapp: optionalPhone,
  sabit: optionalPhone,
  adres: z.string().trim().min(5, "Açık adresi girin.").max(300),
  ilce: z.string().trim().min(2, "İlçeyi girin.").max(40),
  il: z.string().trim().min(2, "İli girin.").max(40),
  services: z.array(z.number().int().min(0)).min(1, "En az bir hizmet seçin."),
  bolgeler: z.array(z.string().trim().min(1).max(80)).max(40),
});

export type UstaSetup = z.infer<typeof ustaSetupSchema>;

// Sihirbaz bilgilerinden, meslek ön ayarındaki örnek metinlerle dolu bir site üretir
export function buildUstaContent(siteName: string, input: UstaSetup): SectionRow[] {
  const preset = presets[input.profession];
  const bolgeler = input.bolgeler.length > 0 ? input.bolgeler : [input.ilce];

  const content: Record<string, { enabled: boolean; content: Record<string, unknown> }> = {
    isletme: {
      enabled: true,
      content: {
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
      },
    },
    one_cikanlar: { enabled: true, content: { kutular: preset.highlights } },
    hizmetler: {
      enabled: true,
      content: {
        baslik: "Hizmetlerimiz",
        aciklama: `${input.ilce} ve çevresinde verdiğimiz hizmetler.`,
        liste: preset.services.filter((_, i) => input.services.includes(i)),
      },
    },
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
