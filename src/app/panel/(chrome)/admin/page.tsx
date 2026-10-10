import type { Metadata } from "next";
import Link from "next/link";
import { requestNow } from "@/lib/request-time";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { sectors } from "@/lib/config";
import { daysText, formatDate, getSubscription, stateLabels, type SubscriptionState } from "@/lib/subscription";

export const metadata: Metadata = { title: "Yönetim · Siteler", robots: { index: false } };

const filters: { value: SubscriptionState | "hepsi"; label: string }[] = [
  { value: "hepsi", label: "Tümü" },
  { value: "expiring", label: "Yenileme yaklaşan" },
  { value: "grace", label: "Süresi dolan" },
  { value: "suspended", label: "Askıda" },
  { value: "none", label: "Ödeme kaydı yok" },
];

// Durum sırası: önce ilgilenilmesi gerekenler
const stateOrder: Record<SubscriptionState, number> = { grace: 0, suspended: 1, expiring: 2, none: 3, active: 4 };

export default async function AdminSitesPage({ searchParams }: PageProps<"/panel/admin">) {
  const { durum } = await searchParams;
  const filter = filters.find((f) => f.value === durum)?.value ?? "hepsi";

  const now = (await requestNow()).getTime();

  const rows = await db
    .select({
      id: sites.id,
      name: sites.name,
      subdomain: sites.subdomain,
      sector: sites.sector,
      published: sql<boolean>`${sites.publishedVersionId} is not null`,
      endsAt: sites.subscriptionEndsAt,
      // Alt sorgularda Drizzle sütunları tablo öneki olmadan yazdığı için adlar elle nitelenir
      owners: sql<string | null>`(select string_agg(u.email, ', ') from site_members m join users u on u.id = m.user_id where m.site_id = "sites"."id" and m.role = 'owner')`,
      lastPayment: sql<string | null>`(select max(p.paid_on)::text from payments p where p.site_id = "sites"."id")`,
    })
    .from(sites)
    .orderBy(desc(sites.createdAt));

  const all = rows
    .map((row) => ({ ...row, sub: getSubscription(row.endsAt, now) }))
    .sort((a, b) => stateOrder[a.sub.state] - stateOrder[b.sub.state] || (a.sub.daysLeft ?? 1e9) - (b.sub.daysLeft ?? 1e9));
  const counts = Object.fromEntries(filters.map((f) => [f.value, f.value === "hepsi" ? all.length : all.filter((r) => r.sub.state === f.value).length]));
  const list = filter === "hepsi" ? all : all.filter((r) => r.sub.state === filter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === "hepsi" ? "/admin" : `/admin?durum=${f.value}`}
            className={`rounded-full border px-3 py-1 text-sm ${f.value === filter ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"}`}
          >
            {f.label} <span className="opacity-70">{counts[f.value]}</span>
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">Bu durumda site yok.</p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {list.map((row) => {
            const label = stateLabels[row.sub.state];
            return (
              <li key={row.id}>
                <Link href={`/admin/siteler/${row.id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {row.name} <span className="font-normal text-slate-400">· {row.subdomain}</span>
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {sectors[row.sector]} · {row.owners ?? "Site sahibi yok"}
                      {!row.published && " · Yayınlanmadı"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${label.className}`}>{label.text}</span>
                    {row.sub.endsAt && (
                      <span className="text-slate-500">
                        {formatDate(row.sub.endsAt)} ({daysText(row.sub.daysLeft!)})
                      </span>
                    )}
                    {row.lastPayment && <span className="text-xs text-slate-400">Son ödeme {formatDate(row.lastPayment)}</span>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
