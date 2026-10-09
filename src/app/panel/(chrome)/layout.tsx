import { Suspense } from "react";
import Link from "next/link";
import { platformName } from "@/lib/config";
import { getCurrentUser } from "@/lib/dal";
import { SignOutButton } from "./sign-out-button";

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="font-semibold tracking-tight">
            {platformName} <span className="font-normal text-slate-500">Panel</span>
          </Link>
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}

async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden text-slate-600 sm:inline">{user.name}</span>
      {user.isSuperAdmin && (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
          Süper admin
        </span>
      )}
      <SignOutButton />
    </div>
  );
}
