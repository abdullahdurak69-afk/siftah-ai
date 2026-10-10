import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requestNow } from "@/lib/request-time";
import { desc, eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { db } from "@/db";
import { payments, sites, user } from "@/db/schema";
import { sectors } from "@/lib/config";
import { getVerifiedDomain, publicSiteUrl } from "@/lib/sites";
import { listSiteMembers } from "@/lib/invites";
import { formatNumber } from "@/lib/stats";
import { daysText, formatDate, getSubscription, stateLabels, toIsoDate } from "@/lib/subscription";
import { DeletePaymentButton, EndDateForm, PaymentForm } from "./subscription-forms";

export const metadata: Metadata = { title: "Yönetim · Site", robots: { index: false } };

export default async function AdminSitePage({ params }: PageProps<"/panel/admin/siteler/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [site] = await db.select().from(sites).where(eq(sites.id, id));
  if (!site) notFound();

  const now = await requestNow();
  const sub = getSubscription(site.subscriptionEndsAt, now.getTime());
  const label = stateLabels[sub.state];

  const [history, members, domain] = await Promise.all([
    db
      .select({
        id: payments.id,
        amount: payments.amount,
        paidOn: payments.paidOn,
        periodEndsAt: payments.periodEndsAt,
        note: payments.note,
        recordedBy: user.name,
      })
      .from(payments)
      .leftJoin(user, eq(user.id, payments.recordedBy))
      .where(eq(payments.siteId, site.id))
      .orderBy(desc(payments.paidOn), desc(payments.createdAt)),
    listSiteMembers(site.id),
    getVerifiedDomain(site.id),
  ]);
  const url = site.publishedVersionId ? publicSiteUrl(site.subdomain, domain) : null;
  const owners = members.filter((m) => m.role === "owner");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">
            ← Siteler
          </Link>
          <h2 className="truncate text-xl font-semibold tracking-tight">{site.name}</h2>
          <p className="text-sm text-slate-500">{sectors[site.sector]}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <Link href={`/siteler/${site.id}`} className="underline">
            Siteyi düzenle
          </Link>
          <Link href={`/siteler/${site.id}/kullanicilar`} className="underline">
            Kullanıcılar
          </Link>
          {url ? (
            <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
              {url.replace(/^https?:\/\//, "")} <ExternalLink className="size-3.5" />
            </a>
          ) : (
            <Link href={`/siteler/${site.id}/domain`} className="text-amber-700 underline">
              Domain bağlanmadı
            </Link>
          )}
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-semibold">Abonelik</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${label.className}`}>{label.text}</span>
        </div>
        {sub.endsAt ? (
          <p className="mt-2 text-slate-700">
            Bitiş: <strong>{formatDate(sub.endsAt)}</strong> ({daysText(sub.daysLeft!)})
            {sub.state !== "suspended" && sub.state !== "active" && <> · Askıya alınma: {formatDate(sub.suspendsAt!)}</>}
          </p>
        ) : (
          <p className="mt-2 text-slate-600">Henüz ödeme kaydı yok; site süre sınırı olmadan çalışıyor.</p>
        )}
        <p className="mt-1 text-sm text-slate-500">
          Site sahibi:{" "}
          {owners.length > 0 ? (
            owners.map((o) => `${o.name} (${o.email})${o.pending ? " · davet bekliyor" : ""}`).join(", ")
          ) : (
            <>
              yok, hatırlatma e-postaları sadece size gelir.{" "}
              <Link href={`/siteler/${site.id}/kullanicilar`} className="underline">
                Müşteriyi davet et
              </Link>
            </>
          )}
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Ödeme kaydet</h3>
          <p className="mt-1 text-sm text-slate-600">Havale veya elden alınan ödemeyi girin; bitiş tarihi uzatılır.</p>
          <div className="mt-4">
            <PaymentForm
              siteId={site.id}
              today={toIsoDate(now)}
              currentEndsAt={site.subscriptionEndsAt?.toISOString() ?? null}
              hasOwner={owners.length > 0}
            />
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Bitiş tarihini değiştir</h3>
          <p className="mt-1 text-sm text-slate-600">
            Ücretsiz uzatma veya düzeltme için. Ödeme kaydı oluşturmaz. Boş bırakırsanız süre sınırı kalkar.
          </p>
          <div className="mt-4">
            <EndDateForm siteId={site.id} current={site.subscriptionEndsAt ? toIsoDate(site.subscriptionEndsAt) : ""} />
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold">Ödeme geçmişi</h3>
        {history.length === 0 ? (
          <p className="mt-2 text-slate-600">Kayıt yok.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200">
            {history.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-sm">
                <div>
                  <p className="font-medium">
                    {formatNumber(p.amount)} TL · {formatDate(p.paidOn)}
                  </p>
                  <p className="text-slate-500">
                    Bitiş {formatDate(p.periodEndsAt)}
                    {p.recordedBy && ` · ${p.recordedBy}`}
                    {p.note && ` · ${p.note}`}
                  </p>
                </div>
                <DeletePaymentButton paymentId={p.id} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5">{children}</section>;
}
