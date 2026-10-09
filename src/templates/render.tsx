import type { Metadata } from "next";
import { sectors } from "@/lib/config";
import type { RenderableSite } from "@/lib/sites";
import { UstaSite } from "./usta/site";
import { ustaJsonLd, ustaMetadata } from "./usta/seo";

// Canlı site, panel önizlemesi ve paylaşılan önizleme linki aynı çiziciyi kullanır; böylece önizleme birebir aynıdır.
export function SiteRenderer({ data, url, preview = false }: { data: RenderableSite; url: string; preview?: boolean }) {
  const { site, sections } = data;

  if (site.sector === "usta" && sections.length > 0) {
    return (
      <>
        {!preview && (
          <script
            type="application/ld+json"
            // JSON içine gömülen "<" karakterleri script etiketini kapatamasın
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(ustaJsonLd(site.name, url, site.profession, sections)).replace(/</g, "\\u003c"),
            }}
          />
        )}
        <UstaSite name={site.name} theme={site.theme} sections={sections} />
      </>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-slate-500">{sectors[site.sector]}</p>
      <h1 className="text-4xl font-semibold tracking-tight">{site.name}</h1>
      <p className="text-slate-600">Web sitemiz hazırlanıyor.</p>
    </main>
  );
}

export function siteMetadata(data: RenderableSite, url: string): Metadata {
  const { site, sections } = data;
  const base: Metadata = { title: site.name, alternates: { canonical: url } };
  if (site.sector === "usta" && sections.length > 0) {
    const { title, description } = ustaMetadata(site.name, sections);
    return { ...base, title, description, openGraph: { title, description, url, locale: "tr_TR", type: "website" } };
  }
  return base;
}

export function PreviewBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-50 bg-amber-400 px-4 py-2 text-center text-sm font-medium text-amber-950">
      Önizleme · Bu sayfa henüz yayında olmayan değişiklikler içerebilir. {children}
    </div>
  );
}
