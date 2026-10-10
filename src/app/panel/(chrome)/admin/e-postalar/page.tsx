import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { emailLog, sites } from "@/db/schema";

export const metadata: Metadata = { title: "Yönetim · E-postalar", robots: { index: false } };

const statusLabels = {
  sent: { text: "Gönderildi", className: "bg-emerald-100 text-emerald-800" },
  logged: { text: "Gönderilmedi (SMTP yok)", className: "bg-slate-100 text-slate-700" },
  failed: { text: "Hata", className: "bg-red-100 text-red-700" },
} as const;

const timeFormat = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminEmailsPage() {
  const rows = await db
    .select({
      id: emailLog.id,
      to: emailLog.to,
      subject: emailLog.subject,
      status: emailLog.status,
      error: emailLog.error,
      createdAt: emailLog.createdAt,
      siteName: sites.name,
    })
    .from(emailLog)
    .leftJoin(sites, eq(sites.id, emailLog.siteId))
    .orderBy(desc(emailLog.createdAt))
    .limit(200);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600">Son 200 e-posta. Davetler, şifre bağlantıları, ödeme bildirimleri ve abonelik hatırlatmaları.</p>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">Henüz e-posta gönderilmedi.</p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {rows.map((r) => {
            const status = statusLabels[r.status as keyof typeof statusLabels] ?? statusLabels.failed;
            return (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{r.subject}</p>
                  <p className="truncate text-slate-500">
                    {r.to}
                    {r.siteName && ` · ${r.siteName}`}
                  </p>
                  {r.error && <p className="text-red-600">{r.error}</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>{status.text}</span>
                  <span className="text-xs text-slate-400">{timeFormat.format(r.createdAt)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
