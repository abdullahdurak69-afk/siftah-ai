"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Field, FormError, Input } from "@/components/form";
import { legalUrl } from "@/lib/legal-links";

export function SetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("password"));
    if (newPassword !== String(form.get("password2"))) {
      setError("Şifreler aynı değil.");
      return;
    }
    setPending(true);
    setError(undefined);

    const { error } = await authClient.resetPassword({ newPassword, token });
    setPending(false);
    if (error) {
      setError(
        error.code === "INVALID_TOKEN"
          ? "Bağlantının süresi dolmuş veya daha önce kullanılmış. \"Şifremi unuttum\" ile yeni bağlantı alın."
          : error.code === "PASSWORD_TOO_SHORT"
            ? "Şifre en az 8 karakter olmalı."
            : "Şifre kaydedilemedi, tekrar deneyin.",
      );
      return;
    }
    setDone(true);
  }

  if (!token) {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">
        Bağlantı eksik. E-postadaki bağlantıyı tam olarak açtığınızdan emin olun veya{" "}
        <Link href="/sifremi-unuttum" className="font-medium underline">
          yeni bağlantı isteyin
        </Link>
        .
      </p>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800">Şifreniz kaydedildi.</p>
        <Link href="/giris" className="rounded-lg bg-slate-900 px-4 py-2.5 text-center font-medium text-white hover:bg-slate-700">
          Giriş yap
        </Link>
      </div>
    );
  }

  return (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormError message={error} />
      <Field label="Yeni şifre">
        <Input name="password" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Field label="Yeni şifre (tekrar)">
        <Input name="password2" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <p className="text-sm text-slate-500">
        Devam ederek{" "}
        <a href={legalUrl("kullanim-kosullari")} target="_blank" rel="noreferrer" className="underline">
          kullanım koşullarını
        </a>{" "}
        ve{" "}
        <a href={legalUrl("kvkk")} target="_blank" rel="noreferrer" className="underline">
          KVKK aydınlatma metnini
        </a>{" "}
        okuduğunuzu kabul edersiniz.
      </p>
      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor…" : "Şifremi kaydet"}
      </Button>
    </form>
  );
}
