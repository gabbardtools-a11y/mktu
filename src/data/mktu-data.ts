export type MktuClassType = "goods" | "services";

export interface MktuClass {
  id: number;
  name: string;
  shortName: string;
  description: string;
  type: MktuClassType;
  items: string[];
}

import data from "./mktu-data.json";

export const mktuClasses: MktuClass[] = data as MktuClass[];

export const goodsClasses = mktuClasses.filter((c) => c.type === "goods");
export const servicesClasses = mktuClasses.filter((c) => c.type === "services");
