import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Globe,
  LayoutTemplate,
  MessageCircle,
  Phone,
  QrCode,
  Search,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { platformName } from "@/lib/config";
import { softwareJsonLd } from "@/lib/marketing-schema";
import { generalFaq } from "@/content/faq";
import { formatPrice, pricing } from "@/content/pricing";
import { sectorPages } from "@/content/sectors";
import { LeadForm } from "./_components/lead-form";
import { ButtonLink, Container, FaqList, JsonLd, Section, SectionHeading } from "./_components/ui";

export const metadata: Metadata = {
  title: { absolute: `${platformName}: Esnafa hazır web sitesi, Google'da ve yapay zekâda bulunur` },
  description:
    "Usta, restoran, kuaför ve klinikler için hazır web sitesi. Sektörünüze özel tasarım, örnek içerik, kendi domain'iniz, arama ve WhatsApp butonları. Google ve ChatGPT gibi asistanlar için hazır altyapı.",
  alternates: { canonical: "/" },
};

const steps = [
  { title: "Bize ulaşın", text: "Sektörünüzü ve işletmenizi kısaca anlatın. Domain'iniz yoksa sizin adınıza alırız." },
  { title: "Siteniz hazır gelir", text: "Sektörünüze göre tasarlanmış site örnek metinlerle dolu açılır. Bilgilerinizi ve fotoğraflarınızı eklersiniz." },
  { title: "Yayına girer", text: "Siteniz kendi domain'inizde, güvenlik sertifikasıyla yayınlanır. Değişiklikleri panelden siz yaparsınız." },
];

const features = [
  { Icon: Smartphone, title: "Telefona göre tasarlandı", text: "Müşterileriniz sizi çoğunlukla telefondan arar. Siteler önce mobil için tasarlanır." },
  { Icon: Phone, title: "Arama ve WhatsApp butonları", text: "Tek dokunuşla arama ve hazır mesajla WhatsApp. Kaç kişinin tıkladığını panelde görürsünüz." },
  { Icon: Globe, title: "Kendi domain'iniz", text: "firmaniz.com adresinde, https güvenlik sertifikasıyla. Domain sizin adınıza kayıtlı olur." },
  { Icon: LayoutTemplate, title: "Hazır içerik, kolay panel", text: "Boş sayfa yok. Metinleri ve fotoğrafları form doldurur gibi değiştirip önizleyerek yayınlarsınız." },
  { Icon: BarChart3, title: "Ziyaretçi istatistiği", text: "Sitenize kaç kişi girdi, kaçı aradı, kaçı WhatsApp'tan yazdı. Çerez kullanılmadan sayılır." },
  { Icon: QrCode, title: "Restoranlara QR menü", text: "Masalara konacak QR kod ve yazdırılabilir masa kartları. Menü değişince kod aynı kalır." },
];

