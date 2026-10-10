import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { sectors } from "@/lib/config";
import { leadStatuses, type LeadStatus } from "@/lib/leads";
import { telHref, whatsappHref } from "@/lib/turkish";
import { LeadStatusSelect } from "./lead-status";

export const metadata: Metadata = { title: "Yönetim · Başvurular", robots: { index: false } };

const timeFormat = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminLeadsPage() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(300);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600">
        Tanıtım sitesindeki başvuru formundan gelenler. Arayıp siteyi açtıktan sonra durumunu güncelleyin; bir yıldan
        eski başvurular otomatik silinir.
      </p>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">Henüz başvuru yok.</p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {rows.map((lead) => {
            const status = leadStatuses[lead.status as LeadStatus] ?? leadStatuses.new;
            const sector = sectors[lead.sector as keyof typeof sectors] ?? (lead.sector === "diger" ? "Diğer" : lead.sector);
            return (
              <li key={lead.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">
                    {lead.name}
                    {lead.businessName && <span className="text-slate-500"> · {lead.businessName}</span>}
                  </p>
                  <p className="text-slate-600">
                    <a href={telHref(lead.phone)} className="underline">{lead.phone}</a>
                    {" · "}
                    <a href={whatsappHref(lead.phone)} target="_blank" rel="noreferrer" className="underline">WhatsApp</a>
                    {sector && ` · ${sector}`}
                    {lead.source && <span className="text-slate-400"> · {lead.source}</span>}
                  </p>
                  {lead.message && <p className="mt-1 whitespace-pre-line text-slate-700">{lead.message}</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>{status.text}</span>
                  <LeadStatusSelect leadId={lead.id} current={lead.status as LeadStatus} />
                  <span className="text-xs text-slate-400">{timeFormat.format(lead.createdAt)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
