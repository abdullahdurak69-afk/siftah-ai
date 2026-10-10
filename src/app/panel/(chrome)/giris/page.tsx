import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Giriş", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Giriş yap</h1>
        <p className="mt-1 text-slate-600">Sitenizi yönetmek için hesabınıza girin.</p>
      </div>
      <LoginForm />
      <p className="text-sm text-slate-600">
        <Link href="/sifremi-unuttum" className="font-medium text-slate-900 underline">
          Şifremi unuttum
        </Link>
      </p>
    </div>
  );
}
