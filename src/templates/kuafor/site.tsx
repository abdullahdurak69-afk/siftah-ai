import { CalendarCheck, Camera, Clock, MessageCircle, Phone } from "lucide-react";
import { telHref } from "@/lib/turkish";
import type { ImageValue } from "../engine/fields";
import type { SectionRow } from "../engine/types";
import { cormorant } from "../fonts";
import { SectionIcon } from "../icons";
import {
  ContactBlock,
  Container,
  FaqBlock,
  GalleryBlock,
  Logo,
  MobileBar,
  RatingBadge,
  ReviewsBlock,
  SectionHeading,
  WhatsAppFloat,
  formatPrice,
  getContent,
  siteStyle,
  whatsappLinkFor,
  type BaseBusiness,
  type Hours,
  type ReviewsData,
} from "../shared/blocks";
import { kuaforSections } from "./sections";

// --- İçerik tipleri (sections.ts ile birebir) ---

type Business = BaseBusiness & { saatler: Hours };
type Hero = { ustBaslik: string; baslik: string; aciklama: string; gorsel?: ImageValue | null };
type Service = { ad: string; aciklama: string; sure: string; fiyat: number | null; fiyatNotu: string };
type Services = {
  baslik: string;
  aciklama: string;
  fiyatlariGoster: boolean;
  not: string;
  kategoriler: { ikon: string; ad: string; hizmetler: Service[] }[];
};
type Team = { baslik: string; aciklama: string; kisiler: { ad: string; unvan: string; fotograf?: ImageValue | null; uzmanliklar: string[] }[] };
type BeforeAfter = { baslik: string; aciklama: string; ciftler: { once?: ImageValue | null; sonra?: ImageValue | null; aciklama: string }[] };
type Gallery = { baslik: string; aciklama: string; fotograflar: ImageValue[] };
type Appointment = { baslik: string; aciklama: string };
type Faq = { baslik: string; aciklama: string; sorular: { soru: string; cevap: string }[] };
type Contact = { baslik: string; aciklama: string };

export function getKuaforContent(sections: SectionRow[]) {
  const { content, enabled, ordered } = getContent(sections);
  return {
    business: content<Business>("isletme"),
    hero: content<Hero>("hero"),
    services: content<Services>("hizmetler"),
    faq: content<Faq>("sss"),
    content,
    enabled,
    ordered,
  };
}

const appointmentText = "Merhaba, randevu almak istiyorum.\nHizmet:\nTarih ve saat:";

// Kuaför tasarımı: sıcak nötr tonlar, Cormorant başlıklar, kemerli fotoğraf çerçevesi
const kuaforVars = { "--font-heading": "var(--font-cormorant)", "--alt-bg": "#f7f3ef", "--dark-bg": "#1f1a17" };

