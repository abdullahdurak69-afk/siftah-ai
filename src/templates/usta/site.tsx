import type { CSSProperties } from "react";
import { Check, ChevronDown, Clock, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { telHref, whatsappHref } from "@/lib/turkish";
import type { SectionRow } from "../engine/types";
import { SectionIcon } from "../icons";
import { getTheme } from "../themes";
import { ustaSections } from "./sections";

// --- İçerik tipleri (sections.ts ile birebir) ---

type Business = {
  cep: string;
  whatsapp: string;
  sabit: string;
  adres: string;
  ilce: string;
  il: string;
  calismaSaatleri: string;
  haritaLinki: string;
  googlePuan: number | null;
  yorumSayisi: number | null;
};
type Hero = { baslikOn: string; baslikVurgu: string; aciklama: string; kartBaslik: string; kartMaddeleri: string[] };
type Highlights = { kutular: { deger: string; etiket: string }[] };
type Services = { baslik: string; aciklama: string; liste: { ikon: string; baslik: string; aciklama: string }[] };
type Brands = { baslik: string; aciklama: string; markalar: string[] };
type Steps = { baslik: string; aciklama: string; adimlar: { baslik: string; aciklama: string }[] };
type Faq = { baslik: string; aciklama: string; sorular: { soru: string; cevap: string }[] };
type Areas = { baslik: string; aciklama: string; bolgeler: string[] };
type Reviews = { baslik: string; yorumlar: { ad: string; yorum: string; puan: number | null }[]; tumYorumlarLinki: string };
type Contact = { baslik: string; aciklama: string };

export type UstaSiteData = {
  name: string;
  theme: string;
  sections: SectionRow[];
};

export function getUstaContent(sections: SectionRow[]) {
  const get = (key: string) => sections.find((s) => s.key === key);
  const content = <T,>(key: string) => (get(key)?.content ?? {}) as T;
  const enabled = (key: string) => get(key)?.enabled ?? false;
  return {
    business: content<Business>("isletme"),
    hero: content<Hero>("hero"),
    faq: content<Faq>("sss"),
    areas: content<Areas>("bolgeler"),
    content,
    enabled,
  };
}

const whatsappGreen = "#25D366";

export function UstaSite({ name, theme, sections }: UstaSiteData) {
  const { business, content, enabled } = getUstaContent(sections);
  const colors = getTheme(theme);
  const whatsapp = business.whatsapp || business.cep;
  const whatsappLink = whatsappHref(whatsapp, "Merhaba, web sitenizden ulaşıyorum.");

  const style = {
    "--accent": colors.accent,
    "--accent-hover": colors.accentHover,
    "--accent-text": colors.accentText,
  } as CSSProperties;

  const ordered = [...sections].sort((a, b) => a.position - b.position).filter((s) => s.enabled);
  const navItems = ustaSections.filter((def) => def.navLabel && enabled(def.key));

  return (
    <div style={style} className="flex min-h-full flex-1 flex-col bg-white pb-16 text-slate-900 md:pb-0">
      <TopBar business={business} />
      <Header name={name} cep={business.cep} navItems={navItems.map((d) => ({ key: d.key, label: d.navLabel! }))} />

      <main className="flex-1">
        {ordered.map((section) => {
          switch (section.key) {
            case "hero":
              return <HeroBlock key={section.key} hero={content<Hero>("hero")} business={business} whatsappLink={whatsappLink} />;
            case "one_cikanlar":
              return <HighlightsBlock key={section.key} data={content<Highlights>("one_cikanlar")} />;
            case "hizmetler":
              return <ServicesBlock key={section.key} data={content<Services>("hizmetler")} />;
            case "markalar":
              return <BrandsBlock key={section.key} data={content<Brands>("markalar")} />;
            case "surec":
              return <StepsBlock key={section.key} data={content<Steps>("surec")} />;
            case "sss":
              return <FaqBlock key={section.key} data={content<Faq>("sss")} />;
            case "bolgeler":
              return <AreasBlock key={section.key} data={content<Areas>("bolgeler")} />;
            case "yorumlar":
              return <ReviewsBlock key={section.key} data={content<Reviews>("yorumlar")} business={business} />;
            case "iletisim":
              return (
                <ContactBlock key={section.key} data={content<Contact>("iletisim")} business={business} whatsappLink={whatsappLink} />
              );
            default:
              return null;
          }
        })}
      </main>

      <footer className="bg-slate-950 py-6 text-center text-sm text-slate-400">
        © {name} · {business.ilce} / {business.il}
      </footer>

      <MobileBar cep={business.cep} whatsappLink={whatsappLink} />
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp'tan yazın"
        className="fixed bottom-6 right-6 z-30 hidden size-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 md:flex"
        style={{ background: whatsappGreen }}
      >
        <MessageCircle className="size-7" />
      </a>
    </div>
  );
}

// --- Bloklar ---

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>;
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {description && <p className="mt-3 text-lg text-slate-600">{description}</p>}
    </div>
  );
}

