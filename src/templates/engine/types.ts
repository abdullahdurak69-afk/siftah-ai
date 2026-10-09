import type { Fields } from "./fields";

export type SectionDef = {
  key: string;
  title: string;
  description?: string;
  // settings: sitede kendi bloğu olmayan, diğer bölümlerin kullandığı bilgiler (ör. işletme bilgileri)
  kind: "settings" | "block";
  // Kapatılabilir mi? Ayarlar ve zorunlu bloklar kapatılamaz.
  optional: boolean;
  // Menüde gösterilecek kısa ad; yoksa bölüm menüye girmez
  navLabel?: string;
  fields: Fields;
};

export type SectionContent = Record<string, unknown>;

export type SectionRow = {
  key: string;
  position: number;
  enabled: boolean;
  content: SectionContent;
};
