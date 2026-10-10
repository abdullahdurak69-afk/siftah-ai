import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { payments, sites } from "@/db/schema";
import { formatNumber } from "@/lib/stats";
import { formatDate } from "@/lib/subscription";

export const metadata: Metadata = { title: "Yönetim · Ödemeler", robots: { index: false } };

export default async function AdminPaymentsPage() {
  const [list, byYear] = await Promise.all([
    db
      .select({
        id: payments.id,
        amount: payments.amount,
        paidOn: payments.paidOn,
        note: payments.note,
        siteId: sites.id,
        siteName: sites.name,
      })
      .from(payments)
      .innerJoin(sites, eq(sites.id, payments.siteId))
      .orderBy(desc(payments.paidOn), desc(payments.createdAt))
      .limit(200),
    db
      .select({
        year: sql<string>`extract(year from ${payments.paidOn})::text`,
        total: sql<number>`sum(${payments.amount})::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(payments)
      .groupBy(sql`1`)
      .orderBy(sql`1 desc`),
  ]);

  return (
    <div className="flex flex-col gap-4">
      {byYear.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {byYear.map((y) => (
            <div key={y.year} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">{y.year}</p>
              <p className="text-xl font-semibold tabular-nums">{formatNumber(y.total)} TL</p>
              <p className="text-sm text-slate-500">{y.count} ödeme</p>
            </div>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          Henüz ödeme kaydı yok. Ödemeler sitenin yönetim sayfasından kaydedilir.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {list.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <div className="min-w-0">
                <Link href={`/admin/siteler/${p.siteId}`} className="font-medium hover:underline">
                  {p.siteName}
                </Link>
                {p.note && <p className="truncate text-slate-500">{p.note}</p>}
              </div>
              <div className="text-right">
                <p className="font-medium tabular-nums">{formatNumber(p.amount)} TL</p>
                <p className="text-slate-500">{formatDate(p.paidOn)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
