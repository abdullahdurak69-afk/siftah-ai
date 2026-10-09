"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, Loader2, RotateCcw, Upload } from "lucide-react";
import { discardChanges, publishSite } from "./actions";

export function PublishBar({
  siteId,
  status,
  published,
  hasUnpublishedChanges,
}: {
  siteId: string;
  status: "draft" | "published" | "suspended";
  published: boolean;
  hasUnpublishedChanges: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"publish" | "discard">();
  const [message, setMessage] = useState<{ ok: boolean; text: string }>();

  function run(kind: "publish" | "discard") {
    if (kind === "discard" && !confirm("Yayınlanmamış tüm değişiklikler silinecek ve site yayındaki haline dönecek. Emin misiniz?")) return;
    setAction(kind);
    setMessage(undefined);
    startTransition(async () => {
      const result = kind === "publish" ? await publishSite(siteId) : await discardChanges(siteId);
      if (result.ok) {
        setMessage({ ok: true, text: kind === "publish" ? "Siteniz yayında." : "Değişiklikler geri alındı." });
        router.refresh();
      } else {
        setMessage({ ok: false, text: result.message ?? "İşlem yapılamadı." });
      }
    });
  }

  const statusBadge =
    status === "suspended"
      ? { text: "Askıda", className: "bg-red-100 text-red-700" }
      : published
        ? { text: "Yayında", className: "bg-emerald-100 text-emerald-800" }
        : { text: "Henüz yayınlanmadı", className: "bg-slate-100 text-slate-700" };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge.className}`}>{statusBadge.text}</span>
        {published && hasUnpublishedChanges && (
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="size-2 rounded-full bg-amber-500" /> Yayınlanmamış değişiklikler var
          </span>
        )}
        {published && !hasUnpublishedChanges && <span className="text-slate-500">Tüm değişiklikler yayında</span>}
        {message && <span className={message.ok ? "text-emerald-700" : "text-red-600"}>{message.text}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {published && hasUnpublishedChanges && (
          <button
            type="button"
            onClick={() => run("discard")}
            disabled={pending}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            <RotateCcw className="size-4" /> Geri al
          </button>
        )}
        <Link
          href={`/siteler/${siteId}/onizleme`}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          <Eye className="size-4" /> Önizle
        </Link>
        <button
          type="button"
          onClick={() => run("publish")}
          disabled={pending || !hasUnpublishedChanges}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {pending && action === "publish" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : hasUnpublishedChanges ? (
            <Upload className="size-4" />
          ) : (
            <Check className="size-4" />
          )}
          {hasUnpublishedChanges ? "Yayınla" : "Güncel"}
        </button>
      </div>
    </div>
  );
}
