"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, FormError, Input, Select } from "@/components/form";
import { inviteMember, removeMember, resendMemberInvite } from "./actions";

export function InviteForm({ siteId, allowOwner }: { siteId: string; allowOwner: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        setError(undefined);
        setSuccess(undefined);
        startTransition(async () => {
          const result = await inviteMember(siteId, {
            name: String(data.get("name") ?? ""),
            email: String(data.get("email") ?? ""),
            role: String(data.get("role") ?? "editor"),
          });
          if (!result.ok) return setError(result.message);
          setSuccess(result.message);
          form.reset();
          router.refresh();
        });
      }}
    >
      <FormError message={error} />
      {success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad soyad">
          <Input name="name" required autoComplete="off" />
        </Field>
        <Field label="E-posta">
          <Input name="email" type="email" required autoComplete="off" autoCapitalize="none" spellCheck={false} />
        </Field>
      </div>
      <Field label="Rol">
        <Select name="role" defaultValue={allowOwner ? "owner" : "editor"}>
          {allowOwner && <option value="owner">Site sahibi (müşteri)</option>}
          <option value="editor">Editör</option>
        </Select>
      </Field>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Gönderiliyor…" : "Davet gönder"}
      </Button>
    </form>
  );
}

export function MemberActions({
  siteId,
  userId,
  pending,
  canRemove,
}: {
  siteId: string;
  userId: string;
  pending: boolean;
  canRemove: boolean;
}) {
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();

  function run(action: "resend" | "remove") {
    if (action === "remove" && !confirm("Bu kişinin siteye erişimi kaldırılacak. Emin misiniz?")) return;
    setMessage(undefined);
    startTransition(async () => {
      const result = action === "resend" ? await resendMemberInvite(siteId, userId) : await removeMember(siteId, userId);
      setMessage(result.message);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      {pending && (
        <button type="button" disabled={busy} onClick={() => run("resend")} className="text-slate-600 underline hover:text-slate-900 disabled:opacity-50">
          Daveti yeniden gönder
        </button>
      )}
      {canRemove && (
        <button type="button" disabled={busy} onClick={() => run("remove")} className="text-red-600 underline hover:text-red-800 disabled:opacity-50">
          Çıkar
        </button>
      )}
      {message && <span className="w-full text-right text-xs text-slate-500">{message}</span>}
    </>
  );
}
