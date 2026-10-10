import Link from "next/link";
import { platformName } from "@/lib/config";
import { legalPages, type LegalPage } from "@/lib/legal-links";

// Ana domain'de yayınlanan yasal metinlerin ortak çerçevesi
export default function LegalLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <Link href="/" className="font-semibold tracking-tight">
            {platformName}
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">{children}</main>
      <footer className="border-t border-slate-200">
        <nav className="mx-auto flex max-w-3xl flex-wrap gap-x-5 gap-y-2 px-4 py-6 text-sm text-slate-600">
          {(Object.keys(legalPages) as LegalPage[]).map((page) => (
            <Link key={page} href={`/${page}`} className="hover:text-slate-900">
              {legalPages[page]}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
