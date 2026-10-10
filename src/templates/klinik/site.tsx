import { CalendarCheck, Camera, MessageCircle, Phone, Siren } from "lucide-react";
import { telHref } from "@/lib/turkish";
import type { ImageValue } from "../engine/fields";
import type { SectionRow } from "../engine/types";
import { SectionIcon } from "../icons";
import {
  ContactBlock,
  Container,
  CoverImage,
  FaqBlock,
  GalleryBlock,
  Logo,
  MobileBar,
  SectionHeading,
  WhatsAppFloat,
  getContent,
  siteStyle,
  whatsappLinkFor,
  type BaseBusiness,
  type Hours,
  PlatformCredit,
} from "../shared/blocks";
import { klinikSections } from "./sections";

// --- İçerik tipleri (sections.ts ile birebir) ---

type Business = BaseBusiness & { saatler: Hours; acilNotu: string };
type Hero = { ustBaslik: string; baslik: string; aciklama: string; gorsel?: ImageValue | null };
type About = { baslik: string; metin: string; gorsel?: ImageValue | null };
type Services = { baslik: string; aciklama: string; liste: { ikon: string; baslik: string; aciklama: string }[] };
type Staff = {
  baslik: string;
  aciklama: string;
  kisiler: { unvan: string; ad: string; uzmanlik: string; fotograf?: ImageValue | null; ozgecmis: string }[];
};
type Gallery = { baslik: string; aciklama: string; fotograflar: ImageValue[] };
type Appointment = { baslik: string; aciklama: string };
type Faq = { baslik: string; aciklama: string; sorular: { soru: string; cevap: string }[] };
type Contact = { baslik: string; aciklama: string };

export function getKlinikContent(sections: SectionRow[]) {
  const { content, enabled, ordered } = getContent(sections);
  return {
    business: content<Business>("isletme"),
    hero: content<Hero>("hero"),
    services: content<Services>("hizmetler"),
    staff: content<Staff>("hekimler"),
    faq: content<Faq>("sss"),
    content,
    enabled,
    ordered,
  };
}

// Klinik tasarımı: ferah, soğuk tonlar, sade yazı tipi; iletişim bölümü açık renkte
const klinikVars = { "--alt-bg": "#f2f7f8", "--dark-bg": "#0b2530" };

export function KlinikSite({ name, theme, sections }: { name: string; theme: string; sections: SectionRow[] }) {
  const { business, content, enabled, ordered } = getKlinikContent(sections);
  const whatsappLink = whatsappLinkFor(business, "Merhaba, randevu almak istiyorum.");
  const navItems = klinikSections.filter((def) => def.navLabel && enabled(def.key));

  return (
    <div style={siteStyle(theme, klinikVars)} className="flex min-h-full flex-1 flex-col bg-white pb-16 text-slate-900 md:pb-0">
      {business.acilNotu && (
        <div className="bg-[var(--dark-bg)] px-4 py-2 text-center text-sm text-white">
          <a href={telHref(business.cep)} className="inline-flex items-center gap-2 hover:underline">
            <Siren className="size-4 text-[var(--accent)]" /> {business.acilNotu} · {business.cep}
          </a>
        </div>
      )}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Logo name={name} logo={business.logo ?? null} className="font-semibold" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            {navItems.map((item) => (
              <a key={item.key} href={`#${item.key}`} className="hover:text-slate-950">
                {item.navLabel}
              </a>
            ))}
          </nav>
          <a
            href={telHref(business.cep)}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
          >
            <Phone className="size-4" /> Randevu
          </a>
        </Container>
      </header>

      <main className="flex-1">
        {ordered.map((section) => {
          switch (section.key) {
            case "hero":
              return <HeroBlock key={section.key} hero={content<Hero>("hero")} business={business} whatsappLink={whatsappLink} />;
            case "hakkimizda":
              return <AboutBlock key={section.key} data={content<About>("hakkimizda")} name={name} />;
            case "hizmetler":
              return <ServicesBlock key={section.key} data={content<Services>("hizmetler")} />;
            case "hekimler":
              return <StaffBlock key={section.key} data={content<Staff>("hekimler")} />;
            case "galeri":
              return <GalleryBlock key={section.key} data={content<Gallery>("galeri")} name={name} />;
            case "randevu":
              return <AppointmentBlock key={section.key} data={content<Appointment>("randevu")} business={business} whatsappLink={whatsappLink} />;
            case "sss":
              return <FaqBlock key={section.key} data={content<Faq>("sss")} />;
            case "iletisim":
              return (
                <ContactBlock key={section.key} data={content<Contact>("iletisim")} business={business} whatsappLink={whatsappLink} hours={business.saatler} tone="light">
                  {business.instagram && (
                    <a href={business.instagram} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:border-slate-500">
                      <Camera className="size-4" /> Instagram
                    </a>
                  )}
                </ContactBlock>
              );
            default:
              return null;
          }
        })}
      </main>

      <footer className="bg-[var(--dark-bg)] py-8 text-center text-sm text-slate-400">
        <p className="font-semibold text-slate-200">{name}</p>
        <p className="mt-1">
          {business.ilce} / {business.il}
        </p>
        <p className="mx-auto mt-4 max-w-xl px-4 text-xs text-slate-500">
          Bu sitedeki bilgiler genel bilgilendirme amaçlıdır; tanı ve tedavi için mutlaka hekiminize danışınız.
        </p>
        <PlatformCredit />
      </footer>

      <MobileBar cep={business.cep} whatsappLink={whatsappLink} callLabel="Randevu" />
      <WhatsAppFloat href={whatsappLink} />
    </div>
  );
}

