import { formatDate } from "@/lib/subscription";
import { legalInfo } from "@/content/legal-info";

// Yasal metin sayfalarının tipografisi (Tailwind typography eklentisi kullanılmadığı için elle)
export function LegalDoc({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="flex flex-col gap-4 leading-7 text-slate-700 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-slate-900">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500">Son güncelleme: {formatDate(legalInfo.updatedAt)}</p>
      {children}
    </article>
  );
}
