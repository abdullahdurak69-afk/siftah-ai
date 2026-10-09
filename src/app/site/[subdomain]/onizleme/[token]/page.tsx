import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/config";
import { getSiteByPreviewToken } from "@/lib/sites";
import { PreviewBanner, SiteRenderer } from "@/templates/render";

// Paylaşılan önizleme linki: giriş gerektirmez, süresi dolunca 404 olur, Google'a kapalıdır
export const instant = false;

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SharedPreviewPage({ params }: PageProps<"/site/[subdomain]/onizleme/[token]">) {
  const { subdomain, token } = await params;
  const data = await getSiteByPreviewToken(subdomain, token);
  if (!data) notFound();

  return (
    <>
      <PreviewBanner />
      <SiteRenderer data={data} url={siteUrl(subdomain)} preview />
    </>
  );
}
