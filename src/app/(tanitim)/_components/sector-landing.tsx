import type { Metadata } from "next";
import { ArrowRight, Check, ExternalLink, Info } from "lucide-react";
import type { Sector } from "@/lib/config";
import { faqJsonLd, serviceJsonLd } from "@/lib/marketing-schema";
import { generalFaq } from "@/content/faq";
import { getSectorPage } from "@/content/sectors";
import { LeadForm } from "./lead-form";
import { ButtonLink, FaqList, JsonLd, PageHeader, Section, SectionHeading } from "./ui";

// Sektör sayfaları (/usta-web-sitesi, /restoran-web-sitesi...) tek bileşenden, içerik src/content/sectors.ts'den

export function sectorMetadata(sector: Sector): Metadata {
  const page = getSectorPage(sector);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.title, description: page.description, url: `/${page.slug}` },
  };
}

// Genel sorulardan sektör sayfasında da işe yarayanlar (domain, süre, Google)
const sharedFaq = generalFaq.filter((f) => /Domain'imi|Kaç günde|Google'da çıkar/.test(f.q));

export function SectorLanding({ sector }: { sector: Sector }) {
  const page = getSectorPage(sector);
  const faq = [...page.faq, ...sharedFaq];

  return (
    <>
      <JsonLd data={[serviceJsonLd(page), faqJsonLd(faq)]} />
      <PageHeader breadcrumbs={[{ name: page.name, path: `/${page.slug}` }]} title={page.h1}>
        <p>{page.intro}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#basvuru">
            Siteni açalım <ArrowRight className="size-4" />
          </ButtonLink>
          <a
            href={`/ornekler/${sector}`}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-50"
          >
            Örnek siteyi gör <ExternalLink className="size-4" />
          </a>
        </div>
      </PageHeader>

      <Section>
        <SectionHeading eyebrow="Kimler için" title={`${page.name} sitesi, işinize göre`}>
          Kurulumda işletme türünüzü seçersiniz; hizmetler, tanıtım metni ve sık sorulan sorular buna göre hazır gelir.
        </SectionHeading>
        <ul className="mt-6 flex flex-wrap gap-2">
          {page.kinds.map((kind) => (
            <li key={kind} className="rounded-full bg-emerald-50 px-4 py-2 font-medium text-emerald-900 ring-1 ring-emerald-200">
              {kind}
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">Sitenizde hazır gelenler</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {page.features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-stone-200 p-5">
              <p className="flex items-center gap-2 font-semibold">
                <Check className="size-5 shrink-0 text-emerald-700" aria-hidden /> {f.title}
              </p>
              <p className="mt-2 text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>

        {page.notice && (
          <p className="mt-10 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <Info className="mt-0.5 size-5 shrink-0" aria-hidden /> {page.notice}
          </p>
        )}
      </Section>

      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Sık sorulanlar" title={`${page.name} siteleri hakkında`} />
          <FaqList items={faq} />
        </div>
      </Section>

      <Section id="basvuru">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Başvuru" title="Sitenizi birlikte açalım">
            Formu doldurun, sizi arayalım. İşletmenizi dinleyip sitenizi aynı gün hazırlayalım.
          </SectionHeading>
          <LeadForm source={`/${page.slug}`} sector={sector} />
        </div>
      </Section>
    </>
  );
}
