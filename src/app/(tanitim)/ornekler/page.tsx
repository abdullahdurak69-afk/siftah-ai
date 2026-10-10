import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { sectorPages } from "@/content/sectors";
import { ButtonLink, PageHeader, Section } from "../_components/ui";

export const metadata: Metadata = {
  title: "Örnek siteler: Usta, restoran, kuaför ve klinik",
  description:
    "Hazır web sitesi şablonlarının örnek içerikli hâlleri: teknik servis, restoran ve QR menü, kuaför ve güzellik salonu, klinik.",
  alternates: { canonical: "/ornekler" },
};

export default function ExamplesPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ name: "Örnekler", path: "/ornekler" }]} title="Örnek siteler">
        <p>
          Aşağıdakiler şablonlarımızın, kurulum sırasında hazır gelen örnek içerikle açılmış hâlleridir. Sizin siteniz
          kendi bilgileriniz, fotoğraflarınız ve renginizle bunun gibi görünür. Gerçek müşteri siteleri eklendikçe bu
          sayfada yer alacak.
        </p>
      </PageHeader>
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {sectorPages.map((page) => (
            <div key={page.slug} className="flex flex-col rounded-2xl border border-stone-200 p-6">
              <h2 className="text-xl font-semibold">{page.name}</h2>
              <p className="mt-2 flex-1 text-slate-600">{page.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`/ornekler/${page.sector}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800"
                >
                  Örneği aç <ExternalLink className="size-4" />
                </a>
                <ButtonLink href={`/${page.slug}`} variant="secondary" className="px-4 py-2.5">
                  Ayrıntılar
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
