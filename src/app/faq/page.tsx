import type { Metadata } from "next";
import FaqClient from "./faq-client";

export const metadata: Metadata = {
  title: "FAQ — Часто задаваемые вопросы по МКТУ",
  description:
    "Ответы на популярные вопросы о Международной классификации товаров и услуг (МКТУ): как выбрать классы, зачем нужна Ниццкая классификация, как использовать справочник для регистрации товарного знака в Роспатенте.",
  keywords: [
    "МКТУ FAQ",
    "часто задаваемые вопросы МКТУ",
    "как выбрать класс МКТУ",
    "регистрация товарного знака",
    "Роспатент",
    "Ниццкая классификация",
    "МКТУ 13 редакция",
  ],
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ — Часто задаваемые вопросы по МКТУ",
    description:
      "Ответы на популярные вопросы о МКТУ, выборе классов и регистрации товарных знаков.",
    type: "article",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FaqPage() {
  return <FaqClient />;
}
