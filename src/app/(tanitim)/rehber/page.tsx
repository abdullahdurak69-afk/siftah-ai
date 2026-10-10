import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/subscription";
import { guides } from "@/content/guides";
import { PageHeader, Section } from "../_components/ui";

export const metadata: Metadata = {
  title: "Rehber: Küçük işletmeler için internette görünür olmak",
  description:
    "Google İşletme Profili, domain seçimi, Google'da ve yapay zekâ asistanlarında öne çıkma üzerine küçük işletmelere pratik rehberler.",
  alternates: { canonical: "/rehber" },
};

export default function GuidesPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ name: "Rehber", path: "/rehber" }]} title="Rehber">
        <p>İşletmenizi internette bulunur kılmak için teknik bilgi gerektirmeyen, adım adım yazılar.</p>
      </PageHeader>
      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/rehber/${guide.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-stone-200 p-6 transition-shadow hover:shadow-md"
              >
                <time dateTime={guide.publishedAt} className="text-sm text-slate-500">
                  {formatDate(guide.publishedAt)}
                </time>
                <h2 className="mt-2 text-xl font-semibold">{guide.title}</h2>
                <p className="mt-2 flex-1 text-slate-600">{guide.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-semibold text-emerald-700">
                  Oku <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
