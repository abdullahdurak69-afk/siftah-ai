import Link from "next/link";
import { Bike, Camera, MessageCircle, Phone, UtensilsCrossed } from "lucide-react";
import { telHref, whatsappHref } from "@/lib/turkish";
import type { ImageValue } from "../engine/fields";
import type { SectionRow } from "../engine/types";
import { fraunces } from "../fonts";
import { SectionIcon } from "../icons";
import {
  ContactBlock,
  Container,
  CoverImage,
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
import { restoranSections } from "./sections";

// --- İçerik tipleri (sections.ts ile birebir) ---

type Business = BaseBusiness & { saatler: Hours; yemeksepeti: string; getir: string; trendyol: string };
type Hero = { ustBaslik: string; baslik: string; aciklama: string; gorsel?: ImageValue | null };
type Features = { liste: { ikon: string; baslik: string; aciklama: string }[] };
type About = { baslik: string; metin: string; gorsel?: ImageValue | null };
export type MenuItem = { ad: string; aciklama: string; fiyat: number | null; fotograf?: ImageValue | null; etiketler: string[] };
export type Menu = {
  baslik: string;
  aciklama: string;
  fiyatlariGoster: boolean;
  not: string;
  kategoriler: { ad: string; aciklama: string; urunler: MenuItem[] }[];
};
type Gallery = { baslik: string; aciklama: string; fotograflar: ImageValue[] };
type Reservation = { baslik: string; aciklama: string };
type Faq = { baslik: string; aciklama: string; sorular: { soru: string; cevap: string }[] };
type Contact = { baslik: string; aciklama: string };

export function getRestoranContent(sections: SectionRow[]) {
  const { content, enabled, ordered } = getContent(sections);
  return {
    business: content<Business>("isletme"),
    hero: content<Hero>("hero"),
    menu: content<Menu>("menu"),
    faq: content<Faq>("sss"),
    content,
    enabled,
    ordered,
  };
}

const reservationText = "Merhaba, rezervasyon yaptırmak istiyorum.\nTarih:\nSaat:\nKişi sayısı:";

function orderLinks(business: Business) {
  return [
    business.yemeksepeti && { label: "Yemeksepeti", href: business.yemeksepeti },
    business.getir && { label: "Getir Yemek", href: business.getir },
    business.trendyol && { label: "Trendyol Yemek", href: business.trendyol },
  ].filter(Boolean) as { label: string; href: string }[];
}

// Restoran tasarımı: krem tonlar, serif başlıklar (Fraunces), fotoğraf ağırlıklı giriş
const restoranVars = { "--font-heading": "var(--font-fraunces)", "--alt-bg": "#faf6f0", "--dark-bg": "#1c1917" };

export function RestoranSite({ name, theme, sections }: { name: string; theme: string; sections: SectionRow[] }) {
  const { business, content, enabled, ordered } = getRestoranContent(sections);
  const reservation = enabled("rezervasyon");
  const whatsappLink = whatsappLinkFor(business, reservation ? reservationText : "Merhaba, web sitenizden ulaşıyorum.");
  const navItems = restoranSections.filter((def) => def.navLabel && enabled(def.key));
  const orders = orderLinks(business);

  return (
    <div
      style={siteStyle(theme, restoranVars)}
      className={`${fraunces.variable} flex min-h-full flex-1 flex-col bg-white pb-16 text-stone-900 md:pb-0`}
    >
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#fffdf9]/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Logo name={name} logo={business.logo ?? null} />
          <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 lg:flex">
            {navItems.map((item) => (
              <a key={item.key} href={`#${item.key}`} className="hover:text-stone-950">
                {item.navLabel}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <a href="#menu" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-stone-100 lg:hidden">
              Menü
            </a>
            <a
              href={reservation ? whatsappLink : telHref(business.cep)}
              target={reservation ? "_blank" : undefined}
              rel="noreferrer"
              className="hidden rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)] sm:block"
            >
              {reservation ? "Rezervasyon" : "Hemen Ara"}
            </a>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        {ordered.map((section) => {
          switch (section.key) {
            case "hero":
              return (
                <HeroBlock
                  key={section.key}
                  hero={content<Hero>("hero")}
                  business={business}
                  whatsappLink={whatsappLink}
                  reservation={reservation}
                  orderHref={orders[0]?.href}
                />
              );
            case "ozellikler":
              return <FeaturesBlock key={section.key} data={content<Features>("ozellikler")} />;
            case "hakkimizda":
              return <AboutBlock key={section.key} data={content<About>("hakkimizda")} name={name} />;
            case "menu":
              return <MenuBlock key={section.key} menu={content<Menu>("menu")} />;
            case "galeri":
              return <GalleryBlock key={section.key} data={content<Gallery>("galeri")} name={name} />;
            case "rezervasyon":
              return <ReservationBlock key={section.key} data={content<Reservation>("rezervasyon")} business={business} whatsappLink={whatsappLink} />;
            case "yorumlar":
              return <ReviewsBlock key={section.key} data={content<ReviewsData>("yorumlar")} business={business} alt />;
            case "sss":
              return <FaqBlock key={section.key} data={content<Faq>("sss")} />;
            case "iletisim":
              return (
                <ContactBlock key={section.key} data={content<Contact>("iletisim")} business={business} whatsappLink={whatsappLink} hours={business.saatler}>
                  <ExtraLinks business={business} orders={orders} />
                </ContactBlock>
              );
            default:
              return null;
          }
        })}
      </main>

      <footer className="bg-stone-950 py-8 text-center text-sm text-stone-400">
        <p className="font-heading text-lg text-stone-200">{name}</p>
        <p className="mt-1">
          {business.ilce} / {business.il} · <a href="/menu" className="underline hover:text-white">Menü</a>
        </p>
      </footer>

      <MobileBar cep={business.cep} whatsappLink={whatsappLink} callLabel="Ara" whatsappLabel={reservation ? "Rezervasyon" : "WhatsApp"} />
      <WhatsAppFloat href={whatsappLink} />
    </div>
  );
}

// --- Bloklar ---

function HeroBlock({
  hero,
  business,
  whatsappLink,
  reservation,
  orderHref,
}: {
  hero: Hero;
  business: Business;
  whatsappLink: string;
  reservation: boolean;
  orderHref?: string;
}) {
  const image = hero.gorsel;
  const buttons = (light: boolean) => (
    <div className={`mt-8 flex flex-wrap gap-3 ${light ? "" : "justify-center"}`}>
      <a
        href="#menu"
        className={`flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold ${light ? "bg-white text-stone-900 hover:bg-stone-100" : "bg-stone-900 text-white hover:bg-stone-800"}`}
      >
        <UtensilsCrossed className="size-5" /> Menüyü İncele
      </a>
      <a
        href={reservation ? whatsappLink : telHref(business.cep)}
        target={reservation ? "_blank" : undefined}
        rel="noreferrer"
        className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
      >
        {reservation ? <MessageCircle className="size-5" /> : <Phone className="size-5" />}
        {reservation ? "Rezervasyon Yap" : business.cep}
      </a>
      {orderHref && (
        <a
          href={orderHref}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-2 rounded-full border px-6 py-3.5 font-semibold ${light ? "border-white/40 text-white hover:bg-white/10" : "border-stone-300 hover:bg-stone-100"}`}
        >
          <Bike className="size-5" /> Online Sipariş
        </a>
      )}
    </div>
  );

  if (image) {
    return (
      <section className="relative isolate flex min-h-[72vh] items-end overflow-hidden bg-stone-900 text-white">
        <CoverImage image={image} priority className="absolute inset-0 -z-20 size-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        <Container className="pb-14 pt-32 md:pb-20">
          {hero.ustBaslik && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{hero.ustBaslik}</p>}
          <h1 className="max-w-3xl font-heading text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">{hero.baslik}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{hero.aciklama}</p>
          {buttons(true)}
          <RatingBadge business={business} className="mt-6 border-white/20 bg-black/20 text-white" />
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[var(--alt-bg)] py-20 text-center md:py-28">
      <Container className="max-w-3xl">
        {hero.ustBaslik && <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{hero.ustBaslik}</p>}
        <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">{hero.baslik}</h1>
        <span className="mx-auto mt-6 block h-1 w-16 rounded-full bg-[var(--accent)]" />
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600">{hero.aciklama}</p>
        {buttons(false)}
        <RatingBadge business={business} className="mt-6 border-stone-300 bg-white" />
      </Container>
    </section>
  );
}

function FeaturesBlock({ data }: { data: Features }) {
  if (data.liste.length === 0) return null;
  return (
    <section className="border-b border-stone-200 bg-white">
      <Container className="grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
        {data.liste.map((item) => (
          <div key={item.baslik} className="flex flex-col items-center gap-2 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
              <SectionIcon name={item.ikon} className="size-6" />
            </span>
            <p className="font-semibold">{item.baslik}</p>
            {item.aciklama && <p className="text-sm text-stone-500">{item.aciklama}</p>}
          </div>
        ))}
      </Container>
    </section>
  );
}

function AboutBlock({ data, name }: { data: About; name: string }) {
  return (
    <section id="hakkimizda" className="scroll-mt-16 bg-white py-16 md:py-24">
      <Container className={`grid items-center gap-12 ${data.gorsel ? "md:grid-cols-2" : "max-w-3xl text-center"}`}>
        {data.gorsel && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.gorsel.src}
            srcSet={`${data.gorsel.srcSmall} 640w, ${data.gorsel.src} 1600w`}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt={name}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-3xl object-cover"
          />
        )}
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Hakkımızda</p>
          <h2 className="font-heading text-4xl font-semibold tracking-tight">{data.baslik}</h2>
          <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-stone-600">
            {data.metin.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function MenuBlock({ menu }: { menu: Menu }) {
  const categories = menu.kategoriler.filter((c) => c.urunler.length > 0);
  return (
    <section id="menu" className="scroll-mt-16 bg-[var(--alt-bg)] py-16 md:py-24">
      <Container className="max-w-5xl">
        <SectionHeading eyebrow="Menü" title={menu.baslik} description={menu.aciklama} />
        {categories.length > 1 && (
          <nav aria-label="Menü kategorileri" className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map((c, i) => (
              <a key={c.ad + i} href={`#menu-${i}`} className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm font-medium hover:border-stone-500">
                {c.ad}
              </a>
            ))}
          </nav>
        )}
        <MenuCategories menu={menu} layout="columns" />
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          {menu.not && <p className="text-sm text-stone-500">{menu.not}</p>}
          <a href="/menu" className="rounded-full border border-stone-300 bg-white px-5 py-2 text-sm font-semibold hover:border-stone-500">
            Menüyü tam sayfa aç
          </a>
        </div>
      </Container>
    </section>
  );
}

// Menü kategorileri: ana sayfada iki sütun, QR menü sayfasında tek sütun
export function MenuCategories({ menu, layout }: { menu: Menu; layout: "columns" | "list" }) {
  const categories = menu.kategoriler.filter((c) => c.urunler.length > 0);
  return (
    <div className={layout === "columns" ? "flex flex-col gap-14" : "flex flex-col gap-10"}>
      {categories.map((category, i) => (
        <div key={category.ad + i} id={`menu-${i}`} className="scroll-mt-28">
          <h3 className="font-heading text-2xl font-semibold md:text-3xl">{category.ad}</h3>
          {category.aciklama && <p className="mt-1 text-stone-500">{category.aciklama}</p>}
          <ul className={`mt-6 grid gap-x-12 gap-y-6 ${layout === "columns" ? "md:grid-cols-2" : ""}`}>
            {category.urunler.map((item, j) => (
              <MenuItemRow key={item.ad + j} item={item} showPrice={menu.fiyatlariGoster} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MenuItemRow({ item, showPrice }: { item: MenuItem; showPrice: boolean }) {
  return (
    <li className="flex gap-4">
      {item.fotograf && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.fotograf.srcSmall}
          alt={item.ad}
          width={item.fotograf.width}
          height={item.fotograf.height}
          loading="lazy"
          className="size-20 shrink-0 rounded-xl object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="font-semibold">{item.ad}</p>
          {showPrice && item.fiyat !== null && (
            <>
              <span className="min-w-4 flex-1 border-b border-dotted border-stone-400" aria-hidden />
              <p className="shrink-0 font-semibold tabular-nums text-[var(--accent)]">{formatPrice(item.fiyat)}</p>
            </>
          )}
        </div>
        {item.aciklama && <p className="mt-1 text-sm leading-relaxed text-stone-600">{item.aciklama}</p>}
        {item.etiketler.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {item.etiketler.map((tag) => (
              <li key={tag} className="rounded-full bg-stone-900/5 px-2 py-0.5 text-xs font-medium text-stone-700">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

function ReservationBlock({ data, business, whatsappLink }: { data: Reservation; business: Business; whatsappLink: string }) {
  return (
    <section className="bg-[var(--accent)] py-16 text-center text-[var(--accent-text)]">
      <Container className="max-w-2xl">
        <h2 className="font-heading text-4xl font-semibold tracking-tight">{data.baslik}</h2>
        {data.aciklama && <p className="mt-4 text-lg opacity-90">{data.aciklama}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-stone-900 hover:bg-stone-100">
            <MessageCircle className="size-5" /> WhatsApp&apos;tan Yazın
          </a>
          <a href={telHref(business.cep)} className="flex items-center gap-2 rounded-full border border-current px-6 py-3.5 font-semibold hover:bg-white/10">
            <Phone className="size-5" /> {business.cep}
          </a>
        </div>
      </Container>
    </section>
  );
}

function ExtraLinks({ business, orders }: { business: Business; orders: { label: string; href: string }[] }) {
  if (orders.length === 0 && !business.instagram) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {orders.map((o) => (
        <a key={o.href} href={o.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:bg-white/10">
          <Bike className="size-4" /> {o.label}
        </a>
      ))}
      {business.instagram && (
        <a href={business.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:bg-white/10">
          <Camera className="size-4" /> Instagram
        </a>
      )}
    </div>
  );
}

// --- QR menü sayfası (/menu): masada telefondan açılır, sadece menü ve iletişim ---

export function RestoranMenuPage({ name, theme, sections }: { name: string; theme: string; sections: SectionRow[] }) {
  const { business, menu } = getRestoranContent(sections);
  const categories = menu.kategoriler.filter((c) => c.urunler.length > 0);
  const whatsappLink = whatsappHref(business.whatsapp || business.cep, "Merhaba, menünüzle ilgili bir sorum var.");

  return (
    <div style={siteStyle(theme, restoranVars)} className={`${fraunces.variable} flex min-h-full flex-1 flex-col bg-[var(--alt-bg)] text-stone-900`}>
      <header className="bg-white px-4 pb-5 pt-8 text-center">
        {business.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={business.logo.srcSmall} alt={name} className="mx-auto h-14 w-auto max-w-56 object-contain" />
        ) : (
          <p className="font-heading text-3xl font-semibold">{name}</p>
        )}
        <h1 className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">Menü</h1>
      </header>

      {categories.length > 1 && (
        <nav aria-label="Kategoriler" className="sticky top-0 z-10 border-y border-stone-200 bg-white/95 backdrop-blur">
          <ul className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-4 py-3">
            {categories.map((c, i) => (
              <li key={c.ad + i} className="shrink-0">
                <a href={`#menu-${i}`} className="block rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium">
                  {c.ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <MenuCategories menu={menu} layout="list" />
        {menu.not && <p className="mt-10 text-center text-sm text-stone-500">{menu.not}</p>}
      </main>

      <footer className="bg-white px-4 py-8 text-center">
        <div className="flex justify-center gap-3">
          <a href={telHref(business.cep)} className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 font-semibold text-[var(--accent-text)]">
            <Phone className="size-4" /> Ara
          </a>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 font-semibold">
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        </div>
        <p className="mt-4 text-sm text-stone-500">
          {business.adres}, {business.ilce} / {business.il}
        </p>
        <Link href="/" className="mt-2 inline-block text-sm font-semibold underline">
          {name} web sitesi
        </Link>
      </footer>
    </div>
  );
}
