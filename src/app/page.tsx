import Link from "next/link";
import { panelUrl, platformName } from "@/lib/config";
import { legalPages, type LegalPage } from "@/lib/legal-links";

// Firma tanıtım sitesi 7. fazda yapılacak, şimdilik yer tutucu
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">{platformName}</h1>
      <p className="max-w-md text-lg text-slate-600">
        Küçük işletmeler için dakikalar içinde yayına giren web siteleri.
      </p>
      <a
        href={panelUrl}
        className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700"
      >
        Panele giriş
      </a>
      <nav className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
        {(Object.keys(legalPages) as LegalPage[]).map((page) => (
          <Link key={page} href={`/${page}`} className="hover:text-slate-900">
            {legalPages[page]}
          </Link>
        ))}
      </nav>
    </main>
  );
}
