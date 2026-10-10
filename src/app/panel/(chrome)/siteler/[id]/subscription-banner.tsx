import Link from "next/link";
import { requestNow } from "@/lib/request-time";
import type { SiteRole } from "@/lib/dal";
import { supportContact } from "@/lib/config";
import { formatDate, getSubscription } from "@/lib/subscription";

// Aboneliği bitmek üzere olan, süresi dolan veya askıya alınan sitelerde panelin üstünde gösterilir
export async function SubscriptionBanner({ siteId, endsAt, role }: { siteId: string; endsAt: Date | null; role: SiteRole }) {
  const sub = getSubscription(endsAt, (await requestNow()).getTime());
  if (sub.state === "none" || sub.state === "active") return null;
  // Editörler abonelik ayrıntısını görmez; sadece sitenin neden kapalı olduğunu bilir
  if (role === "editor" && sub.state !== "suspended") return null;

  const end = formatDate(sub.endsAt!);
  const contact = [supportContact.phone, supportContact.email].filter(Boolean).join(" · ");

  const text =
    role === "editor"
      ? "Bu site şu an ziyaretçilere kapalı. Ayrıntı için site sahibiyle görüşün."
      : role === "admin"
        ? {
            expiring: `Bu sitenin aboneliği ${end} tarihinde bitiyor (${sub.daysLeft} gün kaldı).`,
            grace: `Bu sitenin aboneliği ${end} tarihinde doldu. Site ${formatDate(sub.suspendsAt!)} tarihinde askıya alınacak.`,
            suspended: `Bu sitenin aboneliği ${end} tarihinde doldu; site ziyaretçilere kapalı.`,
          }[sub.state]
        : {
            expiring: `Aboneliğiniz ${end} tarihinde bitiyor (${sub.daysLeft} gün kaldı). Kesinti olmaması için yenilemeyi unutmayın.`,
            grace: `Aboneliğinizin süresi ${end} tarihinde doldu. Siteniz ${formatDate(sub.suspendsAt!)} tarihine kadar yayında kalacak, sonra geçici olarak kapanacak.`,
            suspended:
              "Aboneliğiniz sona erdiği için siteniz şu an ziyaretçilere kapalı. İçerikleriniz silinmedi; ödeme yapıldığında site hemen yeniden açılır.",
          }[sub.state];

  const tone =
    sub.state === "expiring" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-red-200 bg-red-50 text-red-900";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tone}`}>
      <p>{text}</p>
      {role === "owner" && contact && <p className="mt-1 font-medium">Yenileme için: {contact}</p>}
      {role === "admin" && (
        <Link href={`/admin/siteler/${siteId}`} className="mt-1 inline-block font-medium underline">
          Ödeme kaydet
        </Link>
      )}
    </div>
  );
}
