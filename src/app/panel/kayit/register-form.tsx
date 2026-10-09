"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Field, FormError, Input } from "@/components/form";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(undefined);

    const { error } = await authClient.signUp.email({
      name: String(form.get("name")).trim(),
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });

    if (error) {
      setPending(false);
      setError(
        error.code === "USER_ALREADY_EXISTS" || error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
          ? "Bu e-posta ile kayıtlı bir hesap zaten var."
          : error.code === "PASSWORD_TOO_SHORT"
            ? "Şifre en az 8 karakter olmalı."
            : "Kayıt olunamadı, tekrar deneyin.",
      );
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormError message={error} />
      <Field label="Ad soyad">
        <Input name="name" autoComplete="name" required minLength={2} />
      </Field>
      <Field label="E-posta">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Şifre" hint="En az 8 karakter">
        <Input name="password" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Hesap oluşturuluyor…" : "Hesap oluştur"}
      </Button>
    </form>
  );
}
