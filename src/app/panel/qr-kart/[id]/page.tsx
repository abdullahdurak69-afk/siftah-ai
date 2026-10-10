import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEditableSite } from "@/lib/dal";
import { menuUrl, qrSvg } from "@/lib/qr";
import { fraunces } from "@/templates/fonts";
import { PrintButton } from "./print-button";

// Yazdırılabilir masa kartları: A4'e 4 kart (2x2), kesip masalara konur
export const instant = false;

export const metadata: Metadata = { title: "QR menü kartları", robots: { index: false, follow: false } };

export default async function QrCardsPage({ params }: PageProps<"/panel/qr-kart/[id]">) {
  const { id } = await params;
  const { site } = await getEditableSite(id);
  if (site.sector !== "restoran") notFound();

  const url = menuUrl(site.subdomain);
  const svg = await qrSvg(url);

  return (
    <div className={`${fraunces.variable} min-h-full bg-slate-100 py-8 print:bg-white print:py-0`}>
      <style>{`@page { size: A4; margin: 10mm; }`}</style>
      <div className="mx-auto mb-6 flex max-w-[190mm] items-center justify-between gap-4 px-4 print:hidden">
        <p className="text-sm text-slate-600">A4 kâğıda 4 kart. Kesik çizgilerden kesip masalara koyabilirsiniz.</p>
        <PrintButton />
      </div>
      <div className="mx-auto grid h-[277mm] w-[190mm] grid-cols-2 grid-rows-2 bg-white print:shadow-none">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-4 border border-dashed border-slate-300 p-8 text-center">
            <p className="text-[22pt] font-semibold leading-tight" style={{ fontFamily: "var(--font-fraunces)" }}>
              {site.name}
            </p>
            <div className="w-[52mm] [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
            <div>
              <p className="text-[13pt] font-semibold">Menümüz için okutun</p>
              <p className="mt-1 text-[9pt] text-slate-500">{url.replace(/^https?:\/\//, "")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
