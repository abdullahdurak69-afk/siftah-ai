// Tanıtım sitesindeki rehber yazıları (/rehber/<slug>). Yazıların metni kendi sayfa dosyalarındadır
// (src/app/(tanitim)/rehber/<slug>/page.tsx); liste, site haritası ve llms.txt bu kayıtları kullanır.

export type Guide = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
};

export const guides: Guide[] = [
  {
    slug: "google-isletme-profili-nasil-acilir",
    title: "Google İşletme Profili nasıl açılır? Adım adım rehber",
    description:
      "İşletmenizin Google Haritalar'da ve aramalarda çıkması için ücretsiz Google İşletme Profili'ni açma, doğrulama ve doldurma adımları.",
    publishedAt: "2026-10-10",
  },
  {
    slug: "domain-nedir-nasil-alinir",
    title: "Domain (alan adı) nedir, nasıl alınır? .com mu, .com.tr mi?",
    description:
      "Küçük işletmeler için domain seçimi: iyi bir alan adının özellikleri, .com ile .com.tr farkı, kimin adına kaydedilmesi gerektiği ve e-postanızı bozmadan nasıl bağlanacağı.",
    publishedAt: "2026-10-10",
  },
  {
    slug: "restoran-google-ve-yapay-zekada-one-cikma",
    title: "Restoranınız Google'da ve yapay zekâ asistanlarında nasıl öne çıkar?",
    description:
      "Restoran ve kafeler için yerel aramalarda ve ChatGPT, Gemini gibi asistanların önerilerinde görünür olmanın pratik yolları.",
    publishedAt: "2026-10-10",
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug)!;
}
