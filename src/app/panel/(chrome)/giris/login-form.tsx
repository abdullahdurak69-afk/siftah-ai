"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, Field, FormError, Input } from "@/components/form";

export function LoginForm() {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(undefined);

    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (error) {
      setPending(false);
      setError(error.status === 401 ? "E-posta veya şifre hatalı." : "Giriş yapılamadı, tekrar deneyin.");
      return;
    }

    // Tam sayfa geçişi: istemci yönlendiricisi giriş öncesi önceden yüklediği (girişe yönlendiren) panel sayfasını
    // önbellekten kullanıyor ve production'da giriş ekranında takılı kalıyordu
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- oturum değişti, tam yenileme gerekli
    window.location.assign("/");
  }

  return (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormError message={error} />
      <Field label="E-posta">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Şifre">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </Button>
    </form>
  );
}
