import { requestNow } from "@/lib/request-time";
import { formatNumber, getDailyStats } from "@/lib/stats";
import { formatDate } from "@/lib/subscription";

const days = 30;

// Son 30 günün ziyaretçi ve tıklama sayıları (çerezsiz sayaç, src/lib/stats.ts)
export async function StatsCard({ siteId }: { siteId: string }) {
  const daily = await getDailyStats(siteId, days, await requestNow());
  const totals = daily.reduce(
    (t, d) => ({ visitors: t.visitors + d.visitors, phone: t.phone + d.phoneClicks, wa: t.wa + d.whatsappClicks }),
    { visitors: 0, phone: 0, wa: 0 },
  );
  const max = Math.max(1, ...daily.map((d) => d.visitors));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold">Son 30 gün</h2>
      <dl className="mt-3 grid grid-cols-3 gap-3">
        <Stat label="Ziyaretçi" value={totals.visitors} />
        <Stat label="Telefon araması" value={totals.phone} />
        <Stat label="WhatsApp mesajı" value={totals.wa} />
      </dl>

      {totals.visitors > 0 ? (
        <figure className="mt-5">
          <figcaption className="mb-2 text-sm text-slate-500">Günlük ziyaretçi</figcaption>
          <div className="flex h-28 items-end gap-0.5 border-b border-slate-200" role="img" aria-label={`Son ${days} günde günlük ziyaretçi sayısı, en yüksek ${max}`}>
            {daily.map((d) => (
              <div key={d.day} className="group relative flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t-[3px] bg-slate-700 group-hover:bg-slate-900"
                  style={{ height: d.visitors > 0 ? `${Math.max(4, (d.visitors / max) * 100)}%` : 0 }}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
                  {formatDate(d.day)}: {d.visitors} ziyaretçi
                  {d.phoneClicks + d.whatsappClicks > 0 && `, ${d.phoneClicks + d.whatsappClicks} tıklama`}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>{formatDate(daily[0].day)}</span>
            <span>Bugün</span>
          </div>
        </figure>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Siteniz yayına girdikten sonra ziyaretler burada görünür.</p>
      )}
      <p className="mt-3 text-xs text-slate-400">
        Ziyaretçiler çerez kullanılmadan, günlük olarak sayılır. Tıklamalar sitedeki Ara ve WhatsApp butonlarından gelir.
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">{formatNumber(value)}</dd>
    </div>
  );
}
