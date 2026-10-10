import Link from "next/link";
import { requestNow } from "@/lib/request-time";
import type { SiteRole } from "@/lib/dal";
import { supportContact } from "@/lib/config";
import { formatDate, getSubscription, stateLabels } from "@/lib/subscription";

// Genel bakışta site sahibine ve admine abonelik özeti
export async function SubscriptionCard({ siteId, endsAt, role }: { siteId: string; endsAt: Date | null; role: SiteRole }) {
  const sub = getSubscription(endsAt, (await requestNow()).getTime());
  if (sub.state === "none" && role !== "admin") return null;
  const label = stateLabels[sub.state];
  const contact = [supportContact.phone, supportContact.email].filter(Boolean).join(" · ");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-semibold">Abonelik</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${label.className}`}>{label.text}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        {sub.endsAt
          ? sub.daysLeft! > 0
            ? `Yıllık aboneliğiniz ${formatDate(sub.endsAt)} tarihine kadar geçerli.`
            : `Aboneliğinizin süresi ${formatDate(sub.endsAt)} tarihinde doldu.`
          : "Henüz ödeme kaydı yok."}
        {role === "owner" && contact && ` Yenileme ve sorularınız için: ${contact}`}
      </p>
      {role === "admin" && (
        <Link href={`/admin/siteler/${siteId}`} className="mt-2 inline-block text-sm font-medium underline">
          Aboneliği yönet
        </Link>
      )}
    </section>
  );
}
