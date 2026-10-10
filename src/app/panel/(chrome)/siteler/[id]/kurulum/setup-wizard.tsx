"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Field, FormError, Input } from "@/components/form";
import { SectionIcon } from "@/templates/icons";
import type { PresetOption, WizardCopy } from "@/templates/engine/setup";
import { completeSetup } from "./actions";

type Initial = {
  profession: string;
  cep: string;
  whatsapp: string;
  sabit: string;
  adres: string;
  ilce: string;
  il: string;
  bolgeler: string[];
};

export function SetupWizard({
  siteId,
  siteName,
  presets,
  copy,
  initial,
}: {
  siteId: string;
  siteName: string;
  presets: PresetOption[];
  copy: WizardCopy;
  initial: Initial;
}) {
  const steps = [copy.presetStep, "İletişim", copy.choicesStep, ...(copy.areas ? ["Bölgeler"] : [])];
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [sameWhatsapp, setSameWhatsapp] = useState(!initial.whatsapp || initial.whatsapp === initial.cep);
  const [choices, setChoices] = useState<number[]>([]);
  const [areaDraft, setAreaDraft] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>();
  const [pending, startTransition] = useTransition();

  const preset = presets.find((p) => p.key === data.profession);
  const update = (patch: Partial<Initial>) => setData((d) => ({ ...d, ...patch }));

  // Adım geçişlerinde sadece o adımın zorunlu alanları kontrol edilir; asıl doğrulama sunucuda
  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 0 && !preset) e.profession = "Bir tür seçin.";
    if (step === 1) {
      if (data.cep.replace(/\D/g, "").length < 10) e.cep = "Cep telefonunu girin.";
      if (!sameWhatsapp && data.whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "WhatsApp numarasını girin.";
      if (data.adres.trim().length < 5) e.adres = "Açık adresi girin.";
      if (data.ilce.trim().length < 2) e.ilce = "İlçeyi girin.";
      if (data.il.trim().length < 2) e.il = "İli girin.";
    }
    if (step === 2 && choices.length === 0) e.choices = "En az birini seçin.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    if (step === 0 && preset && choices.length === 0) setChoices(preset.choices.map((_, i) => i));
    if (step === 1 && data.bolgeler.length === 0 && data.ilce.trim()) update({ bolgeler: [data.ilce.trim()] });
    setStep((s) => s + 1);
  }

  function addAreas() {
    const parts = areaDraft
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p && !data.bolgeler.includes(p));
    if (parts.length) update({ bolgeler: [...data.bolgeler, ...parts] });
    setAreaDraft("");
  }

  function finish() {
    setMessage(undefined);
    startTransition(async () => {
      const result = await completeSetup(siteId, {
        ...data,
        whatsapp: sameWhatsapp ? "" : data.whatsapp,
        bolgeler: copy.areas ? data.bolgeler : [],
        choices,
      });
      if (result.ok) {
        router.push(`/siteler/${siteId}`);
        router.refresh();
      } else {
        const serverErrors = result.errors ?? {};
        setErrors(serverErrors);
        setMessage(result.message);
        // Hatalı alanın bulunduğu adıma geri dön
        const keys = Object.keys(serverErrors);
        if (keys.includes("profession")) setStep(0);
        else if (keys.some((k) => ["cep", "whatsapp", "sabit", "adres", "ilce", "il"].includes(k))) setStep(1);
        else if (keys.includes("choices")) setStep(2);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6">
      <ol className="flex gap-2 text-sm">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span className={`h-1.5 rounded-full ${i <= step ? "bg-slate-900" : "bg-slate-200"}`} />
            <span className={i === step ? "font-medium" : "text-slate-500"}>{label}</span>
          </li>
        ))}
      </ol>

      <FormError message={message} />

      {step === 0 && (
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold">{copy.presetTitle.replace("{ad}", siteName)}</h2>
            <p className="text-slate-600">{copy.presetHint}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {presets.map((p) => (
              <button
                key={p.key}
                type="button"
                aria-pressed={data.profession === p.key}
                onClick={() => {
                  if (data.profession !== p.key) setChoices([]);
                  update({ profession: p.key });
                }}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left ${
                  data.profession === p.key ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <SectionIcon name={p.icon} className="size-5 text-slate-600" />
                <span className="font-medium">{p.label}</span>
              </button>
            ))}
          </div>
          {errors.profession && <p className="text-sm text-red-600">{errors.profession}</p>}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">İletişim bilgileri</h2>
            <p className="text-slate-600">Ziyaretçiler sizi bu bilgilerle arayacak ve bulacak.</p>
          </div>
          <Field label="Cep telefonu" error={errors.cep}>
            <Input type="tel" value={data.cep} placeholder="0532 123 45 67" onChange={(e) => update({ cep: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={sameWhatsapp} onChange={(e) => setSameWhatsapp(e.target.checked)} />
            WhatsApp numaram cep telefonumla aynı
          </label>
          {!sameWhatsapp && (
            <Field label="WhatsApp numarası" error={errors.whatsapp}>
              <Input type="tel" value={data.whatsapp} onChange={(e) => update({ whatsapp: e.target.value })} />
            </Field>
          )}
          <Field label="Sabit telefon (isteğe bağlı)" error={errors.sabit}>
            <Input type="tel" value={data.sabit} placeholder="0216 123 45 67" onChange={(e) => update({ sabit: e.target.value })} />
          </Field>
          <Field label="Açık adres" error={errors.adres}>
            <Input value={data.adres} placeholder="Örnek Mah. Çınar Sok. No:5" onChange={(e) => update({ adres: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="İlçe" error={errors.ilce} hint="Sitenin başlığında kullanılır.">
              <Input value={data.ilce} placeholder="Sancaktepe" onChange={(e) => update({ ilce: e.target.value })} />
            </Field>
            <Field label="İl" error={errors.il}>
              <Input value={data.il} onChange={(e) => update({ il: e.target.value })} />
            </Field>
          </div>
        </div>
      )}

      {step === 2 && preset && (
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold">{copy.choicesTitle}</h2>
            <p className="text-slate-600">{copy.choicesHint}</p>
          </div>
          <ul className="flex flex-col gap-2">
            {preset.choices.map((s, i) => {
              const checked = choices.includes(i);
              return (
                <li key={s.baslik}>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                      checked ? "border-slate-900" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setChoices(checked ? choices.filter((x) => x !== i) : [...choices, i].sort((a, b) => a - b))}
                    />
                    <SectionIcon name={s.ikon} className="size-5 text-slate-600" />
                    <span className="font-medium">{s.baslik}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          {errors.choices && <p className="text-sm text-red-600">{errors.choices}</p>}
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold">Hangi bölgelere hizmet veriyorsunuz?</h2>
            <p className="text-slate-600">
              İlçe ve mahalleleri ekleyin. Google&apos;da &quot;{data.ilce || "ilçe"} {preset?.label.toLocaleLowerCase("tr")}&quot;
              gibi aramalarda bulunmanıza yardımcı olur.
            </p>
          </div>
          {data.bolgeler.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {data.bolgeler.map((area) => (
                <li key={area} className="flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-3 pr-1.5 text-sm">
                  {area}
                  <button
                    type="button"
                    aria-label={`${area} sil`}
                    className="rounded-full p-0.5 text-slate-500 hover:bg-slate-200"
                    onClick={() => update({ bolgeler: data.bolgeler.filter((a) => a !== area) })}
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              value={areaDraft}
              placeholder="Mahalle veya ilçe adı (virgülle birden fazla)"
              onChange={(e) => setAreaDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAreas();
                }
              }}
            />
            <button type="button" onClick={addAreas} className="shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-medium hover:bg-slate-50">
              Ekle
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0 || pending}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:invisible"
        >
          Geri
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={next} className="rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-700">
            Devam
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            disabled={pending}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {pending ? "Site hazırlanıyor…" : (
              <>
                <Check className="size-4" /> Sitemi oluştur
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
