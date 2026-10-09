"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      onClick={async () => {
        await authClient.signOut();
        router.push("/giris");
        router.refresh();
      }}
    >
      Çıkış
    </button>
  );
}
