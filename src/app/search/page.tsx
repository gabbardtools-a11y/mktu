import type { Metadata } from "next";
import SearchClient from "./search-client";
import { mktuClassesFull } from "@/data/mktu-data-full";

export const metadata: Metadata = {
  title: "Поиск по классам МКТУ",
  description:
    "Поиск по всем 45 классам Международной классификации товаров и услуг (МКТУ 13-я редакция 2026). Найдите подходящие классы для регистрации товарного знака по ключевым словам: косметика, программное обеспечение, кофе и др.",
  keywords: [
    "поиск МКТУ",
    "найти класс МКТУ",
    "поиск по классам товаров",
    "поиск по классам услуг",
    "МКТУ поиск",
    "классификация товаров поиск",
    "регистрация товарного знака классы",
  ],
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Поиск по классам МКТУ",
    description:
      "Поиск по всем 45 классам МКТУ 13-й редакции 2026. Найдите подходящие классы для регистрации товарного знака.",
    type: "website",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SearchPage() {
  // Передаём full data (с items[]) в client component.
  // page.tsx — server component, mktu-data-full.ts не попадёт в браузерный бандл.
  return <SearchClient classes={mktuClassesFull} />;
}
