"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Button, FormError, Input } from "@/components/form";
import { addDomain, checkDomain, removeDomain, setDomainExpiry } from "./actions";

export function AddDomainForm({ siteId }: { siteId: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setError(undefined);
        startTransition(async () => {
          const result = await addDomain(siteId, value);
          if (result.ok) router.refresh();
          else setError(result.message);
        });
      }}
    >
      <div className="flex flex-1 flex-col gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="firmaniz.com"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
        />
        <FormError message={error} />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Ekleniyor…" : "Domain'i bağla"}
      </Button>
    </form>
  );
}

export function DomainActions({ siteId, verified }: { siteId: string; verified: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"check" | "remove">();
  const [result, setResult] = useState<{ ok: boolean; text: string; warnings?: string[] }>();

  function run(kind: "check" | "remove") {
    if (kind === "remove" && !confirm("Domain bağlantısı kaldırılacak ve siteniz ziyaretçilere kapanacak. Emin misiniz?")) return;
    setAction(kind);
    setResult(undefined);
    startTransition(async () => {
      const res = kind === "check" ? await checkDomain(siteId) : await removeDomain(siteId);
      if (!res.ok) setResult({ ok: false, text: res.message });
      else if (kind === "check")
        setResult({
          ok: Boolean(res.verified),
          text: res.verified ? "DNS ayarları doğru, domain bağlandı." : "DNS ayarları henüz tamamlanmamış.",
          warnings: res.warnings,
        });
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        {!verified && (
          <button
            type="button"
            onClick={() => run("check")}
            disabled={pending}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {pending && action === "check" ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Kontrol et
          </button>
        )}
        <button
          type="button"
          onClick={() => run("remove")}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
        >
          <Trash2 className="size-4" /> Kaldır
        </button>
      </div>
      {result && (
        <div className="text-right text-sm">
          <p className={result.ok ? "text-emerald-700" : "text-amber-700"}>{result.text}</p>
          {result.warnings?.map((w) => (
            <p key={w} className="text-slate-500">
              {w}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// Süper admin: domain kaydının bitiş tarihi (yenileme hatırlatmaları bu tarihe göre gider)
export function DomainExpiryForm({ siteId, current }: { siteId: string; current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [message, setMessage] = useState<{ ok: boolean; text: string }>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(undefined);
        startTransition(async () => {
          const result = await setDomainExpiry(siteId, value);
          if (result.ok) {
            setMessage({ ok: true, text: "Kaydedildi." });
            router.refresh();
          } else setMessage({ ok: false, text: result.message });
        });
      }}
    >
      <div className="w-44">
        <Input type="date" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <Button type="submit" disabled={pending || value === current}>
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </Button>
      {message && <span className={`text-sm ${message.ok ? "text-emerald-700" : "text-red-600"}`}>{message.text}</span>}
    </form>
  );
}
