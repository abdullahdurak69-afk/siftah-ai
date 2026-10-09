import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sectors } from "@/lib/config";
import { getSiteBySubdomain } from "@/lib/sites";

// Site bulunamazsa gerçek bir 404 dönebilmek için sayfa, içerik hazır olana kadar bekler (streaming yok)
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/site/[subdomain]">): Promise<Metadata> {
  const { subdomain } = await params;
  const site = await getSiteBySubdomain(subdomain);
  if (!site) return {};
  return { title: site.name };
}

export default async function SitePage({ params }: PageProps<"/site/[subdomain]">) {
  const { subdomain } = await params;
  const site = await getSiteBySubdomain(subdomain);

  // TODO(3. faz): taslak siteler ilk yayına kadar ziyaretçilere gösterilmeyecek
  if (!site || site.status === "suspended") notFound();

  // Şablonlar 2. fazda gelecek; şimdilik yönlendirmenin çalıştığını gösteren yer tutucu
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-slate-500">{sectors[site.sector]}</p>
      <h1 className="text-4xl font-semibold tracking-tight">{site.name}</h1>
      <p className="text-slate-600">Web sitemiz hazırlanıyor.</p>
    </main>
  );
}
