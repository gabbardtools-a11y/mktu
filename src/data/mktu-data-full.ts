// ⚠️ SERVER-SIDE ONLY!
// Этот файл импортирует полный mktu-data.json (1.4 MB).
// Использовать ТОЛЬКО в server components, getStaticProps, API routes.
// НЕ импортировать в client components ("use client") — иначе 1.4 MB попадёт в браузерный бандл.

import type { MktuClass } from "./mktu-data";
import fullData from "./mktu-data.json";

export const mktuClassesFull: MktuClass[] = fullData as MktuClass[];

export function getFullClassById(id: number): MktuClass | null {
  return mktuClassesFull.find((c) => c.id === id) ?? null;
}
