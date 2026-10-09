import { notFound } from "next/navigation";
import { getEditableSite } from "@/lib/dal";
import { emptyObject } from "@/templates/engine/fields";
import { getSectionDef } from "@/templates/registry";
import { SectionForm } from "@/components/editor/section-form";
import { SectionToggle } from "./section-toggle";

export const instant = false;

export default async function SectionPage({ params }: PageProps<"/panel/siteler/[id]/bolum/[key]">) {
  const { id, key } = await params;
  const { site, sections } = await getEditableSite(id);
  const def = getSectionDef(site.sector, key);
  const row = sections.find((s) => s.key === key);
  if (!def || !row) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{def.title}</h2>
          {def.description && <p className="mt-1 text-slate-600">{def.description}</p>}
        </div>
        {def.optional && <SectionToggle siteId={site.id} sectionKey={key} enabled={row.enabled} />}
      </div>

      {!row.enabled && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Bu bölüm şu an sitede gizli. İçeriği düzenleyip &quot;Sitede göster&quot; ile açabilirsiniz.
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {/* key: başka bir bölüme geçildiğinde form durumu sıfırlansın. Şablona sonradan eklenen alanlar boş değerle tamamlanır. */}
        <SectionForm key={key} siteId={site.id} sectionKey={key} fields={def.fields} initial={{ ...emptyObject(def.fields), ...row.content }} />
      </div>
    </div>
  );
}
