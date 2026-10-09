import type { SectionRow } from "../engine/types";
import { getPreset } from "./presets";
import { getUstaContent } from "./site";

export function ustaMetadata(name: string, sections: SectionRow[]) {
  const { hero } = getUstaContent(sections);
  const title = `${hero.baslikOn} ${hero.baslikVurgu} | ${name}`;
  const description = hero.aciklama.length > 160 ? `${hero.aciklama.slice(0, 157).trimEnd()}…` : hero.aciklama;
  return { title, description };
}

// Google ve AI asistanları için schema.org verisi: LocalBusiness alt tipi + (açıksa) FAQPage
export function ustaJsonLd(name: string, url: string, profession: string | null, sections: SectionRow[]) {
  const { business, hero, faq, areas, enabled } = getUstaContent(sections);
  const preset = getPreset(profession);

  const businessLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": preset?.schemaType ?? "LocalBusiness",
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
  };
  if (enabled("bolgeler") && areas.bolgeler.length > 0) {
    businessLd.areaServed = areas.bolgeler.map((area) => ({ "@type": "Place", name: area }));
  }
  if (business.haritaLinki) businessLd.hasMap = business.haritaLinki;
  if (business.googlePuan && business.yorumSayisi) {
    businessLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: business.googlePuan,
      reviewCount: business.yorumSayisi,
      bestRating: 5,
    };
  }

  const items: Record<string, unknown>[] = [businessLd];

  if (enabled("sss") && faq.sorular.length > 0) {
    items.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.sorular.map((q) => ({
        "@type": "Question",
        name: q.soru,
        acceptedAnswer: { "@type": "Answer", text: q.cevap },
      })),
    });
  }

  return items;
}
