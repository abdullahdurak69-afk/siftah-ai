import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/config";
import { getPublicSite } from "@/lib/sites";
import { SiteRenderer, siteMetadata } from "@/templates/render";

// Site bulunamazsa gerçek bir 404 dönebilmek için sayfa, içerik hazır olana kadar bekler (streaming yok)
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/site/[subdomain]">): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getPublicSite(subdomain);
  return data ? siteMetadata(data, siteUrl(subdomain)) : {};
}

export default async function SitePage({ params }: PageProps<"/site/[subdomain]">) {
  const { subdomain } = await params;
  // Sadece yayındaki sürüm gösterilir; hiç yayınlanmamış veya askıdaki siteler 404
  const data = await getPublicSite(subdomain);
  if (!data) notFound();

  return <SiteRenderer data={data} url={siteUrl(subdomain)} />;
}
