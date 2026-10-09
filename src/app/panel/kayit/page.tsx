import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Kayıt ol", robots: { index: false } };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kayıt ol</h1>
        <p className="mt-1 text-slate-600">Birkaç dakikada işletmenizin web sitesini oluşturun.</p>
      </div>
      <RegisterForm />
      <p className="text-sm text-slate-600">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-medium text-slate-900 underline">
          Giriş yapın
        </Link>
      </p>
    </div>
  );
}
