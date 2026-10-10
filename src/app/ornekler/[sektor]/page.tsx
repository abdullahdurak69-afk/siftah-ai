import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { platformName, rootUrl, sectors, type Sector } from "@/lib/config";
import { demoSectors, getDemoSite } from "@/content/demos";
import { SiteRenderer } from "@/templates/render";

// Örnek site: şablonun sihirbazdan çıkan hâli. Tanıtım çerçevesi olmadan, şablonun kendisi gösterilir.
// Google'a kapalıdır ve schema.org basılmaz (önizleme modu), gerçek işletme sanılmasın. Bilinmeyen sektör proxy'de 404.

export function generateStaticParams() {
  return demoSectors.map((sektor) => ({ sektor }));
}

export async function generateMetadata({ params }: PageProps<"/ornekler/[sektor]">): Promise<Metadata> {
  const { sektor } = await params;
  const label = sectors[sektor as Sector];
  return { title: `Örnek ${label} sitesi | ${platformName}`, robots: { index: false, follow: true } };
}

export default async function DemoSitePage({ params }: PageProps<"/ornekler/[sektor]">) {
  const { sektor } = await params;
  const data = getDemoSite(sektor as Sector);
  if (!data) notFound();

  return (
    <>
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-emerald-950 px-4 py-2 text-center text-sm text-white">
        <span>
          <strong>Örnek site.</strong> İşletme, telefon ve adres örnektir; sizin siteniz kendi bilgilerinizle gelir.
        </span>
        <Link href="/iletisim" className="rounded-full bg-amber-300 px-3 py-1 font-semibold text-amber-950 hover:bg-amber-200">
          Siteni açalım
        </Link>
      </div>
      <SiteRenderer data={data} url={`${rootUrl}/ornekler/${sektor}`} preview basePath={`/ornekler/${sektor}`} />
    </>
  );
}
