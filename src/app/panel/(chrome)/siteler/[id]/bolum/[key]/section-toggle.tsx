"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setSectionEnabled } from "../../actions";

export function SectionToggle({ siteId, sectionKey, enabled }: { siteId: string; sectionKey: string; enabled: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
      <span>Sitede göster</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setSectionEnabled(siteId, sectionKey, !enabled);
            router.refresh();
          })
        }
        className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-60 ${enabled ? "bg-emerald-500" : "bg-slate-300"}`}
      >
        <span
          className={`absolute left-0 top-0.5 size-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </label>
  );
}
