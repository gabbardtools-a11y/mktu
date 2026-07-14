import type { Metadata } from "next";
import { FaqCasesClient } from "./faq-cases-client";

export const metadata: Metadata = {
  title: "Частые кейсы: классы МКТУ для популярных бизнесов",
  description:
    "Готовые решения: какой класс МКТУ для интернет-магазина, IT-стартапа, кофейни, производства одежды. С пояснениями и типичными ошибками.",
  keywords: [
    "какой класс МКТУ для",
    "класс МКТУ интернет-магазин",
    "класс МКТУ IT-стартап",
    "класс МКТУ кофейня",
    "класс МКТУ производство",
    "частые вопросы МКТУ",
  ],
  alternates: { canonical: "/faq-cases" },
  openGraph: {
    title: "Частые кейсы МКТУ — мкту.рус",
    description: "Готовые ответы: классы МКТУ для интернет-магазина, IT, общепита, производства.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function FaqCasesPage() {
  return <FaqCasesClient />;
}
