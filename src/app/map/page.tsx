import type { Metadata } from "next";
import { MapClient } from "./map-client";

export const metadata: Metadata = {
  title: "Визуальная карта классов МКТУ — дерево категорий",
  description:
    "Все 45 классов МКТУ в виде интерактивного дерева по категориям: химия, техника, одежда, еда, услуги. Для тех, кто мыслит визуально. Кликните на класс — откроется подробная страница.",
  keywords: [
    "карта классов МКТУ",
    "дерево МКТУ",
    "категории МКТУ",
    "визуальный справочник МКТУ",
    "группы классов МКТУ",
  ],
  alternates: { canonical: "/map" },
  openGraph: {
    title: "Визуальная карта классов МКТУ — мкту.рус",
    description: "Все 45 классов в виде дерева по 13 категориям.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function MapPage() {
  return <MapClient />;
}