export function KuaforSite({ name, theme, sections }: { name: string; theme: string; sections: SectionRow[] }) {
  const { business, content, enabled, ordered } = getKuaforContent(sections);
  const whatsappLink = whatsappLinkFor(business, appointmentText);
  const navItems = kuaforSections.filter((def) => def.navLabel && enabled(def.key));

  return (
    <div style={siteStyle(theme, kuaforVars)} className={`${cormorant.variable} flex min-h-full flex-1 flex-col bg-white pb-16 text-stone-900 md:pb-0`}>
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-white/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Logo name={name} logo={business.logo ?? null} className="text-2xl" />
          <nav className="hidden items-center gap-7 text-sm tracking-wide text-stone-600 lg:flex">
            {navItems.map((item) => (
              <a key={item.key} href={`#${item.key}`} className="hover:text-stone-950">
                {item.navLabel}
              </a>
            ))}
          </nav>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
          >
            <CalendarCheck className="size-4" /> Randevu Al
          </a>
        </Container>
      </header>

      <main className="flex-1">
        {ordered.map((section) => {
          switch (section.key) {
            case "hero":
              return <HeroBlock key={section.key} hero={content<Hero>("hero")} business={business} whatsappLink={whatsappLink} name={name} />;
            case "hizmetler":
              return <ServicesBlock key={section.key} data={content<Services>("hizmetler")} />;
            case "ekip":
              return <TeamBlock key={section.key} data={content<Team>("ekip")} />;
            case "oncesonra":
              return <BeforeAfterBlock key={section.key} data={content<BeforeAfter>("oncesonra")} />;
            case "galeri":
              return <GalleryBlock key={section.key} data={content<Gallery>("galeri")} name={name} alt />;
            case "randevu":
              return <AppointmentBlock key={section.key} data={content<Appointment>("randevu")} business={business} whatsappLink={whatsappLink} />;
            case "yorumlar":
              return <ReviewsBlock key={section.key} data={content<ReviewsData>("yorumlar")} business={business} />;
            case "sss":
              return <FaqBlock key={section.key} data={content<Faq>("sss")} />;
            case "iletisim":
              return (
                <ContactBlock key={section.key} data={content<Contact>("iletisim")} business={business} whatsappLink={whatsappLink} hours={business.saatler}>
                  {business.instagram && (
                    <a href={business.instagram} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:bg-white/10">
                      <Camera className="size-4" /> Instagram&apos;da bizi takip edin
                    </a>
                  )}
                </ContactBlock>
              );
            default:
              return null;
          }
        })}
      </main>

      <footer className="bg-[#14100e] py-8 text-center text-sm text-stone-400">
        <p className="font-heading text-2xl text-stone-200">{name}</p>
        <p className="mt-1">
          {business.ilce} / {business.il}
        </p>
      </footer>

      <MobileBar cep={business.cep} whatsappLink={whatsappLink} callLabel="Ara" whatsappLabel="Randevu" />
      <WhatsAppFloat href={whatsappLink} />
    </div>
  );
}

// --- Bloklar ---

