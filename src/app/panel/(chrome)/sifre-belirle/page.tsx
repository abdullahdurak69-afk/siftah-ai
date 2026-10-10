import type { Metadata } from "next";
import { Suspense } from "react";
import { SetPasswordForm } from "./set-password-form";

export const metadata: Metadata = { title: "Şifre belirle", robots: { index: false } };

// Hem davet hem şifre yenileme bağlantısı buraya gelir (?token=...)
export default function SetPasswordPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Şifrenizi belirleyin</h1>
        <p className="mt-1 text-slate-600">En az 8 karakterlik bir şifre seçin.</p>
      </div>
      <Suspense fallback={null}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}
