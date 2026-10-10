import type { Metadata } from "next";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { siteMembers, sites, user } from "@/db/schema";
import { formatDate } from "@/lib/subscription";
import { SendPasswordLinkButton } from "./user-actions";

export const metadata: Metadata = { title: "Yönetim · Kullanıcılar", robots: { index: false } };

const roleLabels = { owner: "sahip", editor: "editör" } as const;

export default async function AdminUsersPage() {
  const [users, memberships] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        createdAt: user.createdAt,
        hasPassword: sql<boolean>`exists (select 1 from accounts a where a.user_id = "users"."id" and a.provider_id = 'credential')`,
        lastLogin: sql<string | null>`(select max(s.created_at) from sessions s where s.user_id = "users"."id")`,
      })
      .from(user)
      .orderBy(asc(user.name)),
    db
      .select({ userId: siteMembers.userId, role: siteMembers.role, siteName: sites.name })
      .from(siteMembers)
      .innerJoin(sites, eq(sites.id, siteMembers.siteId)),
  ]);

  return (
    <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {users.map((u) => {
        const userSites = memberships.filter((m) => m.userId === u.id);
        return (
          <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <div className="min-w-0">
              <p className="font-medium">
                {u.name}
                {u.isSuperAdmin && (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Süper admin</span>
                )}
                {!u.hasPassword && (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Davet bekliyor</span>
                )}
              </p>
              <p className="truncate text-slate-500">{u.email}</p>
              {userSites.length > 0 && (
                <p className="text-slate-500">{userSites.map((m) => `${m.siteName} (${roleLabels[m.role]})`).join(", ")}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-slate-400">
                {u.lastLogin ? `Son giriş ${formatDate(new Date(u.lastLogin))}` : `Eklendi ${formatDate(u.createdAt)}`}
              </span>
              <SendPasswordLinkButton userId={u.id} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
