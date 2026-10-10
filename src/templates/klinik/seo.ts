import type { SectionRow } from "../engine/types";
import { getKlinikPreset } from "./presets";
import { getKlinikContent } from "./site";

export function klinikMetadata(name: string, profession: string | null, sections: SectionRow[]) {
  const { business, hero } = getKlinikContent(sections);
  const kind = getKlinikPreset(profession)?.label.split(" / ")[0] ?? "Klinik";
  const description = hero.aciklama.length > 160 ? `${hero.aciklama.slice(0, 157).trimEnd()}…` : hero.aciklama;
  return { title: `${name} | ${business.ilce} ${kind}`, description };
}

// schema.org: Dentist / VeterinaryCare / Physiotherapy / MedicalBusiness + hekimler + (açıksa) FAQPage.
// Puan (aggregateRating) bilerek eklenmez; klinik şablonunda hasta yorumu yoktur.
export function klinikJsonLd(name: string, url: string, profession: string | null, sections: SectionRow[]) {
  const { business, hero, services, staff, faq, enabled } = getKlinikContent(sections);
  const preset = getKlinikPreset(profession);

  const businessLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": preset?.schemaType ?? "MedicalBusiness",
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
    availableService: services.liste.map((s) => ({ "@type": "Service", name: s.baslik, description: s.aciklama })),
  };
  if (business.haritaLinki) businessLd.hasMap = business.haritaLinki;
  if (business.instagram) businessLd.sameAs = [business.instagram];
  if (enabled("hekimler") && staff.kisiler.length > 0) {
    businessLd.employee = staff.kisiler.map((p) => ({
      "@type": "Person",
      name: p.ad,
      honorificPrefix: p.unvan || undefined,
      jobTitle: p.uzmanlik || undefined,
    }));
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
