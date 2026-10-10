import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEditableSite } from "@/lib/dal";
import { siteUrl } from "@/lib/config";
import { MenuRenderer, hasMenuPage } from "@/templates/render";

// QR menü ekranındaki önizleme: taslak menü, telefondaki görünümüyle
export const instant = false;

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DraftMenuPreviewPage({ params }: PageProps<"/panel/onizleme/[id]/menu">) {
  const { id } = await params;
  const { site, sections } = await getEditableSite(id);
  const data = { site, sections, publishedAt: null };
  if (!hasMenuPage(data)) notFound();

  return <MenuRenderer data={data} url={siteUrl(site.subdomain)} preview />;
}
