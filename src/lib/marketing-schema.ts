import { platformName, rootUrl, supportContact } from "@/lib/config";
import type { Faq } from "@/content/faq";
import type { Guide } from "@/content/guides";
import { pricing } from "@/content/pricing";
import type { SectorPage } from "@/content/sectors";

// Tanıtım sitesinin schema.org verileri. Arama motorları ve yapay zekâ asistanları ürünü, fiyatı ve sık sorulan
// soruları bu yapılardan okur.

const orgId = `${rootUrl}/#organization`;

export const platformDescription =
  "Usta, restoran, kuaför ve klinik gibi küçük işletmeler için hazır web sitesi hizmeti. Site sektöre özel tasarım ve örnek içeriklerle gelir, işletmenin kendi domain'inde yayınlanır; Google ve yapay zekâ asistanları için hazır altyapıya sahiptir.";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: platformName,
    url: rootUrl,
    description: platformDescription,
    ...(supportContact.email && { email: supportContact.email }),
    ...(supportContact.phone && { telephone: supportContact.phone }),
    areaServed: { "@type": "Country", name: "Türkiye" },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${rootUrl}/#website`,
    name: platformName,
    url: rootUrl,
    inLanguage: "tr-TR",
    publisher: { "@id": orgId },
  };
}

export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: platformName,
    url: rootUrl,
    description: platformDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "tr-TR",
    publisher: { "@id": orgId },
    ...(pricing.yearlyPrice !== null && {
      offers: {
        "@type": "Offer",
        price: pricing.yearlyPrice,
        priceCurrency: pricing.currency,
        url: `${rootUrl}/fiyatlar`,
        description: "Yıllık abonelik",
      },
    }),
  };
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

// [{ name: "Fiyatlar", path: "/fiyatlar" }] -> Ana sayfa > Fiyatlar
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const all = [{ name: "Ana sayfa", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${rootUrl}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function serviceJsonLd(page: SectorPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    serviceType: `${page.name} web sitesi`,
    description: page.description,
    url: `${rootUrl}/${page.slug}`,
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "Türkiye" },
  };
}

export function articleJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${rootUrl}/rehber/${guide.slug}`,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    inLanguage: "tr-TR",
    author: { "@id": orgId },
    publisher: { "@id": orgId },
  };
}
