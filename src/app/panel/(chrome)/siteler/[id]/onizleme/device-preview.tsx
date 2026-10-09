"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Link2, Monitor, Smartphone, Tablet } from "lucide-react";
import { createPreviewLink } from "../actions";

const devices = {
  telefon: { label: "Telefon", width: 390, Icon: Smartphone },
  tablet: { label: "Tablet", width: 820, Icon: Tablet },
  masaustu: { label: "Masaüstü", width: null, Icon: Monitor },
} as const;

type Device = keyof typeof devices;

export function DevicePreview({ siteId }: { siteId: string }) {
  const [device, setDevice] = useState<Device>("telefon");
  const width = devices[device].width;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-slate-200 bg-white p-1" role="group" aria-label="Cihaz">
          {(Object.keys(devices) as Device[]).map((key) => {
            const { label, Icon } = devices[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={device === key}
                onClick={() => setDevice(key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${
                  device === key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="size-4" /> <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>
        <ShareLink siteId={siteId} />
      </div>

      <div className="flex justify-center rounded-xl bg-slate-200 p-4">
        <iframe
          title="Site önizlemesi"
          src={`/onizleme/${siteId}`}
          className="h-[75vh] rounded-lg border border-slate-300 bg-white shadow-sm transition-[width]"
          style={{ width: width ? `${width}px` : "100%", maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}

function ShareLink({ siteId }: { siteId: string }) {
  const [url, setUrl] = useState<string>();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (url) {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-md">
        <input readOnly value={url} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm" onFocus={(e) => e.target.select()} />
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
          }}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-sm text-red-600">{error}</span>}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await createPreviewLink(siteId);
            if (result.ok && result.url) setUrl(result.url);
            else setError(result.ok ? undefined : result.message);
          })
        }
        title="Giriş yapmadan taslağı görebilecekleri 7 gün geçerli bir link"
        className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
      >
        <Link2 className="size-4" /> Müşteriye önizleme linki oluştur
      </button>
    </div>
  );
}
