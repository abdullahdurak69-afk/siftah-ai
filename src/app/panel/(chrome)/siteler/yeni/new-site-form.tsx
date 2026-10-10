"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, FormError, Input, Select } from "@/components/form";
import { sectors, type Sector } from "@/lib/config";
import { hasTemplate } from "@/templates/registry";
import { toSubdomain } from "@/lib/slug";
import { createSite, type CreateSiteState } from "./actions";

export function NewSiteForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<CreateSiteState, FormData>(createSite, {});
  const [name, setName] = useState(state.values?.name ?? "");
  const [subdomain, setSubdomain] = useState(state.values?.subdomain ?? "");
  // Kullanıcı adresi elle değiştirene kadar işletme adından otomatik önerilir
  const [subdomainTouched, setSubdomainTouched] = useState(Boolean(state.values?.subdomain));

  useEffect(() => {
    if (state.siteId) {
      router.push(`/siteler/${state.siteId}/kurulum`);
      router.refresh();
    }
  }, [state.siteId, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6">
      <FormError message={state.errors?.form} />

      <Field label="İşletme adı" error={state.errors?.name}>
        <Input
          name="name"
          required
          placeholder="Kaya Elektronik"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!subdomainTouched) setSubdomain(toSubdomain(e.target.value));
          }}
        />
      </Field>

      <Field
        label="Kısa ad"
        error={state.errors?.subdomain}
        hint="Sitenin panel içindeki kimliği, ziyaretçiye gösterilmez. Site, Domain sayfasından bağlanan domain'de yayınlanır."
      >
        <Input
          name="subdomain"
          required
          placeholder="kaya-elektronik"
          value={subdomain}
          onChange={(e) => {
            setSubdomainTouched(true);
            setSubdomain(e.target.value.toLowerCase());
          }}
        />
      </Field>

      <Field label="Sektör" error={state.errors?.sector}>
        <Select name="sector" required defaultValue={state.values?.sector ?? "usta"}>
          {Object.entries(sectors).map(([value, label]) => {
            const ready = hasTemplate(value as Sector);
            return (
              <option key={value} value={value} disabled={!ready}>
                {ready ? label : `${label} (yakında)`}
              </option>
            );
          })}
        </Select>
      </Field>

      <Button type="submit" disabled={pending || Boolean(state.siteId)}>
        {pending ? "Oluşturuluyor…" : "Siteyi oluştur"}
      </Button>
    </form>
  );
}
