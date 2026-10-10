import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/config";
import { getSiteByPreviewToken } from "@/lib/sites";
import { PreviewBanner, SiteRenderer } from "@/templates/render";

// Paylaşılan önizleme linki (ana domain'de): giriş gerektirmez, süresi dolunca 404 olur, Google'a kapalıdır.
// Site henüz domain'e bağlanmamış olabileceği için müşteri taslağı buradan görür.
export const instant = false;

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SharedPreviewPage({ params }: PageProps<"/onizleme/[token]">) {
  const { token } = await params;
  const data = await getSiteByPreviewToken(token);
  if (!data) notFound();

  return (
    <>
      <PreviewBanner />
      <SiteRenderer data={data} url={siteUrl(data.subdomain)} preview />
    </>
  );
}
