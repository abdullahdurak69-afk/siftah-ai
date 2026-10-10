import "server-only";
import type { Sector } from "@/lib/config";
import type { RenderableSite } from "@/lib/sites";
import { getCatalog } from "@/templates/catalog";
import { defaultThemes } from "@/templates/themes";

// Tanıtım sitesindeki örnek siteler (/ornekler/<sektör>): şablonların kurulum sihirbazından çıkan hâli.
// İşletmeler açıkça "Örnek" adlıdır, telefon numarası kullanılmayan bir numaradır; sayfalar Google'a kapalıdır ve
// schema.org verisi basılmaz (gerçek işletme sanılmasın).

type Demo = { name: string; profession: string; choices?: number[]; bolgeler?: string[] };

const demoPhone = "0 (500) 000 00 00";

const demos: Record<Sector, Demo> = {
  usta: { name: "Örnek Tesisat", profession: "su-tesisat", bolgeler: ["Kadıköy", "Üsküdar", "Ataşehir", "Maltepe"] },
  restoran: { name: "Örnek Lokanta", profession: "lokanta" },
  kuafor: { name: "Örnek Kuaför", profession: "kadin" },
  klinik: { name: "Örnek Diş Kliniği", profession: "dis" },
};

export const demoSectors = Object.keys(demos) as Sector[];

export function getDemoSite(sector: Sector): RenderableSite | null {
  const demo = demos[sector];
  const catalog = getCatalog(sector);
  if (!demo || !catalog) return null;

  const preset = catalog.presets.find((p) => p.key === demo.profession);
  const choices = demo.choices ?? preset?.choices.map((_, i) => i) ?? [0];

  const sections = catalog.build(demo.name, {
    profession: demo.profession,
    cep: demoPhone,
    whatsapp: demoPhone,
    sabit: "",
    adres: "Örnek Mah. Örnek Sok. No: 1",
    ilce: "Kadıköy",
    il: "İstanbul",
    choices,
    bolgeler: demo.bolgeler ?? [],
  });

  return {
    site: { id: `ornek-${sector}`, name: demo.name, sector, theme: defaultThemes[sector], profession: demo.profession },
    sections,
    publishedAt: null,
  };
}
