import type { Metadata } from "next";
import { rootDomain } from "@/lib/config";
import { requireSuperAdmin } from "@/lib/dal";
import { NewSiteForm } from "./new-site-form";

export const metadata: Metadata = { title: "Yeni site", robots: { index: false } };

export const instant = false;

export default async function NewSitePage() {
  await requireSuperAdmin();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Yeni site</h1>
        <p className="mt-1 text-slate-600">
          İşletme bilgilerini girin. İçerik ve fotoğrafları bir sonraki adımda ekleyeceksiniz; müşteriyi sitenin
          Kullanıcılar sayfasından davet edebilirsiniz.
        </p>
      </div>
      <NewSiteForm rootDomain={rootDomain} />
    </div>
  );
}
