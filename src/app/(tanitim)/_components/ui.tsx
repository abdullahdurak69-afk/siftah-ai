import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { platformName } from "@/lib/config";
import { breadcrumbJsonLd } from "@/lib/marketing-schema";

// Tanıtım sitesinin ortak parçaları. Renkler: yeşil (bereket, siftah) ana renk, amber vurgu.

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON içine gömülen "<" karakterleri script etiketini kapatamasın
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function Logo({ className = "" }: { className?: string }) {
  const [first, ...rest] = platformName.split(" ");
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold tracking-tight ${className}`}>
      <span className="grid size-7 place-items-center rounded-lg bg-emerald-700 text-sm font-bold text-white">
        {first.charAt(0)}
      </span>
      <span>
        {first}
        {rest.length > 0 && <span className="ml-1 rounded-md bg-amber-300 px-1.5 py-0.5 text-[0.8em] text-amber-950">{rest.join(" ")}</span>}
      </span>
    </span>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({
  id,
  children,
  className = "",
  tone = "white",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "white" | "muted" | "dark";
}) {
  const tones = { white: "bg-white", muted: "bg-stone-50", dark: "bg-emerald-950 text-white" };
  return (
    <section id={id} className={`scroll-mt-20 py-16 sm:py-20 ${tones[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {children && <div className="mt-4 text-lg text-slate-600">{children}</div>}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
}) {
  const variants = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800",
    secondary: "border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
    light: "bg-white text-emerald-900 hover:bg-emerald-50",
  };
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

// Görünür içerik yolu ve aynı yolun schema.org karşılığı
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="İçerik yolu" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-slate-900">
              Ana sayfa
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={item.path} className="flex items-center gap-1">
              <ChevronRight className="size-3.5" aria-hidden />
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-slate-700">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-slate-900">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function PageHeader({
  breadcrumbs,
  title,
  children,
}: {
  breadcrumbs: { name: string; path: string }[];
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-stone-200 bg-stone-50">
      <Container className="py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg text-slate-600">{children}</div>}
      </Container>
    </div>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold">
            {item.q}
            <ChevronRight className="mt-0.5 size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-90" aria-hidden />
          </summary>
          <p className="mt-3 leading-relaxed text-slate-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
