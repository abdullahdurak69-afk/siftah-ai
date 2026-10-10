import type { CSSProperties, ReactNode } from "react";
import { ChevronDown, Clock, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { telHref, whatsappHref } from "@/lib/turkish";
import type { ImageValue } from "../engine/fields";
import type { SectionRow } from "../engine/types";
import { getTheme } from "../themes";

// Tüm şablonların ortak blokları. Renk ve yazı tipi CSS değişkenleriyle şablona göre değişir:
//   --accent, --accent-hover, --accent-text  tema rengi (siteStyle)
//   --alt-bg       dönüşümlü bölüm arka planı (varsayılan slate-50)
//   --dark-bg      koyu bölümler (iletişim, alt bilgi)
//   --font-heading başlık yazı tipi (globals.css .font-heading)

export const whatsappGreen = "#25D366";

// --- İçerik okuma ---

export function getContent(sections: SectionRow[]) {
  const get = (key: string) => sections.find((s) => s.key === key);
  const content = <T,>(key: string) => (get(key)?.content ?? {}) as T;
  const enabled = (key: string) => get(key)?.enabled ?? false;
  const ordered = [...sections].sort((a, b) => a.position - b.position).filter((s) => s.enabled);
  return { content, enabled, ordered };
}

// Tüm şablonların "İşletme bilgileri" bölümündeki ortak alanlar
export type BaseBusiness = {
  logo?: ImageValue | null;
  cep: string;
  whatsapp: string;
  sabit: string;
  adres: string;
  ilce: string;
  il: string;
  haritaLinki: string;
  googlePuan: number | null;
  yorumSayisi: number | null;
  instagram?: string;
};

export type Hours = { gun: string; saat: string }[];

export function whatsappLinkFor(business: BaseBusiness, text: string) {
  return whatsappHref(business.whatsapp || business.cep, text);
}

export function siteStyle(theme: string, extra?: Record<string, string>) {
  const colors = getTheme(theme);
  return {
    "--accent": colors.accent,
    "--accent-hover": colors.accentHover,
    "--accent-text": colors.accentText,
    ...extra,
  } as CSSProperties;
}

// --- Yerleşim ---

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>;
}

export function SectionHeading({ title, description, eyebrow }: { title: string; description?: string; eyebrow?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{eyebrow}</p>}
      <h2 className="font-heading text-3xl font-bold tracking-tight">{title}</h2>
      {description && <p className="mt-3 text-lg text-slate-600">{description}</p>}
    </div>
  );
}