function TopBar({ business }: { business: Business }) {
  return (
    <div className="hidden bg-slate-950 text-sm text-slate-300 md:block">
      <Container className="flex h-10 items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 truncate">
          <MapPin className="size-4 shrink-0 text-[var(--accent)]" />
          {business.adres}
        </span>
        <span className="flex shrink-0 items-center gap-4">
          {business.sabit && (
            <a href={telHref(business.sabit)} className="flex items-center gap-1.5 hover:text-white">
              <Phone className="size-4 text-[var(--accent)]" /> {business.sabit}
            </a>
          )}
          <a href={telHref(business.cep)} className="flex items-center gap-1.5 hover:text-white">
            <Phone className="size-4 text-[var(--accent)]" /> {business.cep}
          </a>
        </span>
      </Container>
    </div>
  );
}

function Header({ name, cep, navItems }: { name: string; cep: string; navItems: { key: string; label: string }[] }) {
  const [first, ...rest] = name.split(" ");
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#" className="truncate text-lg font-extrabold uppercase tracking-tight">
          {first} {rest.length > 0 && <span className="text-[var(--accent)]">{rest.join(" ")}</span>}
        </a>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 lg:flex">
          {navItems.map((item) => (
            <a key={item.key} href={`#${item.key}`} className="hover:text-slate-950">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={telHref(cep)}
          className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
        >
          <Phone className="size-4" /> Hemen Ara
        </a>
      </Container>
    </header>
  );
}

function HeroBlock({ hero, business, whatsappLink }: { hero: Hero; business: Business; whatsappLink: string }) {
  const rating = business.googlePuan;
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">
      <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {hero.baslikOn} <span className="text-[var(--accent)]">{hero.baslikVurgu}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{hero.aciklama}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={telHref(business.cep)}
              className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-lg font-bold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
            >
              <Phone className="size-5" /> {business.cep}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full px-6 py-3.5 text-lg font-bold text-white hover:brightness-95"
              style={{ background: whatsappGreen }}
            >
              <MessageCircle className="size-5" /> WhatsApp&apos;tan Yaz
            </a>
          </div>
          {rating && (
            <a
              href={business.haritaLinki || undefined}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm"
            >
              <Stars value={rating} />
              <span>
                Google&apos;da {rating.toLocaleString("tr-TR")} / 5
                {business.yorumSayisi ? ` — ${business.yorumSayisi} yorum` : ""}
              </span>
            </a>
          )}
        </div>
        {hero.kartMaddeleri.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            {hero.kartBaslik && (
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--accent)]">{hero.kartBaslik}</p>
            )}
            <ul className="flex flex-col gap-3">
              {hero.kartMaddeleri.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}

function HighlightsBlock({ data }: { data: Highlights }) {
  if (data.kutular.length === 0) return null;
  return (
    <section className="border-b border-slate-200 bg-white">
      <Container className="grid grid-cols-2 divide-slate-200 py-8 md:grid-cols-4 md:divide-x">
        {data.kutular.map((item) => (
          <div key={item.deger} className="px-4 py-3 text-center">
            <p className="text-xl font-extrabold">{item.deger}</p>
            <p className="text-sm text-slate-500">{item.etiket}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}

function ServicesBlock({ data }: { data: Services }) {
  return (
    <section id="hizmetler" className="scroll-mt-16 bg-slate-50 py-16 md:py-20">
      <Container>
        <SectionHeading title={data.baslik} description={data.aciklama} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.liste.map((service) => (
            <article key={service.baslik} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent-hover)]">
                <SectionIcon name={service.ikon} className="size-6" />
              </div>
              <h3 className="text-lg font-bold">{service.baslik}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{service.aciklama}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function BrandsBlock({ data }: { data: Brands }) {
  if (data.markalar.length === 0) return null;
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <SectionHeading title={data.baslik} description={data.aciklama} />
        <ul className="flex flex-wrap justify-center gap-3">
          {data.markalar.map((brand) => (
            <li key={brand} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700">
              {brand}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function StepsBlock({ data }: { data: Steps }) {
  return (
    <section id="surec" className="scroll-mt-16 bg-slate-50 py-16 md:py-20">
      <Container>
        <SectionHeading title={data.baslik} description={data.aciklama} />
        <ol className="grid gap-5 md:grid-cols-3">
          {data.adimlar.map((step, i) => (
            <li key={step.baslik} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-[var(--accent)] font-extrabold text-[var(--accent-text)]">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold">{step.baslik}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{step.aciklama}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function FaqBlock({ data }: { data: Faq }) {
  return (
    <section id="sss" className="scroll-mt-16 bg-white py-16 md:py-20">
      <Container className="max-w-3xl">
        <SectionHeading title={data.baslik} description={data.aciklama} />
        <div className="flex flex-col gap-3">
          {data.sorular.map((item, i) => (
            <details key={item.soru} open={i === 0} className="group rounded-xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold">
                {item.soru}
                <ChevronDown className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-slate-600">{item.cevap}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function AreasBlock({ data }: { data: Areas }) {
  if (data.bolgeler.length === 0) return null;
  return (
    <section id="bolgeler" className="scroll-mt-16 bg-slate-50 py-16 md:py-20">
      <Container>
        <SectionHeading title={data.baslik} description={data.aciklama} />
        <ul className="flex flex-wrap justify-center gap-3">
          {data.bolgeler.map((area) => (
            <li key={area} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium">
              <MapPin className="size-4 text-[var(--accent-hover)]" /> {area}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function ReviewsBlock({ data, business }: { data: Reviews; business: Business }) {
  if (data.yorumlar.length === 0) return null;
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <SectionHeading
          title={data.baslik}
          description={
            business.googlePuan && business.yorumSayisi
              ? `Google'da ${business.yorumSayisi} yorumda ${business.googlePuan.toLocaleString("tr-TR")} / 5 puan.`
              : undefined
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {data.yorumlar.map((review) => (
            <figure key={review.ad + review.yorum.slice(0, 20)} className="flex flex-col rounded-2xl border border-slate-200 p-6">
              {review.puan && <Stars value={review.puan} />}
              <blockquote className="mt-3 flex-1 leading-relaxed text-slate-700">&ldquo;{review.yorum}&rdquo;</blockquote>
              <figcaption className="mt-4 font-semibold">{review.ad}</figcaption>
            </figure>
          ))}
        </div>
        {data.tumYorumlarLinki && (
          <p className="mt-8 text-center">
            <a href={data.tumYorumlarLinki} target="_blank" rel="noreferrer" className="font-semibold underline">
              Tüm yorumları Google&apos;da görün →
            </a>
          </p>
        )}
      </Container>
    </section>
  );
}

function ContactBlock({ data, business, whatsappLink }: { data: Contact; business: Business; whatsappLink: string }) {
  const mapQuery = encodeURIComponent(`${business.adres}, ${business.ilce}, ${business.il}`);
  const rows = [
    { label: "Adres", value: `${business.adres}, ${business.ilce} / ${business.il}`, href: business.haritaLinki || undefined, Icon: MapPin },
    business.sabit && { label: "Sabit", value: business.sabit, href: telHref(business.sabit), Icon: Phone },
    { label: "Cep", value: business.cep, href: telHref(business.cep), Icon: Phone },
    { label: "WhatsApp", value: business.whatsapp || business.cep, href: whatsappLink, Icon: MessageCircle },
    business.calismaSaatleri && { label: "Çalışma saatleri", value: business.calismaSaatleri, Icon: Clock },
  ].filter(Boolean) as { label: string; value: string; href?: string; Icon: typeof Phone }[];

  return (
    <section id="iletisim" className="scroll-mt-16 bg-slate-900 py-16 text-white md:py-20">
      <Container className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{data.baslik}</h2>
          {data.aciklama && <p className="mt-3 text-lg text-slate-300">{data.aciklama}</p>}
          <dl className="mt-8 flex flex-col gap-5">
            {rows.map(({ label, value, href, Icon }) => (
              <div key={label} className="flex gap-4">
                <Icon className="mt-1 size-5 shrink-0 text-[var(--accent)]" />
                <div>
                  <dt className="text-sm text-slate-400">{label}</dt>
                  <dd className="text-lg font-semibold">
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="hover:underline">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
        <iframe
          title={`${business.adres} haritası`}
          src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full rounded-2xl border-0 lg:h-full lg:min-h-80"
        />
      </Container>
    </section>
  );
}

function MobileBar({ cep, whatsappLink }: { cep: string; whatsappLink: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-slate-200 bg-white md:hidden">
      <a href={telHref(cep)} className="flex items-center justify-center gap-2 bg-[var(--accent)] py-4 font-bold text-[var(--accent-text)]">
        <Phone className="size-5" /> Hemen Ara
      </a>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 py-4 font-bold text-white"
        style={{ background: whatsappGreen }}
      >
        <MessageCircle className="size-5" /> WhatsApp
      </a>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="flex" aria-label={`5 üzerinden ${value.toLocaleString("tr-TR")} puan`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`size-4 ${n <= full ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} aria-hidden />
      ))}
    </span>
  );
}
