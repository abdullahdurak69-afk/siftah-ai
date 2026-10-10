import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canManage, getEditableSite } from "@/lib/dal";
import { listSiteMembers } from "@/lib/invites";
import { InviteForm, MemberActions } from "./member-forms";

export const metadata: Metadata = { title: "Kullanıcılar", robots: { index: false } };
export const instant = false;

const roleLabels = { owner: "Site sahibi", editor: "Editör" } as const;

export default async function MembersPage({ params }: PageProps<"/panel/siteler/[id]/kullanicilar">) {
  const { id } = await params;
  const { site, role } = await getEditableSite(id);
  if (!canManage(role)) notFound();
  const members = await listSiteMembers(site.id);
  const isAdmin = role === "admin";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Kullanıcılar</h2>
        <p className="mt-1 text-slate-600">
          Siteyi yönetebilen kişiler. Editörler içerik ve fotoğrafları düzenleyebilir; domain, kullanıcılar ve abonelik
          bilgilerini göremez.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {members.length === 0 ? (
          <p className="p-5 text-slate-600">
            {isAdmin
              ? "Bu siteyi henüz sadece siz yönetiyorsunuz. Müşteriyi site sahibi olarak davet edebilirsiniz."
              : "Henüz kimse eklenmedi."}
          </p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {members.map((m) => (
              <li key={m.userId} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{m.name}</p>
                  <p className="truncate text-sm text-slate-500">{m.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {m.pending && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Davet bekliyor
                    </span>
                  )}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {roleLabels[m.role]}
                  </span>
                  <MemberActions
                    siteId={site.id}
                    userId={m.userId}
                    pending={m.pending}
                    canRemove={isAdmin || m.role === "editor"}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold">Kullanıcı davet et</h3>
        <p className="mt-1 text-sm text-slate-600">
          Davet edilen kişiye şifresini belirleyeceği bir bağlantı e-postayla gönderilir (7 gün geçerli).
        </p>
        <div className="mt-4">
          <InviteForm siteId={site.id} allowOwner={isAdmin} />
        </div>
      </section>
    </div>
  );
}
