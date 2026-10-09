import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPublicSite } from "@/lib/public-site";
import { SiteRenderer, siteMetadata } from "@/templates/render";

// Host çözümleme, 404 ve yönlendirmeler proxy'de yapılır (src/lib/host-routing.ts); buraya sadece
// yayında olan sitelerin istekleri gelir. Aşağıdaki kontroller ikinci bir güvenlik katmanıdır.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/site/[subdomain]">): Promise<Metadata> {
  const { subdomain } = await params;
  const result = await loadPublicSite(subdomain);
  return result ? siteMetadata(result.data, result.url) : {};
}

export default async function SitePage({ params }: PageProps<"/site/[subdomain]">) {
  const { subdomain } = await params;
  const result = await loadPublicSite(subdomain);
  if (!result) notFound();

  return <SiteRenderer data={result.data} url={result.url} />;
}
