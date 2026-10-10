"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, Field, FormError, Input } from "@/components/form";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(undefined);

    const { error } = await authClient.requestPasswordReset({ email: String(form.get("email")) });
    setPending(false);
    if (error) {
      setError(error.status === 429 ? "Çok fazla deneme yaptınız, biraz sonra tekrar deneyin." : "İstek gönderilemedi, tekrar deneyin.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800">
        Bu e-posta adresiyle bir hesap varsa şifre belirleme bağlantısı gönderildi. Gelen kutunuzu (ve gereksiz
        klasörünü) kontrol edin.
      </p>
    );
  }

  return (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormError message={error} />
      <Field label="E-posta">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Gönderiliyor…" : "Bağlantı gönder"}
      </Button>
    </form>
  );
}
