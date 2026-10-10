import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = { title: "Şifremi unuttum", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Şifremi unuttum</h1>
        <p className="mt-1 text-slate-600">E-posta adresinizi girin, yeni şifre belirleme bağlantısı gönderelim.</p>
      </div>
      <ForgotPasswordForm />
      <p className="text-sm text-slate-600">
        <Link href="/giris" className="font-medium text-slate-900 underline">
          Girişe dön
        </Link>
      </p>
    </div>
  );
}
