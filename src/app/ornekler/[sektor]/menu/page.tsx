import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { platformName, rootUrl, type Sector } from "@/lib/config";
import { getDemoSite } from "@/content/demos";
import { hasMenuPage, MenuRenderer } from "@/templates/render";

// Örnek restoranın QR menü sayfası (sadece restoran örneğinde var; diğerleri 404)

export function generateStaticParams() {
  return [{ sektor: "restoran" }];
}

export const metadata: Metadata = { title: `Örnek QR menü | ${platformName}`, robots: { index: false, follow: true } };

export default async function DemoMenuPage({ params }: PageProps<"/ornekler/[sektor]/menu">) {
  const { sektor } = await params;
  const data = getDemoSite(sektor as Sector);
  if (!data || !hasMenuPage(data)) notFound();
  return <MenuRenderer data={data} url={`${rootUrl}/ornekler/${sektor}`} preview basePath={`/ornekler/${sektor}`} />;
}
