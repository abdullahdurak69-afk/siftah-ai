import type { Metadata } from "next";
import { getEditableSite } from "@/lib/dal";
import { DevicePreview } from "./device-preview";

export const metadata: Metadata = { title: "Önizleme", robots: { index: false } };
export const instant = false;

export default async function PreviewPage({ params }: PageProps<"/panel/siteler/[id]/onizleme">) {
  const { id } = await params;
  const { site } = await getEditableSite(id);

  return <DevicePreview siteId={site.id} />;
}
