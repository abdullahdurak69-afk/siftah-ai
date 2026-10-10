"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Field, FormError, Input, Select, Textarea } from "@/components/form";
import { sectors } from "@/lib/config";
import { submitLead, type LeadFormState } from "./lead-actions";

// Tanıtım sitesindeki başvuru formu. Kayıt kapalı olduğu için yeni müşteri buradan gelir; biz arayıp siteyi açarız.
export function LeadForm({ source, sector = "" }: { source: string; sector?: string }) {
  const [state, formAction, pending] = useActionState<LeadFormState, FormData>(submitLead, {});

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <CheckCircle2 className="size-8 text-emerald-700" aria-hidden />
        <p className="text-lg font-semibold">Başvurunuz bize ulaştı.</p>
        <p>En kısa sürede sizi arayacağız. Bu sırada örnek sitelere göz atabilirsiniz.</p>
      </div>
    );
  }

  const v = state.values ?? {};
  return (
    // Hata sonrası değerler korunsun diye form yeniden kurulur (React gönderimden sonra formu sıfırlar)
    <form key={JSON.stringify(v)} action={formAction} className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <FormError message={state.errors?.form} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Adınız soyadınız" error={state.errors?.name}>
          <Input name="name" required autoComplete="name" defaultValue={v.name} />
        </Field>
        <Field label="Telefon" error={state.errors?.phone}>
          <Input name="phone" type="tel" required autoComplete="tel" placeholder="05xx xxx xx xx" defaultValue={v.phone} />
        </Field>
        <Field label="İşletmenizin adı">
          <Input name="businessName" autoComplete="organization" defaultValue={v.businessName} />
        </Field>
        <Field label="Sektör">
          <Select name="sector" defaultValue={v.sector ?? sector}>
            <option value="">Seçin</option>
            {Object.entries(sectors).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
            <option value="diger">Diğer</option>
          </Select>
        </Field>
      </div>
      <Field label="Mesajınız (isteğe bağlı)">
        <Textarea name="message" rows={3} placeholder="Domain'iniz var mı, ne zaman yayına girmek istersiniz?" defaultValue={v.message} />
      </Field>
      <input type="hidden" name="source" value={source} />
      {/* Botlar için gizli alan: insanlar görmez, doldurulursa başvuru kaydedilmez */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Web siteniz <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Bilgileriniz sadece sizinle iletişim için kullanılır.{" "}
          <a href="/kvkk" className="underline">
            Aydınlatma metni
          </a>
        </p>
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 whitespace-nowrap rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {pending ? "Gönderiliyor…" : "Beni arayın"}
        </button>
      </div>
    </form>
  );
}
