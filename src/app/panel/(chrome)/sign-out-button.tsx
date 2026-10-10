"use client";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  return (
    <button
      type="button"
      className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      onClick={async () => {
        await authClient.signOut();
        // Tam sayfa geçişi: oturumlu sayfaların önbellekteki hâli çıkıştan sonra gösterilmesin
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- oturum değişti, tam yenileme gerekli
        window.location.assign("/giris");
      }}
    >
      Çıkış
    </button>
  );
}
