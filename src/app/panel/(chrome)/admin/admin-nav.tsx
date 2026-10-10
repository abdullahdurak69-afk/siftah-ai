"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

const items = [
  { segment: null, href: "/admin", label: "Siteler" },
  { segment: "basvurular", href: "/admin/basvurular", label: "Başvurular" },
  { segment: "odemeler", href: "/admin/odemeler", label: "Ödemeler" },
  { segment: "kullanicilar", href: "/admin/kullanicilar", label: "Kullanıcılar" },
  { segment: "e-postalar", href: "/admin/e-postalar", label: "E-postalar" },
];

export function AdminNav() {
  const segments = useSelectedLayoutSegments();
  // /admin/siteler/<id> "Siteler" sekmesine aittir
  const current = segments[0] === "siteler" ? null : (segments[0] ?? null);

  return (
    <nav className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-1">
        {items.map((item) => {
          const active = item.segment === current;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-3 py-2 text-sm ${active ? "bg-slate-900 font-medium text-white" : "text-slate-700 hover:bg-white"}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
