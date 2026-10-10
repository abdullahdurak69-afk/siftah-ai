import type { Metadata } from "next";
import type { Sector } from "@/lib/config";
import { sectors } from "@/lib/config";
import type { RenderableSite } from "@/lib/sites";
import type { SectionRow } from "./engine/types";
import { KlinikSite } from "./klinik/site";
import { klinikJsonLd, klinikMetadata } from "./klinik/seo";
import { KuaforSite } from "./kuafor/site";
import { kuaforJsonLd, kuaforMetadata } from "./kuafor/seo";
import { RestoranMenuPage, RestoranSite } from "./restoran/site";
import { restoranJsonLd, restoranMenuJsonLd, restoranMenuMetadata, restoranMetadata } from "./restoran/seo";
import { UstaSite } from "./usta/site";
import { ustaJsonLd, ustaMetadata } from "./usta/seo";

// Canlı site, panel önizlemesi ve paylaşılan önizleme linki aynı çiziciyi kullanır; böylece önizleme birebir aynıdır.

// basePath: sitenin kök yolu (canlıda boş; tanıtım sitesindeki örnekte /ornekler/<sektör>)
type SiteProps = { name: string; theme: string; sections: SectionRow[]; basePath?: string };

type Renderer = {
  Site: (props: SiteProps) => React.ReactNode;
  metadata: (name: string, profession: string | null, sections: SectionRow[]) => { title: string; description: string };
  jsonLd: (name: string, url: string, profession: string | null, sections: SectionRow[]) => Record<string, unknown>[];
};

const renderers: Partial<Record<Sector, Renderer>> = {
  usta: { Site: UstaSite, metadata: (name, _p, sections) => ustaMetadata(name, sections), jsonLd: ustaJsonLd },
  restoran: { Site: RestoranSite, metadata: restoranMetadata, jsonLd: restoranJsonLd },
  kuafor: { Site: KuaforSite, metadata: kuaforMetadata, jsonLd: kuaforJsonLd },
  klinik: { Site: KlinikSite, metadata: klinikMetadata, jsonLd: klinikJsonLd },
};

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON içine gömülen "<" karakterleri script etiketini kapatamasın
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function SiteRenderer({
  data,
  url,
  preview = false,
  basePath,
}: {
  data: RenderableSite;
  url: string;
  preview?: boolean;
  basePath?: string;
}) {
  const { site, sections } = data;
  const renderer = renderers[site.sector];

  if (renderer && sections.length > 0) {
    const { Site } = renderer;
    return (
      <>
        {!preview && <JsonLd data={renderer.jsonLd(site.name, url, site.profession, sections)} />}
        <Site name={site.name} theme={site.theme} sections={sections} basePath={basePath} />
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
  const renderer = renderers[site.sector];
  if (renderer && sections.length > 0) {
    const { title, description } = renderer.metadata(site.name, site.profession, sections);
    return { ...base, title, description, openGraph: { title, description, url, locale: "tr_TR", type: "website" } };
  }
  return base;
}

// --- Restoran QR menü sayfası (/menu) ---

export function hasMenuPage(data: RenderableSite) {
  return data.site.sector === "restoran" && data.sections.some((s) => s.key === "menu" && s.enabled);
}

export function MenuRenderer({
  data,
  url,
  preview = false,
  basePath,
}: {
  data: RenderableSite;
  url: string;
  preview?: boolean;
  basePath?: string;
}) {
  return (
    <>
      {!preview && <JsonLd data={restoranMenuJsonLd(data.site.name, url, data.sections)} />}
      <RestoranMenuPage name={data.site.name} theme={data.site.theme} sections={data.sections} basePath={basePath} />
    </>
  );
}

export function menuMetadata(data: RenderableSite, url: string): Metadata {
  const { title, description } = restoranMenuMetadata(data.site.name, data.sections);
  return { title, description, alternates: { canonical: `${url}/menu` }, openGraph: { title, description, url: `${url}/menu`, locale: "tr_TR" } };
}

export function PreviewBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-50 bg-amber-400 px-4 py-2 text-center text-sm font-medium text-amber-950">
      Önizleme · Bu sayfa henüz yayında olmayan değişiklikler içerebilir. {children}
    </div>
  );
}
