import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mktuClasses, type MktuClass } from "@/data/mktu-data";
import { getFullClassById } from "@/data/mktu-data-full";
import { ClassDetailClient } from "./class-detail-client";

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
      title: "Класс не найден",
      robots: { index: false, follow: false },
    };
  }

  const isGoods = cls.type === "goods";
  const typeLabel = isGoods ? "товары" : "услуги";
  const title = `Класс ${cls.id} МКТУ — ${cls.name}`;
  const description = `${cls.name} — ${typeLabel} (класс ${cls.id} МКТУ 13-й редакции 2026). ${cls.description} Полный список из ${cls.items.length} позиций для регистрации товарного знака в Роспатенте.`;

  // Ключевые слова: ID + название + первые 8 значимых позиций
  const itemKeywords = cls.items.slice(0, 8).join(", ");
  const keywords = [
    `МКТУ класс ${cls.id}`,
    `класс ${cls.id} МКТУ`,
    cls.name,
    `${typeLabel} класс ${cls.id}`,
    "товарный знак",
    "регистрация товарного знака",
    "Роспатент",
    "Ниццкая классификация",
    "МКТУ 2026",
    "МКТУ 13 редакция",
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
      locale: "ru_RU",
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
      "article:section": isGoods ? "Товары" : "Услуги",
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

  // Передаём full class (с items[]) в client component.
  // page.tsx — server component, mktu-data-full.ts не попадёт в браузерный бандл.
  return <ClassDetailClient cls={cls} />;
}
