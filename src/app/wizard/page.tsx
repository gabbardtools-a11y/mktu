import type { Metadata } from "next";
import { WizardClient } from "./wizard-client";

export const metadata: Metadata = {
  title: "Мастер определения класса МКТУ",
  description:
    "Пошаговый опросник поможет определить подходящие классы МКТУ для регистрации товарного знака. Ответьте на 4 вопроса — получите список классов с пояснениями.",
  keywords: [
    "определить класс МКТУ",
    "мастер МКТУ",
    "какой класс МКТУ",
    "подобрать классы МКТУ",
    "опросник МКТУ",
  ],
  alternates: { canonical: "/wizard" },
  openGraph: {
    title: "Мастер определения класса МКТУ — мкту.рус",
    description: "Пошаговый опросник для определения классов МКТУ за 4 вопроса.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function WizardPage() {
  return <WizardClient />;
}
