import type { Metadata } from "next";
import { getEditableSite } from "@/lib/dal";
import { getCatalog } from "@/templates/catalog";
import { SetupWizard } from "./setup-wizard";

export const metadata: Metadata = { title: "Kurulum", robots: { index: false } };
export const instant = false;

export default async function SetupPage({ params }: PageProps<"/panel/siteler/[id]/kurulum">) {
  const { id } = await params;
  const { site, sections } = await getEditableSite(id);
  const catalog = getCatalog(site.sector);

  if (!catalog) {
    return <p className="text-slate-600">Bu sektörün şablonu henüz hazır değil.</p>;
  }

  // Kurulum yeniden çalıştırılıyorsa mevcut iletişim bilgileri forma önceden doldurulur
  const business = (sections.find((s) => s.key === "isletme")?.content ?? {}) as Record<string, string>;
  const areas = (sections.find((s) => s.key === "bolgeler")?.content?.bolgeler as string[] | undefined) ?? [];

  return (
    <div className="mx-auto w-full max-w-2xl">
      {site.setupCompletedAt && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Kurulum daha önce yapıldı. Tekrar tamamlarsanız sitedeki içerikler yeni örnek metinlerle değiştirilir.
        </p>
      )}
      <SetupWizard
        siteId={site.id}
        siteName={site.name}
        presets={catalog.presets}
        copy={catalog.wizard}
        initial={{
          profession: site.profession ?? "",
          cep: business.cep ?? "",
          whatsapp: business.whatsapp ?? "",
          sabit: business.sabit ?? "",
          adres: business.adres ?? "",
          ilce: business.ilce ?? "",
          il: business.il ?? "İstanbul",
          bolgeler: areas,
        }}
      />
    </div>
  );
}