export function Logo({ name, logo, className = "" }: { name: string; logo: ImageValue | null; className?: string }) {
  if (logo) {
    return (
      <a href="#" className={`flex h-11 shrink-0 items-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.srcSmall} alt={name} width={logo.width} height={logo.height} className="h-full w-auto max-w-48 object-contain" />
      </a>
    );
  }
  return (
    <a href="#" className={`truncate font-heading text-xl font-bold tracking-tight ${className}`}>
      {name}
    </a>
  );
}

// Arka plan fotoğrafı (hero gibi geniş alanlar için)
export function CoverImage({ image, className = "", priority = false }: { image: ImageValue; className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      srcSet={`${image.srcSmall} 640w, ${image.src} 1600w`}
      sizes="100vw"
      alt=""
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? undefined : "lazy"}
      className={`object-cover ${className}`}
    />
  );
}

// --- Bloklar ---

export function FaqBlock({ data }: { data: { baslik: string; aciklama: string; sorular: { soru: string; cevap: string }[] } }) {
  if (data.sorular.length === 0) return null;
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

export function GalleryBlock({
  data,
  name,
  id = "galeri",
  alt = false,
}: {
  data: { baslik: string; aciklama: string; fotograflar: ImageValue[] };
  name: string;
  id?: string;
  alt?: boolean;
}) {
  if (data.fotograflar.length === 0) return null;
  return (
    <section id={id} className={`scroll-mt-16 py-16 md:py-20 ${alt ? "bg-[var(--alt-bg,#f8fafc)]" : "bg-white"}`}>
      <Container>
        <SectionHeading title={data.baslik} description={data.aciklama} />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {data.fotograflar.map((image, i) => (
            <li key={image.id}>
              <a href={image.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.srcSmall}
                  alt={`${name} — ${data.baslik} ${i + 1}`}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export type ReviewsData = { baslik: string; yorumlar: { ad: string; yorum: string; puan: number | null }[]; tumYorumlarLinki: string };

export function ReviewsBlock({ data, business, alt = false }: { data: ReviewsData; business: BaseBusiness; alt?: boolean }) {
  if (data.yorumlar.length === 0) return null;
  return (
    <section className={`py-16 md:py-20 ${alt ? "bg-[var(--alt-bg,#f8fafc)]" : "bg-white"}`}>
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
            <figure key={review.ad + review.yorum.slice(0, 20)} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
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

// İletişim: adres, telefonlar, WhatsApp, çalışma saatleri ve harita.
// hours: usta şablonunda tek satır metin, diğer şablonlarda gün/saat listesi.
export function ContactBlock({
  data,
  business,
  whatsappLink,
  hours,
  tone = "dark",
  children,
}: {
  data: { baslik: string; aciklama: string };
  business: BaseBusiness;
  whatsappLink: string;
  hours?: string | Hours;
  tone?: "dark" | "light";
  children?: ReactNode;
}) {
  const mapQuery = encodeURIComponent(`${business.adres}, ${business.ilce}, ${business.il}`);
  const rows = [
    { label: "Adres", value: `${business.adres}, ${business.ilce} / ${business.il}`, href: business.haritaLinki || undefined, Icon: MapPin },
    business.sabit && { label: "Sabit", value: business.sabit, href: telHref(business.sabit), Icon: Phone },
    { label: "Cep", value: business.cep, href: telHref(business.cep), Icon: Phone },
    { label: "WhatsApp", value: business.whatsapp || business.cep, href: whatsappLink, Icon: MessageCircle },
    typeof hours === "string" && hours && { label: "Çalışma saatleri", value: hours, Icon: Clock },
  ].filter(Boolean) as { label: string; value: string; href?: string; Icon: typeof Phone }[];
  const hourList = Array.isArray(hours) ? hours.filter((h) => h.gun || h.saat) : [];
  const dark = tone === "dark";

  return (
    <section
      id="iletisim"
      className={`scroll-mt-16 py-16 md:py-20 ${dark ? "bg-[var(--dark-bg,#0f172a)] text-white" : "bg-[var(--alt-bg,#f8fafc)] text-slate-900"}`}
    >
      <Container className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">{data.baslik}</h2>
          {data.aciklama && <p className={`mt-3 text-lg ${dark ? "text-white/70" : "text-slate-600"}`}>{data.aciklama}</p>}
          <dl className="mt-8 flex flex-col gap-5">
            {rows.map(({ label, value, href, Icon }) => (
              <div key={label} className="flex gap-4">
                <Icon className={`mt-1 size-5 shrink-0 ${dark ? "text-[var(--accent)]" : "text-[var(--accent-hover)]"}`} />
                <div>
                  <dt className={`text-sm ${dark ? "text-white/60" : "text-slate-500"}`}>{label}</dt>
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
            {hourList.length > 0 && (
              <div className="flex gap-4">
                <Clock className={`mt-1 size-5 shrink-0 ${dark ? "text-[var(--accent)]" : "text-[var(--accent-hover)]"}`} />
                <div className="flex-1">
                  <dt className={`text-sm ${dark ? "text-white/60" : "text-slate-500"}`}>Çalışma saatleri</dt>
                  <dd>
                    <table className="mt-1 w-full max-w-sm">
                      <tbody>
                        {hourList.map((h) => (
                          <tr key={h.gun + h.saat}>
                            <td className="py-0.5 pr-4">{h.gun}</td>
                            <td className="py-0.5 text-right font-semibold tabular-nums">{h.saat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </dd>
                </div>
              </div>
            )}
          </dl>
          {children}
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

// Telefonda ekranın altında sabit duran iki buton
export function MobileBar({ cep, whatsappLink, callLabel = "Hemen Ara", whatsappLabel = "WhatsApp" }: {
  cep: string;
  whatsappLink: string;
  callLabel?: string;
  whatsappLabel?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-slate-200 bg-white md:hidden">
      <a href={telHref(cep)} className="flex items-center justify-center gap-2 bg-[var(--accent)] py-4 font-bold text-[var(--accent-text)]">
        <Phone className="size-5" /> {callLabel}
      </a>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 py-4 font-bold text-white"
        style={{ background: whatsappGreen }}
      >
        <MessageCircle className="size-5" /> {whatsappLabel}
      </a>
    </div>
  );
}

// Masaüstünde sağ altta sabit WhatsApp butonu
export function WhatsAppFloat({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp'tan yazın"
      className="fixed bottom-6 right-6 z-30 hidden size-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 md:flex"
      style={{ background: whatsappGreen }}
    >
      <MessageCircle className="size-7" />
    </a>
  );
}

export function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="flex" aria-label={`5 üzerinden ${value.toLocaleString("tr-TR")} puan`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`size-4 ${n <= full ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} aria-hidden />
      ))}
    </span>
  );
}

// "Google'da 4,8 / 5 — 120 yorum" rozeti
export function RatingBadge({ business, className = "" }: { business: BaseBusiness; className?: string }) {
  if (!business.googlePuan) return null;
  return (
    <a
      href={business.haritaLinki || undefined}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${className}`}
    >
      <Stars value={business.googlePuan} />
      <span>
        Google&apos;da {business.googlePuan.toLocaleString("tr-TR")} / 5
        {business.yorumSayisi ? ` — ${business.yorumSayisi} yorum` : ""}
      </span>
    </a>
  );
}

// Fiyat: 185 -> "185 ₺", 72.5 -> "72,50 ₺"
export function formatPrice(value: number) {
  return `${value.toLocaleString("tr-TR", { minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 })} ₺`;
}
