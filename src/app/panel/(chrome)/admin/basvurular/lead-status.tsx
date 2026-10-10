"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@/lib/leads";
import { setLeadStatus } from "../actions";

const options: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "Arandı" },
  { value: "closed", label: "Kapandı" },
];

export function LeadStatusSelect({ leadId, current }: { leadId: string; current: LeadStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <select
      aria-label="Durum"
      defaultValue={current}
      disabled={pending}
      onChange={(e) => {
        const status = e.target.value as LeadStatus;
        startTransition(async () => {
          await setLeadStatus(leadId, status);
          router.refresh();
        });
      }}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
