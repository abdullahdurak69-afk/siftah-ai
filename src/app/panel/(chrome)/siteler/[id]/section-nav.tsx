"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { EyeOff } from "lucide-react";

type Item = { key: string; title: string; optional: boolean; enabled: boolean };

export function SectionNav({ siteId, items }: { siteId: string; items: Item[] }) {
  // ["bolum", "<key>"] ya da [] (genel bakış)
  const segments = useSelectedLayoutSegments();
  const activeKey = segments[0] === "bolum" ? segments[1] : segments.length === 0 ? "" : segments[0] === "domain" ? "domain" : null;
  const navRef = useRef<HTMLElement>(null);

  // Mobilde menü yatay kayar; aktif bölüm görünür alana getirilir
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    navRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [activeKey]);

  return (
    <nav ref={navRef} className="-mx-4 overflow-x-auto px-4 md:mx-0 md:w-60 md:shrink-0 md:overflow-visible md:px-0">
      <ul className="flex gap-1 md:flex-col">
        <NavLink href={`/siteler/${siteId}`} active={activeKey === ""}>
          Genel bakış
        </NavLink>
        <NavLink href={`/siteler/${siteId}/domain`} active={activeKey === "domain"}>
          Domain
        </NavLink>
        {items.map((item) => (
          <NavLink key={item.key} href={`/siteler/${siteId}/bolum/${item.key}`} active={activeKey === item.key}>
            <span className={item.enabled || activeKey === item.key ? "" : "text-slate-400"}>{item.title}</span>
            {!item.enabled && <EyeOff className="size-3.5 shrink-0 opacity-60" aria-label="Gizli" />}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <li className="shrink-0">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
          active ? "bg-slate-900 font-medium text-white" : "text-slate-700 hover:bg-white"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}