function HeroBlock({ hero, business, whatsappLink, name }: { hero: Hero; business: Business; whatsappLink: string; name: string }) {
  return (
    <section className="overflow-hidden bg-[var(--alt-bg)]">
      <Container className="grid items-center gap-12 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div>
          {hero.ustBaslik && <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">{hero.ustBaslik}</p>}
          <h1 className="font-heading text-5xl font-semibold leading-[1.05] md:text-7xl">{hero.baslik}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">{hero.aciklama}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
            >
              <MessageCircle className="size-5" /> WhatsApp&apos;tan Randevu
            </a>
            <a href={telHref(business.cep)} className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-7 py-3.5 font-semibold hover:border-stone-500">
              <Phone className="size-5" /> {business.cep}
            </a>
          </div>
          <RatingBadge business={business} className="mt-6 border-stone-300 bg-white" />
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rounded-t-full border border-[var(--accent)]/40" aria-hidden />
          {hero.gorsel ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.gorsel.src}
              srcSet={`${hero.gorsel.srcSmall} 640w, ${hero.gorsel.src} 1600w`}
              sizes="(min-width: 768px) 400px, 90vw"
              alt={name}
              fetchPriority="high"
              className="relative aspect-[3/4] w-full rounded-t-full object-cover"
            />
          ) : (
            <div className="relative flex aspect-[3/4] w-full items-center justify-center rounded-t-full bg-gradient-to-b from-[var(--accent)]/25 to-[var(--accent)]/5">
              <span className="px-8 text-center font-heading text-4xl font-semibold text-[var(--accent-hover)]">{name}</span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function ServicesBlock({ data }: { data: Services }) {
  const categories = data.kategoriler.filter((c) => c.hizmetler.length > 0);
  return (
    <section id="hizmetler" className="scroll-mt-16 bg-white py-16 md:py-24">
      <Container className="max-w-5xl">
        <SectionHeading eyebrow="Hizmetler" title={data.baslik} description={data.aciklama} />
        <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
          {categories.map((category, i) => (
            <div key={category.ad + i}>
              <h3 className="flex items-center gap-3 border-b border-stone-200 pb-3 font-heading text-3xl font-semibold">
                <SectionIcon name={category.ikon} className="size-5 text-[var(--accent)]" />
                {category.ad}
              </h3>
              <ul className="mt-4 flex flex-col gap-4">
                {category.hizmetler.map((service, j) => (
                  <li key={service.ad + j}>
                    <div className="flex items-baseline gap-2">
                      <p className="font-medium">{service.ad}</p>
                      {data.fiyatlariGoster && service.fiyat !== null && (
                        <>
                          <span className="min-w-4 flex-1 border-b border-dotted border-stone-300" aria-hidden />
                          <p className="shrink-0 tabular-nums">
                            {service.fiyatNotu && <span className="mr-1 text-xs text-stone-500">{service.fiyatNotu}</span>}
                            <span className="font-semibold">{formatPrice(service.fiyat)}</span>
                          </p>
                        </>
                      )}
                    </div>
                    {(service.aciklama || service.sure) && (
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-stone-500">
                        {service.aciklama && <span>{service.aciklama}</span>}
                        {service.sure && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5" /> {service.sure}
                          </span>
                        )}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {data.not && <p className="mt-10 text-center text-sm text-stone-500">{data.not}</p>}
      </Container>
    </section>
  );
}

function TeamBlock({ data }: { data: Team }) {
  if (data.kisiler.length === 0) return null;
  return (
    <section id="ekip" className="scroll-mt-16 bg-[var(--alt-bg)] py-16 md:py-24">
      <Container>
        <SectionHeading eyebrow="Ekip" title={data.baslik} description={data.aciklama} />
        <ul className="flex flex-wrap justify-center gap-10">
          {data.kisiler.map((person) => (
            <li key={person.ad} className="flex w-56 flex-col items-center text-center">
              {person.fotograf ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={person.fotograf.srcSmall} alt={person.ad} loading="lazy" className="size-44 rounded-full object-cover" />
              ) : (
                <span className="flex size-44 items-center justify-center rounded-full bg-white font-heading text-5xl text-[var(--accent)]">
                  {person.ad.slice(0, 1)}
                </span>
              )}
              <p className="mt-4 font-heading text-2xl font-semibold">{person.ad}</p>
              {person.unvan && <p className="text-sm text-stone-500">{person.unvan}</p>}
              {person.uzmanliklar.length > 0 && (
                <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {person.uzmanliklar.map((u) => (
                    <li key={u} className="rounded-full bg-white px-2.5 py-0.5 text-xs text-stone-600">
                      {u}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function BeforeAfterBlock({ data }: { data: BeforeAfter }) {
  const pairs = data.ciftler.filter((p) => p.once && p.sonra);
  if (pairs.length === 0) return null;
  return (
    <section id="oncesonra" className="scroll-mt-16 bg-white py-16 md:py-24">
      <Container>
        <SectionHeading eyebrow="Çalışmalarımız" title={data.baslik} description={data.aciklama} />
        <ul className="grid gap-8 md:grid-cols-2">
          {pairs.map((pair, i) => (
            <li key={pair.once!.id + i}>
              <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl">
                {(["once", "sonra"] as const).map((key) => (
                  <figure key={key} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pair[key]!.srcSmall} alt={`${pair.aciklama || "Çalışma"} — ${key === "once" ? "önce" : "sonra"}`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                    <figcaption className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                      {key === "once" ? "Önce" : "Sonra"}
                    </figcaption>
                  </figure>
                ))}
              </div>
              {pair.aciklama && <p className="mt-3 text-center font-heading text-xl">{pair.aciklama}</p>}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function AppointmentBlock({ data, business, whatsappLink }: { data: Appointment; business: Business; whatsappLink: string }) {
  return (
    <section className="bg-[var(--dark-bg)] py-16 text-center text-white">
      <Container className="max-w-2xl">
        <CalendarCheck className="mx-auto size-8 text-[var(--accent)]" />
        <h2 className="mt-4 font-heading text-4xl font-semibold md:text-5xl">{data.baslik}</h2>
        {data.aciklama && <p className="mt-4 text-lg text-white/75">{data.aciklama}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]">
            <MessageCircle className="size-5" /> WhatsApp&apos;tan Yazın
          </a>
          <a href={telHref(business.cep)} className="flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10">
            <Phone className="size-5" /> {business.cep}
          </a>
        </div>
      </Container>
    </section>
  );
}
