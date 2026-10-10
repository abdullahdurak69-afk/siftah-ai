"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, FormError, Input, Select } from "@/components/form";
import { extendedEndDate, formatDate } from "@/lib/subscription";
import { deletePayment, recordPayment, setSubscriptionEnd } from "../../actions";

export function PaymentForm({
  siteId,
  today,
  currentEndsAt,
  hasOwner,
}: {
  siteId: string;
  today: string;
  currentEndsAt: string | null;
  hasOwner: boolean;
}) {
  const router = useRouter();
  const [paidOn, setPaidOn] = useState(today);
  const [months, setMonths] = useState(12);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const newEnd = /^\d{4}-\d{2}-\d{2}$/.test(paidOn)
    ? extendedEndDate(currentEndsAt ? new Date(currentEndsAt) : null, paidOn, months)
    : null;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        setError(undefined);
        setSuccess(false);
        startTransition(async () => {
          const result = await recordPayment(siteId, {
            amount: String(data.get("amount") ?? ""),
            paidOn,
            months,
            note: String(data.get("note") ?? ""),
            notify: data.get("notify") === "on",
          });
          if (!result.ok) return setError(result.message);
          setSuccess(true);
          form.reset();
          setPaidOn(today);
          setMonths(12);
          router.refresh();
        });
      }}
    >
      <FormError message={error} />
      {success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Ödeme kaydedildi.</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tutar (TL)">
          <Input name="amount" type="number" inputMode="numeric" min={0} step={1} required />
        </Field>
        <Field label="Ödeme tarihi">
          <Input type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} required />
        </Field>
      </div>
      <Field label="Süre" hint={newEnd ? `Yeni bitiş tarihi: ${formatDate(newEnd)}` : undefined}>
        <Select value={months} onChange={(e) => setMonths(Number(e.target.value))}>
          <option value={12}>1 yıl</option>
          <option value={24}>2 yıl</option>
          <option value={6}>6 ay</option>
          <option value={1}>1 ay</option>
        </Select>
      </Field>
      <Field label="Not (isteğe bağlı)">
        <Input name="note" placeholder="Havale, dekont no..." />
      </Field>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="notify" defaultChecked={hasOwner} disabled={!hasOwner} className="size-4" />
        Site sahibine &quot;ödemeniz alındı&quot; e-postası gönder
      </label>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Kaydediliyor…" : "Ödemeyi kaydet"}
      </Button>
    </form>
  );
}

export function EndDateForm({ siteId, current }: { siteId: string; current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-start"
      onSubmit={(e) => {
        e.preventDefault();
        setError(undefined);
        startTransition(async () => {
          const result = await setSubscriptionEnd(siteId, value);
          if (!result.ok) setError(result.message);
          else router.refresh();
        });
      }}
    >
      <div className="flex flex-1 flex-col gap-2">
        <Input type="date" value={value} onChange={(e) => setValue(e.target.value)} />
        <FormError message={error} />
      </div>
      <Button type="submit" disabled={pending || value === current}>
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </Button>
    </form>
  );
}

export function DeletePaymentButton({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="text-red-600 underline hover:text-red-800 disabled:opacity-50"
      onClick={() => {
        if (!confirm("Ödeme kaydı silinecek. Bu ödemeyle uzatılan bitiş tarihi bir önceki ödemeye döner. Emin misiniz?")) return;
        startTransition(async () => {
          const result = await deletePayment(paymentId);
          if (!result.ok) alert(result.message);
          router.refresh();
        });
      }}
    >
      Sil
    </button>
  );
}
