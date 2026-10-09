"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { Fields } from "@/templates/engine/fields";
import { saveSection } from "@/app/panel/(chrome)/siteler/[id]/actions";
import { FieldGroup } from "./field-input";
import { UploadSiteContext } from "./image-input";

export function SectionForm({
  siteId,
  sectionKey,
  fields,
  initial,
}: {
  siteId: string;
  sectionKey: string;
  fields: Fields;
  initial: Record<string, unknown>;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  // Sunucudaki içerik değişirse (kaydetme sonrası temizlenmiş hali ya da "Geri al") form onu gösterir;
  // aksi halde geri alınan bir değişiklik farkında olmadan tekrar kaydedilebilirdi.
  const [base, setBase] = useState(initial);
  if (JSON.stringify(initial) !== JSON.stringify(base)) {
    setBase(initial);
    setValue(initial);
    setErrors({});
    setDirty(false);
  }

  return (
    <UploadSiteContext value={siteId}>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            const result = await saveSection(siteId, sectionKey, value);
            if (result.ok) {
              setErrors({});
              setMessage(undefined);
              setSaved(true);
              setDirty(false);
              // Yayınlanmamış değişiklik göstergesi güncellensin
              router.refresh();
            } else {
              setErrors(result.errors ?? {});
              setMessage(result.message);
            }
          });
        }}
      >
        {Object.keys(fields).length === 0 ? (
          <p className="text-slate-600">Bu bölümün düzenlenecek alanı yok.</p>
        ) : (
          <FieldGroup
            fields={fields}
            value={value}
            errors={errors}
            onChange={(next) => {
              setValue(next);
              setSaved(false);
              setDirty(true);
            }}
          />
        )}
  
        <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
          <button
            type="submit"
            disabled={pending || !dirty}
            className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
          {saved && !dirty && (
            <span className="flex items-center gap-1 text-sm text-emerald-700">
              <Check className="size-4" /> Kaydedildi
            </span>
          )}
          {dirty && !pending && <span className="text-sm text-slate-500">Kaydedilmemiş değişiklikler var</span>}
          {message && <span className="text-sm text-red-600">{message}</span>}
        </div>
      </form>
    </UploadSiteContext>
  );
}
