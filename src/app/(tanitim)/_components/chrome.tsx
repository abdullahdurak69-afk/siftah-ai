import Link from "next/link";
import { Menu } from "lucide-react";
import { panelUrl, platformName, supportContact } from "@/lib/config";
import { legalPages, type LegalPage } from "@/lib/legal-links";
import { telHref, whatsappHref } from "@/lib/turkish";
import { sectorPages } from "@/content/sectors";
import { ButtonLink, Container, Logo } from "./ui";

const mainNav = [
  { href: "/ornekler", label: "Örnekler" },
  { href: "/fiyatlar", label: "Fiyatlar" },
  { href: "/sss", label: "SSS" },
  { href: "/rehber", label: "Rehber" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={`${platformName} ana sayfa`} className="text-lg">
          <Logo />
        </Link>

        <nav aria-label="Ana menü" className="hidden items-center gap-1 text-sm font-medium text-slate-700 lg:flex">
          <details className="group relative [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer list-none rounded-lg px-3 py-2 hover:bg-stone-100">Sektörler</summary>
            <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-stone-200 bg-white p-2 shadow-lg">
              {sectorPages.map((page) => (
                <Link key={page.slug} href={`/${page.slug}`} className="block rounded-lg px-3 py-2 hover:bg-stone-100">
                  {page.name}
                </Link>
              ))}
            </div>
          </details>
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 hover:bg-stone-100">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={panelUrl} className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-stone-100 sm:block">
            Giriş
          </a>
          <ButtonLink href="/iletisim" className="px-4 py-2 text-sm">
            Siteni açalım
          </ButtonLink>
          <details className="relative lg:hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg hover:bg-stone-100" aria-label="Menü">
              <Menu className="size-5" />
            </summary>
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-stone-200 bg-white p-2 text-sm font-medium shadow-lg">
              {sectorPages.map((page) => (
                <Link key={page.slug} href={`/${page.slug}`} className="block rounded-lg px-3 py-2 hover:bg-stone-100">
                  {page.name}
                </Link>
              ))}
              <hr className="my-2 border-stone-200" />
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 hover:bg-stone-100">
                  {item.label}
                </Link>
              ))}
              <a href={panelUrl} className="block rounded-lg px-3 py-2 hover:bg-stone-100">
                Panele giriş
              </a>
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}

export function SiteFooter() {
  const { phone, email } = supportContact;
  return (
    <footer className="border-t border-stone-200 bg-stone-50 text-sm">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Logo className="text-lg" />
          <p className="text-slate-600">
            Usta, restoran, kuaför ve klinikler için hazır web sitesi. Google&apos;da ve yapay zekâ asistanlarında
            bulunabilir.
          </p>
          {(phone || email) && (
            <ul className="flex flex-col gap-1 text-slate-700">
              {phone && (
                <li>
                  <a href={telHref(phone)} className="hover:underline">{phone}</a>
                  {" · "}
                  <a href={whatsappHref(phone)} className="hover:underline">WhatsApp</a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                </li>
              )}
            </ul>
          )}
        </div>
        <FooterColumn title="Sektörler" links={sectorPages.map((p) => ({ href: `/${p.slug}`, label: p.name }))} />
        <FooterColumn
          title="Kaynaklar"
          links={[
            { href: "/ornekler", label: "Örnek siteler" },
            { href: "/fiyatlar", label: "Fiyatlar" },
            { href: "/sss", label: "Sık sorulan sorular" },
            { href: "/rehber", label: "Rehber" },
            { href: "/iletisim", label: "İletişim ve başvuru" },
          ]}
        />
        <FooterColumn
          title="Yasal"
          links={(Object.keys(legalPages) as LegalPage[]).map((page) => ({ href: `/${page}`, label: legalPages[page] }))}
        />
      </Container>
      <Container className="border-t border-stone-200 py-6 text-slate-500">
        © {platformName}. Siteleri biz kurarız, siz sadece işinize bakarsınız.
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="font-semibold text-slate-900">{title}</p>
      <ul className="mt-3 flex flex-col gap-2 text-slate-600">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-slate-900">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
