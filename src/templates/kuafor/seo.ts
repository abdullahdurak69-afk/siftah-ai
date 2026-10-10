import type { SectionRow } from "../engine/types";
import { getKuaforPreset } from "./presets";
import { getKuaforContent } from "./site";

export function kuaforMetadata(name: string, profession: string | null, sections: SectionRow[]) {
  const { business, hero } = getKuaforContent(sections);
  const kind = getKuaforPreset(profession)?.label.split(" / ")[0] ?? "Kuaför";
  const description = hero.aciklama.length > 160 ? `${hero.aciklama.slice(0, 157).trimEnd()}…` : hero.aciklama;
  return { title: `${name} | ${business.ilce} ${kind}`, description };
}

// schema.org: HairSalon / BeautySalon / NailSalon + hizmet kataloğu + (açıksa) FAQPage
export function kuaforJsonLd(name: string, url: string, profession: string | null, sections: SectionRow[]) {
  const { business, hero, services, faq, enabled } = getKuaforContent(sections);
  const preset = getKuaforPreset(profession);

  const businessLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": preset?.schemaType ?? "BeautySalon",
    name,
    url,
    description: hero.aciklama,
    telephone: business.cep,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.adres,
      addressLocality: business.ilce,
      addressRegion: business.il,
      addressCountry: "TR",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: services.baslik,
      itemListElement: services.kategoriler.map((c) => ({
        "@type": "OfferCatalog",
        name: c.ad,
        itemListElement: c.hizmetler.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.ad, description: s.aciklama || undefined },
          ...(services.fiyatlariGoster && s.fiyat !== null ? { price: s.fiyat, priceCurrency: "TRY" } : {}),
        })),
      })),
    },
  };
  if (business.haritaLinki) businessLd.hasMap = business.haritaLinki;
  if (business.instagram) businessLd.sameAs = [business.instagram];
  if (business.googlePuan && business.yorumSayisi) {
    businessLd.aggregateRating = { "@type": "AggregateRating", ratingValue: business.googlePuan, reviewCount: business.yorumSayisi, bestRating: 5 };
  }

  const items: Record<string, unknown>[] = [businessLd];
  if (enabled("sss") && faq.sorular.length > 0) {
    items.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.sorular.map((q) => ({ "@type": "Question", name: q.soru, acceptedAnswer: { "@type": "Answer", text: q.cevap } })),
    });
  }
  return items;
}