export default function HomePage() {
  const priceText = pricing.yearlyPrice !== null ? `Yıllık ${formatPrice(pricing.yearlyPrice)} TL` : "Yıllık tek ödeme";

  return (
    <>
      <JsonLd data={softwareJsonLd()} />

      {/* Giriş */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
              Usta, restoran, kuaför ve klinikler için
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              İşletmenizin web sitesi hazır.{" "}
              <span className="text-emerald-700">Google&apos;da ve yapay zekâda bulunur.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Sektörünüze özel tasarlanmış site, örnek içeriklerle dolu gelir. Siz bilgilerinizi ekleyin, siteniz kendi
              domain&apos;inizde yayına girsin. Müşteriniz tek dokunuşla arasın, WhatsApp&apos;tan yazsın.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/iletisim">
                Siteni açalım <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/ornekler" variant="secondary">
                Örnek sitelere bak
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {["Teknik bilgi gerekmez", "Domain sizin adınıza", priceText].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-4 text-emerald-700" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <HeroMockup />
        </Container>
      </div>

      {/* Nasıl çalışır */}
      <Section>
        <SectionHeading eyebrow="Nasıl çalışır" title="Üç adımda yayında">
          Siteyi biz kurarız; size sadece işletmenizi anlatmak kalır.
        </SectionHeading>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-stone-200 p-6">
              <span className="grid size-10 place-items-center rounded-full bg-emerald-700 font-semibold text-white">{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Sektörler */}
      <Section tone="muted">
        <SectionHeading eyebrow="Sektörler" title="İşinize göre hazırlanmış siteler">
          Her sektörün müşterisi farklı şeye bakar. Şablonlar buna göre tasarlandı; örnek içerik de mesleğinize göre gelir.
        </SectionHeading>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {sectorPages.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="text-xl font-semibold">{page.name}</h3>
              <p className="mt-2 text-slate-600">{page.kinds.join(", ")}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-semibold text-emerald-700">
                İncele <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Özellikler */}
      <Section>
        <SectionHeading eyebrow="Neler var" title="Küçük işletmenin ihtiyacı olan her şey" />
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, text }) => (
            <div key={title}>
              <Icon className="size-7 text-emerald-700" aria-hidden />
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Google ve yapay zekâ */}
      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-300">Bulunabilirlik</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Müşteri artık sadece Google&apos;a değil, yapay zekâya da soruyor
            </h2>
            <p className="mt-4 text-lg text-emerald-100">
              &quot;Kadıköy&apos;de iyi bir tesisatçı&quot;, &quot;yakınımda açık kafe&quot;. Bu soruları ChatGPT,
              Gemini ve Perplexity gibi asistanlara da soruyorlar. Siteniz hem arama motorlarının hem de bu asistanların
              okuyabileceği şekilde hazırlanır.
            </p>
            <p className="mt-4 text-sm text-emerald-200">
              Hiçbir firma Google&apos;da belirli bir sırayı garanti edemez; biz sitenizin teknik olarak hazır olmasını
              sağlarız. Yeni sitelerin aramalarda yer edinmesi genellikle birkaç ay sürer.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              { Icon: Search, title: "Arama motoru uyumlu", text: "Hızlı açılan sayfalar, otomatik site haritası, işletmeye uygun başlık ve açıklama." },
              { Icon: Bot, title: "Yapay zekâ botlarına açık", text: "ChatGPT, Perplexity, Claude ve Gemini botları sitenizi okuyabilir; içerik sunucuda hazır üretilir." },
              { Icon: ShieldCheck, title: "İşletme bilgisi yapısal", text: "Adres, telefon, çalışma saatleri ve hizmetler schema.org formatında eklenir." },
              { Icon: MessageCircle, title: "Gerçek bilgi, uydurma yok", text: "Örnek içerikte asla sahte yorum, puan veya fiyat bulunmaz." },
            ].map(({ Icon, title, text }) => (
              <li key={title} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <Icon className="size-6 text-amber-300" aria-hidden />
                <p className="mt-3 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-emerald-100">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Fiyat */}
      <Section tone="muted">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading eyebrow="Fiyat" title="Yıllık abonelik, sürpriz yok">
            Kurulum, barındırma, güvenlik sertifikası ve panel tek pakette.
            {pricing.yearlyPrice === null && " Güncel fiyat için bize ulaşın."}
          </SectionHeading>
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            {pricing.yearlyPrice !== null && (
              <p className="text-3xl font-semibold">
                {formatPrice(pricing.yearlyPrice)} TL <span className="text-base font-normal text-slate-500">/ yıl</span>
              </p>
            )}
            <ul className="mt-4 grid gap-2 text-slate-700">
              {pricing.includes.slice(0, 5).map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden /> {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/fiyatlar" variant="secondary" className="mt-6">
              Fiyat ayrıntıları
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* SSS */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Sık sorulanlar" title="Aklınızdaki sorular">
            <Link href="/sss" className="font-semibold text-emerald-700 underline">
              Tüm sorular
            </Link>
          </SectionHeading>
          <FaqList items={generalFaq.slice(1, 6)} />
        </div>
      </Section>

      {/* Başvuru */}
      <Section id="basvuru" tone="muted">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Başvuru" title="Sitenizi birlikte açalım">
            Formu doldurun, sizi arayıp işletmenizi dinleyelim. Bağlayıcı bir şey yok.
          </SectionHeading>
          <LeadForm source="/" />
        </div>
      </Section>
    </>
  );
}

// Giriş bölümündeki telefon çizimi: usta şablonunun sade bir temsili (gerçek ekran görüntüsü değil)
function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden>
      <div className="rounded-[2.5rem] border-[10px] border-slate-900 bg-white shadow-2xl">
        <div className="overflow-hidden rounded-[1.8rem]">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-xs text-white">
            <span className="font-semibold">Örnek Tesisat</span>
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold">Açık</span>
          </div>
          <div className="bg-gradient-to-br from-sky-900 to-slate-900 px-5 py-8 text-white">
            <p className="text-xs text-sky-200">Kadıköy&apos;de</p>
            <p className="mt-1 text-2xl font-semibold leading-tight">Su tesisatı ve tıkanıklık açma</p>
            <p className="mt-2 text-xs text-slate-300">Kaçak tespiti, petek temizliği, armatür değişimi.</p>
          </div>
          <div className="grid gap-2 p-4">
            {["Su kaçağı tespiti", "Tıkanıklık açma", "Petek temizliği"].map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
                <span className="size-2 rounded-full bg-sky-600" /> {s}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-200 p-3">
            <span className="flex items-center justify-center gap-1.5 rounded-xl bg-sky-700 py-2.5 text-sm font-semibold text-white">
              <Phone className="size-4" /> Ara
            </span>
            <span className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white">
              <MessageCircle className="size-4" /> WhatsApp
            </span>
          </div>
        </div>
      </div>
      <div className="absolute -left-6 top-1/3 hidden rounded-2xl bg-white p-3 shadow-xl ring-1 ring-stone-200 sm:block">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Search className="size-3.5" /> kadıköy tesisatçı
        </p>
        <p className="mt-1 text-sm font-semibold text-emerald-800">Örnek Tesisat · Kadıköy</p>
      </div>
      <div className="absolute -right-4 bottom-16 hidden rounded-2xl bg-white p-3 shadow-xl ring-1 ring-stone-200 sm:block">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <BarChart3 className="size-3.5" /> Bu ay
        </p>
        <p className="mt-1 text-sm font-semibold">Arama ve WhatsApp tıklamaları</p>
      </div>
    </div>
  );
}
