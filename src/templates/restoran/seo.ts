import type { SectionRow } from "../engine/types";
import { getRestoranPreset } from "./presets";
import { getRestoranContent } from "./site";

function trimDescription(text: string) {
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
}

export function restoranMetadata(name: string, profession: string | null, sections: SectionRow[]) {
  const { business, hero } = getRestoranContent(sections);
  const kind = getRestoranPreset(profession)?.label.split(" / ")[0] ?? "Restoran";
  return { title: `${name} | ${business.ilce} ${kind}`, description: trimDescription(hero.aciklama) };
}

export function restoranMenuMetadata(name: string, sections: SectionRow[]) {
  const { business, menu } = getRestoranContent(sections);
  const categories = menu.kategoriler.map((c) => c.ad).slice(0, 5).join(", ");
  return {
    title: `Menü | ${name}`,
    description: trimDescription(`${name} menüsü (${business.ilce}): ${categories}.`),
  };
}

// schema.org: Restaurant (veya Cafe, Bakery...) + menü adresi + (açıksa) FAQPage
export function restoranJsonLd(name: string, url: string, profession: string | null, sections: SectionRow[]) {
  const { business, hero, faq, enabled } = getRestoranContent(sections);
  const preset = getRestoranPreset(profession);

  const businessLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": preset?.schemaType ?? "Restaurant",
    name,
    url,
    description: hero.aciklama,
    telephone: business.cep,
    servesCuisine: preset?.cuisine,
    hasMenu: `${url}/menu`,
    acceptsReservations: enabled("rezervasyon"),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.adres,
      addressLocality: business.ilce,
      addressRegion: business.il,
      addressCountry: "TR",
    },
  };
  if (hero.gorsel) businessLd.image = hero.gorsel.src.startsWith("http") ? hero.gorsel.src : `${url}${hero.gorsel.src}`;
  if (business.haritaLinki) businessLd.hasMap = business.haritaLinki;
  const sameAs = [business.instagram].filter(Boolean);
  if (sameAs.length) businessLd.sameAs = sameAs;
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

// /menu sayfası için schema.org Menu: AI asistanları ve Google ürünleri ve fiyatları okuyabilsin
export function restoranMenuJsonLd(name: string, url: string, sections: SectionRow[]) {
  const { menu } = getRestoranContent(sections);
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${name} Menü`,
    url: `${url}/menu`,
    inLanguage: "tr",
    hasMenuSection: menu.kategoriler.map((c) => ({
      "@type": "MenuSection",
      name: c.ad,
      description: c.aciklama || undefined,
      hasMenuItem: c.urunler.map((u) => ({
        "@type": "MenuItem",
        name: u.ad,
        description: u.aciklama || undefined,
        offers:
          menu.fiyatlariGoster && u.fiyat !== null
            ? { "@type": "Offer", price: u.fiyat, priceCurrency: "TRY" }
            : undefined,
      })),
    })),
  };
}
