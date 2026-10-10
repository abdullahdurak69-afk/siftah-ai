import type { Metadata } from "next";
import Link from "next/link";
import { articleJsonLd } from "@/lib/marketing-schema";
import { formatDate } from "@/lib/subscription";
import { getGuide, guides } from "@/content/guides";
import { ButtonLink, Container, JsonLd, PageHeader } from "./ui";

// Rehber yazılarının ortak çerçevesi: başlık, tarih, okunaklı metin, sonunda başvuru çağrısı ve diğer yazılar

export function guideMetadata(slug: string): Metadata {
  const guide = getGuide(slug);
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/rehber/${slug}` },
    openGraph: { type: "article", title: guide.title, description: guide.description, url: `/rehber/${slug}`, publishedTime: guide.publishedAt },
  };
}

export function GuideArticle({ slug, children }: { slug: string; children: React.ReactNode }) {
  const guide = getGuide(slug);
  const others = guides.filter((g) => g.slug !== slug);

  return (
    <>
      <JsonLd data={articleJsonLd(guide)} />
      <PageHeader
        breadcrumbs={[
          { name: "Rehber", path: "/rehber" },
          { name: guide.title, path: `/rehber/${slug}` },
        ]}
        title={guide.title}
      >
        <p>{guide.description}</p>
        <p className="mt-3 text-sm text-slate-500">
          <time dateTime={guide.updatedAt ?? guide.publishedAt}>{formatDate(guide.updatedAt ?? guide.publishedAt)}</time>
        </p>
      </PageHeader>

      <Container className="py-12">
        <article className="mx-auto max-w-3xl text-lg leading-8 text-slate-700 [&_a]:font-medium [&_a]:text-emerald-800 [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </article>

        <div className="mx-auto mt-14 max-w-3xl rounded-2xl bg-emerald-950 p-8 text-white">
          <p className="text-xl font-semibold">İşletmeniz için hazır bir web sitesi ister misiniz?</p>
          <p className="mt-2 text-emerald-100">
            Sektörünüze özel site, kendi domain&apos;inizde, Google ve yapay zekâ asistanları için hazır. Kurulumu biz
            yaparız.
          </p>
          <ButtonLink href="/iletisim" variant="light" className="mt-5">
            Siteni açalım
          </ButtonLink>
        </div>

        {others.length > 0 && (
          <div className="mx-auto mt-14 max-w-3xl">
            <p className="font-semibold">Diğer yazılar</p>
            <ul className="mt-3 flex flex-col gap-2">
              {others.map((g) => (
                <li key={g.slug}>
                  <Link href={`/rehber/${g.slug}`} className="text-emerald-800 underline">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </>
  );
}
