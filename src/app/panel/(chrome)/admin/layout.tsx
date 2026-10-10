import { requireSuperAdmin } from "@/lib/dal";
import { AdminNav } from "./admin-nav";

export const instant = false;

export default async function AdminLayout({ children }: LayoutProps<"/panel/admin">) {
  await requireSuperAdmin();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Yönetim</h1>
        <AdminNav />
      </div>
      {children}
    </div>
  );
}