// --- Bloklar ---

function HeroBlock({ hero, business, whatsappLink }: { hero: Hero; business: Business; whatsappLink: string }) {
  return (
    <section className="bg-gradient-to-b from-[var(--alt-bg)] to-white">
      <Container className={`grid items-center gap-10 py-16 md:py-24 ${hero.gorsel ? "lg:grid-cols-2" : "max-w-3xl text-center"}`}>
        <div>
          {hero.ustBaslik && <p className="mb-3 text-sm font-semibold text-[var(--accent-hover)]">{hero.ustBaslik}</p>}
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{hero.baslik}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{hero.aciklama}</p>
          <div className={`mt-8 flex flex-wrap gap-3 ${hero.gorsel ? "" : "justify-center"}`}>
            <a href={telHref(business.cep)} className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]">
              <Phone className="size-5" /> {business.cep}
            </a>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 font-semibold hover:border-slate-500">
              <MessageCircle className="size-5" /> WhatsApp&apos;tan Yazın
            </a>
          </div>
        </div>
        {hero.gorsel && <CoverImage image={hero.gorsel} priority className="aspect-[4/3] w-full rounded-3xl" />}
      </Container>
    </section>
  );
}

function AboutBlock({ data, name }: { data: About; name: string }) {
  return (
    <section id="hakkimizda" className="scroll-mt-16 bg-white py-16 md:py-20">
      <Container className={`grid items-center gap-12 ${data.gorsel ? "md:grid-cols-2" : "max-w-3xl"}`}>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{data.baslik}</h2>
          <div className="mt-5 flex flex-col gap-4 text-lg leading-relaxed text-slate-600">
            {data.metin.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        {data.gorsel && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.gorsel.srcSmall} alt={name} loading="lazy" className="aspect-square w-full rounded-3xl object-cover" />
        )}
      </Container>
    </section>
  );
}

function ServicesBlock({ data }: { data: Services }) {
  return (
    <section id="hizmetler" className="scroll-mt-16 bg-[var(--alt-bg)] py-16 md:py-20">
      <Container>
        <SectionHeading title={data.baslik} description={data.aciklama} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.liste.map((service) => (
            <article key={service.baslik} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent-hover)]">
                <SectionIcon name={service.ikon} className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{service.baslik}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{service.aciklama}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StaffBlock({ data }: { data: Staff }) {
  if (data.kisiler.length === 0) return null;
  return (
    <section id="hekimler" className="scroll-mt-16 bg-white py-16 md:py-20">
      <Container>
        <SectionHeading title={data.baslik} description={data.aciklama} />
        <ul className="grid gap-6 md:grid-cols-2">
          {data.kisiler.map((person) => (
            <li key={person.ad} className="flex gap-5 rounded-2xl border border-slate-200 p-5">
              {person.fotograf ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={person.fotograf.srcSmall} alt={`${person.unvan} ${person.ad}`.trim()} loading="lazy" className="size-28 shrink-0 rounded-xl object-cover" />
              ) : (
                <span className="flex size-28 shrink-0 items-center justify-center rounded-xl bg-[var(--alt-bg)] text-3xl font-semibold text-[var(--accent-hover)]">
                  {person.ad.slice(0, 1)}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-lg font-semibold">
                  {person.unvan && <span className="text-slate-500">{person.unvan} </span>}
                  {person.ad}
                </p>
                {person.uzmanlik && <p className="text-sm font-medium text-[var(--accent-hover)]">{person.uzmanlik}</p>}
                {person.ozgecmis && <p className="mt-2 text-sm leading-relaxed text-slate-600">{person.ozgecmis}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function AppointmentBlock({ data, business, whatsappLink }: { data: Appointment; business: Business; whatsappLink: string }) {
  return (
    <section className="bg-[var(--dark-bg)] py-14 text-white">
      <Container className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="max-w-xl">
          <h2 className="flex items-center justify-center gap-3 text-2xl font-semibold md:justify-start md:text-3xl">
            <CalendarCheck className="size-7 text-[var(--accent)]" /> {data.baslik}
          </h2>
          {data.aciklama && <p className="mt-2 text-white/75">{data.aciklama}</p>}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={telHref(business.cep)} className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]">
            <Phone className="size-5" /> Ara
          </a>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 font-semibold hover:bg-white/10">
            <MessageCircle className="size-5" /> WhatsApp
          </a>
        </div>
      </Container>
    </section>
  );
}
