// Abonelik durumu bitiş tarihinden hesaplanır; ayrıca saklanmaz. Proxy, panel ve cron ortak kullanır.
//
//   Aktif               bitişe 30 günden fazla var
//   Yenileme yaklaşıyor bitişe 30 gün veya daha az var (30, 7 ve 1 gün kala e-posta)
//   Tolerans            bitişten sonraki 15 gün: site yayında, panelde uyarı
//   Askıda              tolerans bitti: site "geçici olarak yayında değil" sayfası gösterir, veri silinmez
//   Kayıt yok           bitiş tarihi girilmemiş (ödeme henüz işlenmemiş): site normal çalışır

export const graceDays = 15;
export const expiringDays = 30;
export const reminderDays = [30, 7, 1] as const;

const dayMs = 24 * 60 * 60 * 1000;
export const timeZone = "Europe/Istanbul";

export type SubscriptionState = "none" | "active" | "expiring" | "grace" | "suspended";

export type SubscriptionInfo = {
  state: SubscriptionState;
  endsAt: Date | null;
  // Bitişe kalan tam gün (geçtiyse negatif); kayıt yoksa null
  daysLeft: number | null;
  // Toleransın bitip sitenin kapanacağı an
  suspendsAt: Date | null;
};

export function getSubscription(endsAt: Date | null, now: number): SubscriptionInfo {
  if (!endsAt) return { state: "none", endsAt: null, daysLeft: null, suspendsAt: null };

  const remaining = endsAt.getTime() - now;
  // Takvim günü farkı (Türkiye saatine göre): bitiş bugünse 0, dün bittiyse -1
  const daysLeft = Math.round((Date.parse(toIsoDate(endsAt)) - Date.parse(toIsoDate(new Date(now)))) / dayMs);
  const suspendsAt = new Date(endsAt.getTime() + graceDays * dayMs);

  let state: SubscriptionState;
  if (remaining > expiringDays * dayMs) state = "active";
  else if (remaining > 0) state = "expiring";
  else if (now < suspendsAt.getTime()) state = "grace";
  else state = "suspended";

  return { state, endsAt, daysLeft, suspendsAt };
}

export function isSuspended(endsAt: Date | null, now: number) {
  return Boolean(endsAt) && now >= endsAt!.getTime() + graceDays * dayMs;
}

export const stateLabels: Record<SubscriptionState, { text: string; className: string }> = {
  none: { text: "Ödeme kaydı yok", className: "bg-slate-100 text-slate-700" },
  active: { text: "Aktif", className: "bg-emerald-100 text-emerald-800" },
  expiring: { text: "Yenileme yaklaşıyor", className: "bg-amber-100 text-amber-800" },
  grace: { text: "Süresi doldu", className: "bg-orange-100 text-orange-800" },
  suspended: { text: "Askıda", className: "bg-red-100 text-red-700" },
};

// --- Tarih yardımcıları (tüm tarihler Türkiye saatine göre) ---

// "2027-10-10" -> o günün Türkiye saatiyle son anı. Bitiş tarihleri gün sonu olarak saklanır.
export function endOfDay(isoDate: string) {
  return new Date(`${isoDate}T23:59:59.999+03:00`);
}

// Date -> "2027-10-10" (Türkiye saatine göre)
export function toIsoDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function formatDate(date: Date | string) {
  const value = typeof date === "string" ? new Date(`${date}T12:00:00+03:00`) : date;
  return new Intl.DateTimeFormat("tr-TR", { timeZone, day: "numeric", month: "long", year: "numeric" }).format(value);
}

export function addMonths(isoDate: string, months: number) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  // 31 Ocak + 1 ay -> 28/29 Şubat (ayın son gününe sabitlenir)
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

// Ödeme alındığında yeni bitiş tarihi: abonelik hâlâ geçerliyse veya tolerans içindeyse mevcut bitişin üstüne,
// çoktan askıya alınmışsa ödeme gününden itibaren eklenir.
export function extendedEndDate(currentEndsAt: Date | null, paidOn: string, months: number) {
  const paidAt = endOfDay(paidOn).getTime();
  const base =
    currentEndsAt && paidAt <= currentEndsAt.getTime() + graceDays * dayMs ? toIsoDate(currentEndsAt) : paidOn;
  return addMonths(base, months);
}

export function daysText(days: number) {
  if (days === 0) return "bugün";
  return days > 0 ? `${days} gün sonra` : `${-days} gün önce`;
}
