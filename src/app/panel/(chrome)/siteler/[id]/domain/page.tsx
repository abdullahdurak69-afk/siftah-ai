import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { domains } from "@/db/schema";
import { getEditableSite } from "@/lib/dal";
import { protocol, siteUrl } from "@/lib/config";
import { dnsInstructions, isApexDomain } from "@/lib/domains";
import { AddDomainForm, DomainActions } from "./domain-forms";

export const metadata: Metadata = { title: "Domain", robots: { index: false } };
export const instant = false;

export default async function DomainPage({ params }: PageProps<"/panel/siteler/[id]/domain">) {
  const { id } = await params;
  const { site, publishedAt } = await getEditableSite(id);
  const [domain] = await db.select().from(domains).where(eq(domains.siteId, site.id));
  const subdomainUrl = siteUrl(site.subdomain);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Domain</h2>
        <p className="mt-1 text-slate-600">Sitenizi kendi domain&apos;inizde (ör. firmaniz.com) yayınlayın.</p>
      </div>

      <Card>
        <p className="text-sm text-slate-500">Ücretsiz adresiniz</p>
        <p className="font-medium">{subdomainUrl.replace(/^https?:\/\//, "")}</p>
        <p className="mt-1 text-sm text-slate-500">
          {domain?.status === "verified"
            ? "Bu adrese gelen ziyaretçiler otomatik olarak kendi domain'inize yönlendirilir."
            : "Kendi domain'inizi bağlasanız da bu adres çalışmaya devam eder."}
        </p>
      </Card>

      {!domain ? (
        <Card>
          <h3 className="font-semibold">Kendi domain&apos;inizi bağlayın</h3>
          <p className="mt-1 text-sm text-slate-600">
            Domain&apos;inizi henüz almadıysanız Natro, İsimtescil, Turhost veya GoDaddy gibi bir firmadan alabilirsiniz.
          </p>
          <div className="mt-4">
            <AddDomainForm siteId={site.id} />
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{domain.hostname}</p>
                {domain.status === "verified" ? (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-700">
                    <span className="size-2 rounded-full bg-emerald-500" /> Bağlandı
                  </p>
                ) : (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-amber-700">
                    <span className="size-2 rounded-full bg-amber-500" /> DNS ayarı bekleniyor
                  </p>
                )}
              </div>
              <DomainActions siteId={site.id} verified={domain.status === "verified"} />
            </div>

            {domain.status === "verified" ? (
              <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                {publishedAt ? (
                  <>
                    Siteniz{" "}
                    <a href={`${protocol}://${domain.hostname}`} target="_blank" rel="noreferrer" className="font-medium underline">
                      {domain.hostname}
                    </a>{" "}
                    adresinde yayında. Güvenlik sertifikası (https) ilk ziyarette birkaç saniye içinde otomatik alınır.
                  </>
                ) : (
                  <>Domain hazır. Sitenizi yayınladığınızda bu adreste görünecek.</>
                )}
              </div>
            ) : (
              domain.lastError && (
                <ul className="mt-4 flex flex-col gap-1 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  {domain.lastError.split("\n").map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )
            )}
          </Card>

          {domain.status !== "verified" && <DnsSteps hostname={domain.hostname} />}
        </>
      )}
    </div>
  );
}

function DnsSteps({ hostname }: { hostname: string }) {
  const records = dnsInstructions(hostname);
  const apex = isApexDomain(hostname);

  return (
    <Card>
      <h3 className="font-semibold">Domain firmanızın panelinde yapmanız gerekenler</h3>
      <p className="mt-1 text-sm text-slate-600">
        Domain&apos;i aldığınız firmanın müşteri paneline girin ve domain&apos;inizin <strong>DNS yönetimi</strong> (bazı
        firmalarda &quot;DNS kayıtları&quot; veya &quot;Gelişmiş DNS&quot;) ekranını açın. Aşağıdaki{" "}
        {records.length === 1 ? "kaydı" : "kayıtları"} ekleyin:
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-2 pr-4 font-medium">Tür</th>
              <th className="py-2 pr-4 font-medium">Ad / Host</th>
              <th className="py-2 pr-4 font-medium">Değer / Hedef</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.type + record.name}>
                <td className="py-2.5 pr-4 font-mono font-semibold">{record.type}</td>
                <td className="py-2.5 pr-4 font-mono">{record.name}</td>
                <td className="py-2.5 pr-4">
                  <span className="font-mono">{record.value}</span>
                  {record.note && <span className="block text-xs text-slate-500">{record.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
        <strong>E-postanız bozulmasın diye:</strong> &quot;Nameserver&quot; (DNS sunucusu) adreslerini değiştirmeyin ve
        MX kayıtlarına dokunmayın. Sadece yukarıdaki {records.length === 1 ? "kaydı" : "kayıtları"} ekleyin veya düzenleyin.
      </div>

      <ul className="mt-4 flex list-disc flex-col gap-1.5 pl-5 text-sm text-slate-700">
        {apex && <li>&quot;@&quot; için zaten bir A kaydı varsa (eski siteniz) yenisini eklemek yerine onu düzenleyin.</li>}
        {apex && <li>&quot;AAAA&quot; türünde bir kayıt varsa silin; aksi halde bazı ziyaretçiler eski sitenizi görür.</li>}
        <li>
          Cloudflare kullanıyorsanız kaydın &quot;Proxy&quot; ayarını kapatın (gri bulut, &quot;DNS only&quot;).
        </li>
        <li>
          Değişikliklerin yayılması birkaç dakika ile 24 saat arasında sürebilir. Sistem 10 dakikada bir otomatik kontrol
          eder; isterseniz &quot;Kontrol et&quot; ile hemen deneyebilirsiniz.
        </li>
      </ul>

      <details className="mt-4 rounded-lg border border-slate-200">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium">Firmaya göre DNS ekranı nerede?</summary>
        <div className="flex flex-col gap-2 px-3 pb-3 text-sm text-slate-700">
          <p>
            Menü adları firmaya ve panel sürümüne göre değişebilir. Genellikle domain listesinde ilgili domain&apos;i seçip
            yönetim sayfasına girdiğinizde DNS ile ilgili bir sekme bulunur:
          </p>
          <ul className="list-disc pl-5">
            <li><strong>Natro, İsimtescil, Turhost:</strong> Domain yönetim sayfasında &quot;DNS Yönetimi&quot; / &quot;DNS Kayıtları&quot;.</li>
            <li><strong>GoDaddy:</strong> Domain&apos;in yanındaki &quot;DNS&quot; veya &quot;DNS&apos;i Yönet&quot; seçeneği.</li>
          </ul>
          <p>Bulamazsanız firmanın müşteri hizmetlerinden &quot;A kaydı ve CNAME kaydı eklemek istiyorum&quot; diyerek destek alabilirsiniz.</p>
        </div>
      </details>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5">{children}</section>;
}
