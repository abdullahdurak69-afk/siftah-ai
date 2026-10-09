import { panelUrl, platformName } from "@/lib/config";

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
    </main>
  );
}
