import type { Metadata } from "next";
import SearchClient from "./search-client";
import { mktuClassesFull } from "@/data/mktu-data-full";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.search.title", lang),
    description: t("meta.search.desc", lang),
    keywords: [
      "поиск МКТУ",
      "найти класс МКТУ",
      "Nice class search",
      "尼斯分类 搜索",
      "регистрация товарного знака классы",
    ],
    alternates: {
      canonical: "/search",
    },
    openGraph: {
      title: t("meta.search.title", lang),
      description: t("meta.search.desc", lang),
      type: "website",
      locale: lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "zh_CN",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SearchPage() {
  const lang = await getLang();
  // Передаём full data (с items[]) в client component.
  // page.tsx — server component, mktu-data-full.ts не попадёт в браузерный бандл.
  return <SearchClient classes={mktuClassesFull} initialLang={lang} />;
}
