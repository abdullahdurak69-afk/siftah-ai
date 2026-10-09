"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { themes } from "@/templates/themes";
import { setTheme } from "./actions";

export function ThemePicker({ siteId, current }: { siteId: string; current: string }) {
  const [selected, setSelected] = useState(current);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2" aria-busy={pending}>
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          type="button"
          aria-pressed={selected === key}
          disabled={pending}
          onClick={() => {
            setSelected(key);
            startTransition(async () => {
              const result = await setTheme(siteId, key);
              if (!result.ok) setSelected(current);
            });
          }}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            selected === key ? "border-slate-900 font-medium" : "border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span className="size-4 rounded-full" style={{ background: theme.accent }} />
          {theme.label}
          {selected === key && <Check className="size-4" />}
        </button>
      ))}
    </div>
  );
}
