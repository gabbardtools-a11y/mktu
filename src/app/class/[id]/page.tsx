import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mktuClasses } from "@/data/mktu-data";
import { getFullClassById } from "@/data/mktu-data-full";
import { ClassDetailClient } from "./class-detail-client";
import { getLang } from "@/lib/i18n/server";
import {
  t,
  tClassName,
  tClassDesc,
  tItems,
  DEFAULT_LANG,
  type Lang,
} from "@/lib/i18n/translations";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mktu.ru";

// Pre-render all 45 class pages at build time → better SEO + faster FCP
export function generateStaticParams() {
  return mktuClasses.map((cls) => ({ id: String(cls.id) }));
}

// Next.js 16: params is a Promise in server components
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const classId = Number(id);
  const cls = getFullClassById(classId);

  if (!cls) {
    return {
      title: t("cd.notFound", DEFAULT_LANG),
      robots: { index: false, follow: false },
    };
  }

  const lang = await getLang();
  const isGoods = cls.type === "goods";
  const typeLabel = t(isGoods ? "common.goods" : "common.services", lang);
  const title = `${tClassName(lang, cls.id)} — МКТУ / Nice Classification`;
  const description = `${tClassName(lang, cls.id)} — ${typeLabel}. ${tClassDesc(lang, cls.id, cls.description)} ${t("meta.class.desc", lang)}`;

  // Ключевые слова: ID + название + первые 8 значимых позиций
  const itemKeywords = cls.items.slice(0, 8).join(", ");
  const keywords = [
    `МКТУ класс ${cls.id}`,
    `класс ${cls.id} МКТУ`,
    `Nice class ${cls.id}`,
    `尼斯分类 第${cls.id}类`,
    `${typeLabel} класс ${cls.id}`,
    "товарный знак",
    "trademark",
    "Роспатент",
    "Ниццкая классификация",
    "Nice Classification",
    "МКТУ 2026",
  ];

  const url = `${BASE_URL}/class/${cls.id}`;

  return {
    title,
    description,
    keywords: [...keywords, itemKeywords],
    alternates: {
      canonical: `/class/${cls.id}`,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "МКТУ",
      locale: lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "zh_CN",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    other: {
      "article:section": typeLabel,
      "article:tag": `МКТУ, класс ${cls.id}`,
    },
  };
}

export default async function ClassDetailPage({ params }: PageProps) {
  const { id } = await params;
  const classId = Number(id);
  const cls = getFullClassById(classId);

  if (!cls) {
    notFound();
  }

  const lang = await getLang();

  // Передаём full class (с items[]) и язык в client component.
  // page.tsx — server component, mktu-data-full.ts не попадёт в браузерный бандл.
  return <ClassDetailClient cls={cls} initialLang={lang as Lang} />;
}
