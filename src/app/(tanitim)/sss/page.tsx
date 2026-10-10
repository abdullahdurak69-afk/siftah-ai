import type { Metadata } from "next";
import { faqJsonLd } from "@/lib/marketing-schema";
import { generalFaq } from "@/content/faq";
import { sectorPages } from "@/content/sectors";
import { FaqList, JsonLd, PageHeader, Section } from "../_components/ui";

export const metadata: Metadata = {
  title: "Sık sorulan sorular",
  description:
    "Hazır web sitesi hakkında merak edilenler: domain bağlama, kaç günde yayına girdiği, Google ve yapay zekâ görünürlüğü, ödeme ve abonelik.",
  alternates: { canonical: "/sss" },
};

export default function FaqPage() {
  const all = [...generalFaq, ...sectorPages.flatMap((p) => p.faq)];
  return (
    <>
      <JsonLd data={faqJsonLd(all)} />
      <PageHeader breadcrumbs={[{ name: "SSS", path: "/sss" }]} title="Sık sorulan sorular">
        <p>Cevabını bulamadığınız bir soru varsa bize yazın, hemen dönelim.</p>
      </PageHeader>
      <Section>
        <div className="mx-auto flex max-w-3xl flex-col gap-12">
          <div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Genel</h2>
            <FaqList items={generalFaq} />
          </div>
          {sectorPages.map((page) => (
            <div key={page.slug}>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">{page.name}</h2>
              <FaqList items={page.faq} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
