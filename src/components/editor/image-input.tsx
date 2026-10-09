"use client";

import { createContext, use, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { ImageValue } from "@/templates/engine/fields";

// Yükleme isteği hangi siteye ait; SectionForm tarafından sağlanır
export const UploadSiteContext = createContext<string>("");

async function upload(siteId: string, file: File): Promise<ImageValue> {
  const body = new FormData();
  body.set("siteId", siteId);
  body.set("file", file);
  const res = await fetch("/api/media", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Fotoğraf yüklenemedi.");
  return data as ImageValue;
}

function useUploader() {
  const siteId = use(UploadSiteContext);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string>();

  async function run(files: File[], onDone: (images: ImageValue[]) => void) {
    setError(undefined);
    setBusy(files.length);
    const results: ImageValue[] = [];
    // Telefonla çekilen büyük fotoğraflar sunucuyu zorlamasın diye sırayla yüklenir
    for (const file of files) {
      try {
        results.push(await upload(siteId, file));
      } catch (e) {
        setError((e as Error).message);
      }
      setBusy((n) => n - 1);
    }
    if (results.length) onDone(results);
  }

  return { busy, error, run };
}

const aspectClass = { wide: "aspect-[16/9]", square: "aspect-square", logo: "h-24" } as const;

export function ImageInput({
  value,
  onChange,
  aspect = "wide",
}: {
  value: ImageValue | null;
  onChange: (v: ImageValue | null) => void;
  aspect?: keyof typeof aspectClass;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useUploader();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy > 0}
          className={`relative flex w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-slate-400 ${aspectClass[aspect]}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.srcSmall} alt="" className={`size-full ${aspect === "logo" ? "object-contain p-2" : "object-cover"}`} />
          ) : (
            <span className="flex flex-col items-center gap-1 text-sm">
              <ImagePlus className="size-6" /> Fotoğraf seç
            </span>
          )}
          {busy > 0 && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="size-6 animate-spin text-slate-700" />
            </span>
          )}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            <Trash2 className="size-4" /> Kaldır
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          if (files.length) run(files.slice(0, 1), ([image]) => onChange(image));
        }}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}

export function GalleryInput({
  value,
  onChange,
  max = 24,
}: {
  value: ImageValue[];
  onChange: (v: ImageValue[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useUploader();
  // Yükleme sürerken gelen değişiklikleri kaybetmemek için son değeri ref'te tut
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);

  function move(index: number, delta: number) {
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-slate-500">
          {value.length} / {max}
        </span>
      </div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((image, index) => (
          <li key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.srcSmall} alt="" className="size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/60 p-1">
              <span className="flex">
                <GalleryButton label="Sola taşı" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ChevronLeft className="size-4" />
                </GalleryButton>
                <GalleryButton label="Sağa taşı" disabled={index === value.length - 1} onClick={() => move(index, 1)}>
                  <ChevronRight className="size-4" />
                </GalleryButton>
              </span>
              <GalleryButton label="Sil" onClick={() => onChange(value.filter((v) => v.id !== image.id))}>
                <Trash2 className="size-4" />
              </GalleryButton>
            </div>
          </li>
        ))}
        {Array.from({ length: busy }, (_, i) => (
          <li key={`yukleniyor-${i}`} className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
            <Loader2 className="size-6 animate-spin text-slate-500" />
          </li>
        ))}
        {value.length + busy < max && (
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-900"
            >
              <ImagePlus className="size-6" /> Ekle
            </button>
          </li>
        )}
      </ul>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const files = [...(e.target.files ?? [])].slice(0, max - value.length);
          e.target.value = "";
          if (files.length) run(files, (images) => onChange([...latest.current, ...images].slice(0, max)));
        }}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}

function GalleryButton({ label, children, ...props }: { label: string; children: React.ReactNode } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="rounded p-1 text-white hover:bg-white/20 disabled:opacity-30"
      {...props}
    >
      {children}
    </button>
  );
}
