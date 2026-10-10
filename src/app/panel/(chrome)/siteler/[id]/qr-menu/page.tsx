import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Printer } from "lucide-react";
import { getEditableSite } from "@/lib/dal";
import { menuUrl, qrSvg } from "@/lib/qr";

export const metadata: Metadata = { title: "QR menü", robots: { index: false } };
export const instant = false;

export default async function QrMenuPage({ params }: PageProps<"/panel/siteler/[id]/qr-menu">) {
  const { id } = await params;
  const { site, publishedAt } = await getEditableSite(id);
  if (site.sector !== "restoran") notFound();

  const url = menuUrl(site.subdomain);
  const svg = await qrSvg(url);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">QR menü</h2>
        <p className="mt-1 text-slate-600">
          Masalara koyacağınız QR kod, misafirlerin telefonunda menünüzü açar. Menüde yaptığınız değişiklikler
          &quot;Yayınla&quot;ya bastığınızda QR menüye de yansır; kodu yeniden basmanız gerekmez.
        </p>
      </div>

      {!publishedAt && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Siteniz henüz yayınlanmadı. QR kod, siteyi yayınladıktan sonra çalışır.
        </p>
      )}

      <section className="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-[220px_1fr] md:items-center">
        <div className="mx-auto w-full max-w-[220px] rounded-lg border border-slate-200 p-3 [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm text-slate-500">Menü adresi</p>
            <a href={url} target="_blank" rel="noreferrer" className="break-all font-medium underline">
              {url.replace(/^https?:\/\//, "")}
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/qr-kart/${site.id}`}
              target="_blank"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              <Printer className="size-4" /> Masa kartlarını yazdır
            </Link>
            <a href={`/api/qr/${site.id}?format=png`} className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">
              <Download className="size-4" /> PNG indir
            </a>
            <a href={`/api/qr/${site.id}?format=svg`} className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">
              <Download className="size-4" /> SVG indir (matbaa için)
            </a>
          </div>
          <p className="text-sm text-slate-500">
            Kendi domain&apos;inizi bağlasanız da bu kod çalışmaya devam eder; ziyaretçi otomatik olarak yeni adresinize yönlenir.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold">Telefonda görünümü</h3>
        <p className="mt-1 text-sm text-slate-600">Taslak menünüz (yayınlanmamış değişiklikler dahil).</p>
        <div className="mx-auto mt-4 h-[640px] w-full max-w-[380px] overflow-hidden rounded-[2rem] border-8 border-slate-900">
          <iframe src={`/onizleme/${site.id}/menu`} title="QR menü önizlemesi" className="size-full" />
        </div>
      </section>
    </div>
  );
}
