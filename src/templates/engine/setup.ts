import { z } from "zod";

// Kurulum sihirbazı tüm şablonlarda aynı adımları izler: tür seçimi, iletişim, hazır içerik seçimi
// (usta: hizmetler, restoran: menü kategorileri...) ve sadece usta şablonunda hizmet bölgeleri.

const phonePattern = /^[0-9+()\s-]{7,20}$/;
const phone = z.string().trim().regex(phonePattern, "Geçerli bir telefon numarası girin.");
const optionalPhone = z.string().trim().refine((v) => v === "" || phonePattern.test(v), "Geçerli bir telefon numarası girin.");

export const setupSchema = z.object({
  profession: z.string().min(1, "Bir tür seçin."),
  cep: phone,
  whatsapp: optionalPhone,
  sabit: optionalPhone,
  adres: z.string().trim().min(5, "Açık adresi girin.").max(300),
  ilce: z.string().trim().min(2, "İlçeyi girin.").max(40),
  il: z.string().trim().min(2, "İli girin.").max(40),
  // Ön ayardaki hazır içeriklerden seçilenlerin sıra numaraları
  choices: z.array(z.number().int().min(0)).min(1, "En az birini seçin."),
  bolgeler: z.array(z.string().trim().min(1).max(80)).max(40),
});

export type SetupInput = z.infer<typeof setupSchema>;

// Sihirbaza gönderilen ön ayar özeti (örnek metinler istemciye gönderilmez)
export type PresetOption = { key: string; label: string; icon: string; choices: { ikon: string; baslik: string }[] };

// Sihirbazdaki sektöre özel metinler
export type WizardCopy = {
  presetStep: string;
  presetTitle: string;
  presetHint: string;
  choicesStep: string;
  choicesTitle: string;
  choicesHint: string;
  // Hizmet bölgeleri adımı (sadece yerinde hizmet veren ustalar için)
  areas: boolean;
};
