import type { Metadata } from "next";
import { getEditableSite } from "@/lib/dal";
import { siteUrl } from "@/lib/config";
import { SiteRenderer } from "@/templates/render";

// Panelin önizleme ekranındaki iframe'in içeriği: taslak, panel menüsü olmadan, tam sayfa
export const instant = false;

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DraftPreviewPage({ params }: PageProps<"/panel/onizleme/[id]">) {
  const { id } = await params;
  const { site, sections } = await getEditableSite(id);

  return (
    <SiteRenderer
      data={{ site, sections, publishedAt: null }}
      url={siteUrl(site.subdomain)}
      preview
    />
  );
}
