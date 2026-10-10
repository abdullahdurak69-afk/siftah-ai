import type { Metadata } from "next";
import { platformName, rootUrl } from "@/lib/config";
import { organizationJsonLd, platformDescription, websiteJsonLd } from "@/lib/marketing-schema";
import { SiteFooter, SiteHeader } from "./_components/chrome";
import { JsonLd } from "./_components/ui";

// Ana domain'deki tanıtım sitesi (ana sayfa, sektör sayfaları, fiyatlar, örnekler, SSS, rehber, yasal metinler).
// Google Search Console ve Bing Webmaster doğrulama kodları env'den gelir.
export const metadata: Metadata = {
  metadataBase: new URL(rootUrl),
  title: { default: `${platformName}: Esnafa hazır web sitesi`, template: `%s | ${platformName}` },
  description: platformDescription,
  openGraph: { siteName: platformName, locale: "tr_TR", type: "website" },
  twitter: { card: "summary_large_image" },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col bg-white text-slate-900">
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
