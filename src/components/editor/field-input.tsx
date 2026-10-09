"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import { emptyObject, type FieldDef, type Fields, type ImageValue } from "@/templates/engine/fields";
import { icons, SectionIcon } from "@/templates/icons";
import { GalleryInput, ImageInput } from "./image-input";

type Errors = Record<string, string>;

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

// Bir alan grubunu (bölüm ya da liste öğesi) çizer. path, hata eşleştirmesi için alanın tam yoludur.
export function FieldGroup({
  fields,
  value,
  onChange,
  errors,
  path = "",
}: {
  fields: Fields;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  errors: Errors;
  path?: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      {Object.entries(fields).map(([key, field]) => (
        <FieldInput
          key={key}
          field={field}
          value={value[key]}
          onChange={(v) => onChange({ ...value, [key]: v })}
          errors={errors}
          path={path ? `${path}.${key}` : key}
        />
      ))}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  errors,
  path,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  errors: Errors;
  path: string;
}) {
  const error = errors[path];

  if (field.type === "list") {
    return (
      <ListField
        field={field}
        items={(value as Record<string, unknown>[]) ?? []}
        onChange={onChange}
        errors={errors}
        path={path}
      />
    );
  }

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          className={`${inputClass} min-h-24`}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          maxLength={field.max}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "number":
      control = (
        <input
          type="number"
          inputMode="decimal"
          className={inputClass}
          value={value === null || value === undefined ? "" : String(value)}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => {
            const raw = e.target.value.replace(",", ".");
            onChange(raw === "" ? null : Number(raw));
          }}
        />
      );
      break;
    case "tags":
      control = <TagInput value={(value as string[]) ?? []} onChange={onChange} placeholder={field.placeholder} />;
      break;
    case "icon":
      control = <IconPicker value={(value as string) ?? ""} onChange={onChange} />;
      break;
    case "image":
      control = <ImageInput value={(value as ImageValue | null) ?? null} onChange={onChange} aspect={field.aspect} />;
      break;
    case "images":
      control = <GalleryInput value={(value as ImageValue[]) ?? []} onChange={onChange} max={field.max} />;
      break;
    default:
      control = (
        <input
          type={field.type === "phone" ? "tel" : field.type === "url" ? "url" : "text"}
          className={inputClass}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          maxLength={"max" in field ? field.max : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }

  const required = "required" in field && field.required;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">
        {field.label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {control}
      {error ? (
        <span className="text-sm text-red-600">{error}</span>
      ) : field.hint ? (
        <span className="text-sm text-slate-500">{field.hint}</span>
      ) : null}
    </div>
  );
}

function ListField({
  field,
  items,
  onChange,
  errors,
  path,
}: {
  field: Extract<FieldDef, { type: "list" }>;
  items: Record<string, unknown>[];
  onChange: (v: unknown) => void;
  errors: Errors;
  path: string;
}) {
  // Yeni eklenen öğe açık gelir; diğerleri kapalı başlar ki uzun listeler okunabilir kalsın
  const [open, setOpen] = useState<number | null>(null);
  const max = field.max ?? 30;

  function move(index: number, delta: number) {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
    setOpen(index + delta);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700">{field.label}</span>
        <span className="text-xs text-slate-500">
          {items.length} / {max}
        </span>
      </div>
      {errors[path] && <span className="text-sm text-red-600">{errors[path]}</span>}

      <ul className="flex flex-col gap-2">
        {items.map((item, index) => {
          const itemPath = `${path}.${index}`;
          const hasError = Object.keys(errors).some((k) => k.startsWith(`${itemPath}.`));
          const isOpen = open === index || hasError;
          const summary = field.summaryField ? String(item[field.summaryField] ?? "") : "";
          return (
            <li key={index} className={`rounded-lg border bg-white ${hasError ? "border-red-300" : "border-slate-200"}`}>
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  {"ikon" in item && <SectionIcon name={String(item.ikon)} className="size-4 shrink-0 text-slate-500" />}
                  <span className="truncate font-medium">
                    {summary || <span className="text-slate-400">Yeni {field.itemLabel.toLocaleLowerCase("tr")}</span>}
                  </span>
                </button>
                <IconButton label="Yukarı taşı" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ChevronUp className="size-4" />
                </IconButton>
                <IconButton label="Aşağı taşı" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                  <ChevronDown className="size-4" />
                </IconButton>
                <IconButton
                  label="Sil"
                  onClick={() => {
                    onChange(items.filter((_, i) => i !== index));
                    setOpen(null);
                  }}
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </div>
              {isOpen && (
                <div className="border-t border-slate-100 p-3">
                  <FieldGroup
                    fields={field.fields}
                    value={item}
                    onChange={(next) => onChange(items.map((it, i) => (i === index ? next : it)))}
                    errors={errors}
                    path={itemPath}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {items.length < max && (
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900"
          onClick={() => {
            onChange([...items, emptyObject(field.fields)]);
            setOpen(items.length);
          }}
        >
          <Plus className="size-4" /> {field.itemLabel} ekle
        </button>
      )}
    </div>
  );
}

function IconButton({
  label,
  children,
  ...props
}: { label: string; children: React.ReactNode } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent"
      {...props}
    >
      {children}
    </button>
  );
}

function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    // Virgülle ayrılmış birden fazla öğe tek seferde eklenebilir
    const parts = draft
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p && !value.includes(p));
    if (parts.length) onChange([...value, ...parts]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li key={tag} className="flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-3 pr-1.5 text-sm">
              {tag}
              <button
                type="button"
                aria-label={`${tag} sil`}
                className="rounded-full p-0.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                onClick={() => onChange(value.filter((t) => t !== tag))}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={draft}
          placeholder={placeholder ? `Örn. ${placeholder}` : undefined}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-medium hover:bg-slate-50"
        >
          Ekle
        </button>
      </div>
    </div>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
      {Object.entries(icons).map(([key, { label, Icon }]) => (
        <button
          key={key}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={`flex aspect-square items-center justify-center rounded-lg border ${
            value === key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Icon className="size-5" />
        </button>
      ))}
    </div>
  );
}
