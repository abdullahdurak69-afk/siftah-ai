import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sectors, siteUrl } from "@/lib/config";
import { getPublicSite } from "@/lib/sites";
import { UstaSite } from "@/templates/usta/site";
import { ustaJsonLd, ustaMetadata } from "@/templates/usta/seo";

// Site bulunamazsa gerçek bir 404 dönebilmek için sayfa, içerik hazır olana kadar bekler (streaming yok)
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/site/[subdomain]">): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getPublicSite(subdomain);
  if (!data) return {};

  const { site, sections } = data;
  const base: Metadata = {
    title: site.name,
    alternates: { canonical: siteUrl(subdomain) },
    // TODO(3. faz): yayınlama gelince sadece yayında olan siteler indekslenecek
    robots: site.status === "published" ? undefined : { index: false, follow: false },
  };

  if (site.sector === "usta" && sections.length > 0) {
    const { title, description } = ustaMetadata(site.name, sections);
    return { ...base, title, description, openGraph: { title, description, url: siteUrl(subdomain), locale: "tr_TR" } };
  }
  return base;
}

export default async function SitePage({ params }: PageProps<"/site/[subdomain]">) {
  const { subdomain } = await params;
  const data = await getPublicSite(subdomain);

  // TODO(3. faz): taslak siteler ilk yayına kadar ziyaretçilere gösterilmeyecek
  if (!data || data.site.status === "suspended") notFound();

  const { site, sections } = data;

  if (site.sector === "usta" && sections.length > 0) {
    const jsonLd = ustaJsonLd(site.name, siteUrl(subdomain), site.profession, sections);
    return (
      <>
        <script
          type="application/ld+json"
          // JSON içine gömülen "<" karakterleri script etiketini kapatamasın
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <UstaSite name={site.name} theme={site.theme} sections={sections} />
      </>
    );
  }

  // Kurulumu tamamlanmamış ya da şablonu henüz olmayan siteler
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-slate-500">{sectors[site.sector]}</p>
      <h1 className="text-4xl font-semibold tracking-tight">{site.name}</h1>
      <p className="text-slate-600">Web sitemiz hazırlanıyor.</p>
    </main>
  );
}
