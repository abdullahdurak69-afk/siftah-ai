import { Suspense } from "react";
import Link from "next/link";
import { listSitesForCurrentUser, requireUser } from "@/lib/dal";
import { sectors, siteUrl } from "@/lib/config";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Siteler</h1>
        <Link
          href="/siteler/yeni"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Yeni site
        </Link>
      </div>
      <Suspense fallback={<p className="text-slate-500">Yükleniyor…</p>}>
        <SiteList />
      </Suspense>
    </div>
  );
}

const statusLabels = {
  draft: { text: "Taslak", className: "bg-slate-100 text-slate-700" },
  published: { text: "Yayında", className: "bg-emerald-100 text-emerald-800" },
  suspended: { text: "Askıda", className: "bg-red-100 text-red-700" },
} as const;

async function SiteList() {
  const [user, sites] = await Promise.all([requireUser(), listSitesForCurrentUser()]);

  if (sites.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="font-medium">Henüz bir siteniz yok.</p>
        <p className="mt-1 text-slate-600">İlk sitenizi oluşturmak birkaç dakika sürer.</p>
        <Link href="/siteler/yeni" className="mt-4 inline-block font-medium underline">
          Site oluştur
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {user.isSuperAdmin && (
        <p className="text-sm text-slate-500">Süper admin olarak tüm siteleri görüyorsunuz ({sites.length}).</p>
      )}
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {sites.map((site) => {
          const status = statusLabels[site.status];
          const url = siteUrl(site.subdomain);
          return (
            <li key={site.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <Link href={`/siteler/${site.id}`} className="min-w-0 hover:underline">
                <p className="font-medium">{site.name}</p>
                <p className="text-sm text-slate-500">{sectors[site.sector]}</p>
              </Link>
              <div className="flex items-center gap-3 text-sm">
                {site.sector === "usta" && !site.setupCompletedAt && (
                  <Link
                    href={`/siteler/${site.id}/kurulum`}
                    className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 hover:bg-amber-200"
                  >
                    Kurulumu tamamla
                  </Link>
                )}
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                  {status.text}
                </span>
                <a href={url} target="_blank" rel="noreferrer" className="text-slate-600 underline hover:text-slate-900">
                  {url.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
