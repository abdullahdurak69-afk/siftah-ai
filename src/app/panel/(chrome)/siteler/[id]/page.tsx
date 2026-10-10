import Link from "next/link";
import { canManage, getEditableSite } from "@/lib/dal";
import { sectors, siteUrl } from "@/lib/config";
import { getTemplate } from "@/templates/registry";
import { presetLabel } from "@/templates/catalog";
import { healthAdNotice } from "@/templates/klinik/sections";
import { StatsCard } from "./stats-card";
import { SubscriptionCard } from "./subscription-card";
import { ThemePicker } from "./theme-picker";

export const instant = false;

export default async function SiteOverviewPage({ params }: PageProps<"/panel/siteler/[id]">) {
  const { id } = await params;
  const { site, role } = await getEditableSite(id);
  const template = getTemplate(site.sector);

  if (!template) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">{sectors[site.sector]} şablonu yakında</h2>
        <p className="mt-1 text-slate-600">
          Bu sektörün şablonu henüz hazır değil.
        </p>
      </Card>
    );
  }

  if (!site.setupCompletedAt) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Sitenizi birkaç adımda kuralım</h2>
        <p className="mt-1 text-slate-600">
          İşletmenizin türünü ve iletişim bilgilerinizi girin; bölümler örnek metinlerle hazır gelsin. Sonra
          dilediğiniz gibi düzenlersiniz.
        </p>
        <Link
          href={`/siteler/${site.id}/kurulum`}
          className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-700"
        >
          Kuruluma başla
        </Link>
      </Card>
    );
  }

  const url = siteUrl(site.subdomain);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="text-lg font-semibold">{site.publishedVersionId ? "Siteniz yayında" : "Siteniz hazır"}</h2>
        <p className="mt-1 text-slate-600">
          İçerikler <strong>{presetLabel(site.sector, site.profession) ?? "işletmenize"}</strong> için örnek metinlerle
          dolduruldu. Soldaki bölümlerden kendi işinize göre düzenleyin, fotoğraflarınızı ekleyin. Değişiklikleriniz
          &quot;Önizle&quot; ile kontrol edip &quot;Yayınla&quot;ya bastığınızda sitede görünür.
        </p>
        {site.publishedVersionId && (
          <a href={url} target="_blank" rel="noreferrer" className="mt-3 inline-block font-medium underline">
            {url.replace(/^https?:\/\//, "")}
          </a>
        )}
      </Card>

      {site.sector === "klinik" && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <h2 className="font-semibold">Sağlık hizmetlerinde reklam kuralları</h2>
          <p className="mt-1 text-sm">
            {healthAdNotice} Şablon bu yüzden yorum ve fiyat bölümü içermez; metinlerinizi bilgilendirici tutun. Emin
            olmadığınız konularda bağlı olduğunuz meslek odasının kurallarına bakın.
          </p>
        </section>
      )}

      {site.publishedVersionId && <StatsCard siteId={site.id} />}

      {canManage(role) && <SubscriptionCard siteId={site.id} endsAt={site.subscriptionEndsAt} role={role} />}

      <Card>
        <h2 className="font-semibold">Site rengi</h2>
        <p className="mt-1 text-sm text-slate-600">Butonlarda ve vurgularda kullanılan ana renk.</p>
        <div className="mt-3">
          <ThemePicker siteId={site.id} current={site.theme} />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">Kurulumu yeniden yap</h2>
        <p className="mt-1 text-sm text-slate-600">
          İşletme türünü veya temel bilgileri baştan seçmek isterseniz kurulumu tekrar çalıştırabilirsiniz. Mevcut içerikler
          örnek metinlerle değiştirilir.
        </p>
        <Link href={`/siteler/${site.id}/kurulum`} className="mt-3 inline-block text-sm font-medium underline">
          Kurulum sihirbazını aç
        </Link>
      </Card>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5">{children}</section>;
}
