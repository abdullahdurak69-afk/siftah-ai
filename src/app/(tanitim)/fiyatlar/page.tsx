import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { softwareJsonLd } from "@/lib/marketing-schema";
import { generalFaq } from "@/content/faq";
import { formatPrice, pricing } from "@/content/pricing";
import { ButtonLink, FaqList, JsonLd, PageHeader, Section, SectionHeading } from "../_components/ui";

export const metadata: Metadata = {
  title: "Fiyatlar: Yıllık web sitesi aboneliği",
  description:
    "Küçük işletme web sitesi fiyatı: kurulum, barındırma, güvenlik sertifikası, domain bağlama ve düzenleme paneli tek yıllık abonelikte.",
  alternates: { canonical: "/fiyatlar" },
};

// Dürüst olmak için: pakette olmayanlar da açıkça yazılır
const notIncluded = [
  "Online sipariş ve kartla ödeme alma",
  "Kurumsal e-posta kutusu (info@firmaniz.com)",
  "Logo tasarımı ve profesyonel fotoğraf çekimi",
];

const paymentFaq = generalFaq.filter((f) => /Ücret nasıl|yenilemezsem|bırakırsam/.test(f.q));

export default function PricingPage() {
  return (
    <>
      <JsonLd data={softwareJsonLd()} />
      <PageHeader breadcrumbs={[{ name: "Fiyatlar", path: "/fiyatlar" }]} title="Tek paket, yıllık abonelik">
        <p>Kurulum, barındırma, güvenlik sertifikası ve düzenleme paneli dahil. Gizli ücret yok.</p>
      </PageHeader>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border-2 border-emerald-700 p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Yıllık abonelik</p>
            {pricing.yearlyPrice !== null ? (
              <p className="mt-3 text-5xl font-semibold tracking-tight">
                {formatPrice(pricing.yearlyPrice)} TL <span className="text-lg font-normal text-slate-500">/ yıl, KDV dahil</span>
              </p>
            ) : (
              <p className="mt-3 text-2xl font-semibold">Güncel fiyat için bize ulaşın</p>
            )}
            <ul className="mt-8 grid gap-3">
              {pricing.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden /> {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/iletisim" className="mt-8 w-full sm:w-auto">
              Siteni açalım
            </ButtonLink>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-stone-50 p-8">
              <h2 className="text-lg font-semibold">Pakette olmayanlar</h2>
              <ul className="mt-4 grid gap-3 text-slate-600">
                {notIncluded.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Minus className="mt-0.5 size-5 shrink-0 text-slate-400" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-stone-50 p-8">
              <h2 className="text-lg font-semibold">Ödeme</h2>
              <p className="mt-3 text-slate-600">
                Ödeme yıllık olarak havale veya EFT ile yapılır. Yenileme tarihinden 30, 7 ve 1 gün önce e-postayla
                hatırlatırız.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Sık sorulanlar" title="Ödeme ve abonelik" />
          <FaqList items={paymentFaq} />
        </div>
      </Section>
    </>
  );
}
