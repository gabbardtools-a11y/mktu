export type MktuClassType = "goods" | "services";

/** Полный класс МКТУ со всеми позициями — только для server-side (mktu-data-full.ts). */
export interface MktuClass {
  id: number;
  name: string;
  shortName: string;
  description: string;
  type: MktuClassType;
  items: string[];
  itemsOfficial?: string[];
}

/** Компактный класс без позиций — для client-side (главная, header, карты). */
export interface MktuClassCompact {
  id: number;
  name: string;
  shortName: string;
  description: string;
  type: MktuClassType;
  itemsCount: number;
}

// ─────────────────── Compact данные (client-side, ~24 KB) ───────────────────
import compactData from "./mktu-classes-compact.json";
export const mktuClasses: MktuClassCompact[] = compactData as MktuClassCompact[];

export const goodsClasses = mktuClasses.filter((c) => c.type === "goods");
export const servicesClasses = mktuClasses.filter((c) => c.type === "services");

// Полные данные (с items[]) — импортировать из "@/data/mktu-data-full"
// ТОЛЬКО в server components / getStaticProps / API routes.
