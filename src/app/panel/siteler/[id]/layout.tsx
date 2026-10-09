import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getEditableSite } from "@/lib/dal";
import { siteUrl } from "@/lib/config";
import { getTemplate } from "@/templates/registry";
import { SectionNav } from "./section-nav";

// Panel her istekte kullanıcıya özel veri okur; statik kabuk gerekmez
export const instant = false;

export default async function SiteEditorLayout({ children, params }: LayoutProps<"/panel/siteler/[id]">) {
  const { id } = await params;
  const { site, sections } = await getEditableSite(id);
  const template = getTemplate(site.sector);
  const url = siteUrl(site.subdomain);

  const navItems =
    template && site.setupCompletedAt
      ? template.sections.map((def) => {
          const row = sections.find((s) => s.key === def.key);
          return { key: def.key, title: def.title, optional: def.optional, enabled: row?.enabled ?? false };
        })
      : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
            ← Siteler
          </Link>
          <h1 className="truncate text-2xl font-semibold tracking-tight">
            <Link href={`/siteler/${site.id}`}>{site.name}</Link>
          </h1>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Siteyi aç <ExternalLink className="size-4" />
        </a>
      </div>

      {navItems.length > 0 ? (
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <SectionNav siteId={site.id} items={navItems} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
