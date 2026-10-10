import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPublicSite } from "@/lib/public-site";
import { MenuRenderer, hasMenuPage, menuMetadata } from "@/templates/render";
import { StatsBeacon } from "@/templates/stats-beacon";

// Restoranların QR menü sayfası. Proxy, restoran olmayan sitelerde bu adresi 404'e çevirir.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/site/[subdomain]/menu">): Promise<Metadata> {
  const { subdomain } = await params;
  const result = await loadPublicSite(subdomain);
  return result && hasMenuPage(result.data) ? menuMetadata(result.data, result.url) : {};
}

export default async function MenuPage({ params }: PageProps<"/site/[subdomain]/menu">) {
  const { subdomain } = await params;
  const result = await loadPublicSite(subdomain);
  if (!result || !hasMenuPage(result.data)) notFound();

  return (
    <>
      <MenuRenderer data={result.data} url={result.url} />
      <StatsBeacon />
    </>
  );
}
