"use client";

import { useState, useTransition } from "react";
import { sendPasswordLink } from "../actions";

export function SendPasswordLinkButton({ userId }: { userId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();

  if (message) return <span className="text-xs text-emerald-700">{message}</span>;

  return (
    <button
      type="button"
      disabled={pending}
      className="text-slate-600 underline hover:text-slate-900 disabled:opacity-50"
      onClick={() =>
        startTransition(async () => {
          const result = await sendPasswordLink(userId);
          setMessage(result.ok ? "Bağlantı gönderildi" : result.message);
        })
      }
    >
      Şifre belirleme bağlantısı gönder
    </button>
  );
}
