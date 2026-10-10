import { Check, MapPin, MessageCircle, Phone } from "lucide-react";
import { telHref } from "@/lib/turkish";
import type { ImageValue } from "../engine/fields";
import type { SectionRow } from "../engine/types";
import { SectionIcon } from "../icons";
import {
  ContactBlock,
  Container,
  FaqBlock,
  GalleryBlock,
  MobileBar,
  ReviewsBlock,
  SectionHeading,
  Stars,
  WhatsAppFloat,
  getContent,
  siteStyle,
  whatsappGreen,
  whatsappLinkFor,
  type BaseBusiness,
  type ReviewsData,
} from "../shared/blocks";
import { ustaSections } from "./sections";

// --- İçerik tipleri (sections.ts ile birebir) ---

type Business = BaseBusiness & { calismaSaatleri: string };
type Hero = {
  baslikOn: string;
  baslikVurgu: string;
  aciklama: string;
  kartBaslik: string;
  kartMaddeleri: string[];
  gorsel?: ImageValue | null;
};
type Gallery = { baslik: string; aciklama: string; fotograflar: ImageValue[] };
type Highlights = { kutular: { deger: string; etiket: string }[] };
type Services = { baslik: string; aciklama: string; liste: { ikon: string; baslik: string; aciklama: string }[] };
type Brands = { baslik: string; aciklama: string; markalar: string[] };
type Steps = { baslik: string; aciklama: string; adimlar: { baslik: string; aciklama: string }[] };
type Faq = { baslik: string; aciklama: string; sorular: { soru: string; cevap: string }[] };
type Areas = { baslik: string; aciklama: string; bolgeler: string[] };
type Contact = { baslik: string; aciklama: string };

export type UstaSiteData = {
  name: string;
  theme: string;
  sections: SectionRow[];
};

export function getUstaContent(sections: SectionRow[]) {
  const { content, enabled } = getContent(sections);
  return {
    business: content<Business>("isletme"),
    hero: content<Hero>("hero"),
    faq: content<Faq>("sss"),
    areas: content<Areas>("bolgeler"),
    content,
    enabled,
  };
}

export function UstaSite({ name, theme, sections }: UstaSiteData) {
  const { business, content, enabled } = getUstaContent(sections);
  const whatsappLink = whatsappLinkFor(business, "Merhaba, web sitenizden ulaşıyorum.");
  const style = siteStyle(theme);

  const ordered = [...sections].sort((a, b) => a.position - b.position).filter((s) => s.enabled);
  const navItems = ustaSections.filter((def) => def.navLabel && enabled(def.key));

  return (
    <div style={style} className="flex min-h-full flex-1 flex-col bg-white pb-16 text-slate-900 md:pb-0">
      <TopBar business={business} />
      <Header name={name} logo={business.logo ?? null} cep={business.cep} navItems={navItems.map((d) => ({ key: d.key, label: d.navLabel! }))} />

      <main className="flex-1">
        {ordered.map((section) => {
          switch (section.key) {
            case "hero":
              return <HeroBlock key={section.key} hero={content<Hero>("hero")} business={business} whatsappLink={whatsappLink} />;
            case "one_cikanlar":
              return <HighlightsBlock key={section.key} data={content<Highlights>("one_cikanlar")} />;
            case "hizmetler":
              return <ServicesBlock key={section.key} data={content<Services>("hizmetler")} />;
            case "galeri":
              return <GalleryBlock key={section.key} data={content<Gallery>("galeri")} name={name} />;
            case "markalar":
              return <BrandsBlock key={section.key} data={content<Brands>("markalar")} />;
            case "surec":
              return <StepsBlock key={section.key} data={content<Steps>("surec")} />;
            case "sss":
              return <FaqBlock key={section.key} data={content<Faq>("sss")} />;
            case "bolgeler":
              return <AreasBlock key={section.key} data={content<Areas>("bolgeler")} />;
            case "yorumlar":
              return <ReviewsBlock key={section.key} data={content<ReviewsData>("yorumlar")} business={business} />;
            case "iletisim":
              return (
                <ContactBlock
                  key={section.key}
                  data={content<Contact>("iletisim")}
                  business={business}
                  whatsappLink={whatsappLink}
                  hours={business.calismaSaatleri}
                />
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
      <WhatsAppFloat href={whatsappLink} />
    </div>
  );
}

// --- Bloklar ---



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

function Header({
  name,
  logo,
  cep,
  navItems,
}: {
  name: string;
  logo: ImageValue | null;
  cep: string;
  navItems: { key: string; label: string }[];
}) {
  const [first, ...rest] = name.split(" ");
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        {logo ? (
          <a href="#" className="flex h-11 shrink-0 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.srcSmall} alt={name} width={logo.width} height={logo.height} className="h-full w-auto max-w-48 object-contain" />
          </a>
        ) : (
          <a href="#" className="truncate text-lg font-extrabold uppercase tracking-tight">
            {first} {rest.length > 0 && <span className="text-[var(--accent)]">{rest.join(" ")}</span>}
          </a>
        )}
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
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">
      {hero.gorsel && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.gorsel.src}
            srcSet={`${hero.gorsel.srcSmall} 640w, ${hero.gorsel.src} 1600w`}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-900/60" />
        </>
      )}
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




