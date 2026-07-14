import type { Metadata } from "next";
import { ServicesClient } from "./services-client";

export const metadata: Metadata = {
  title: "Все сервисы МКТУ — определение класса, пошлины, поиск",
  description:
    "Все инструменты мкту.рус на одной странице: ИИ-помощник, мастер определения класса, конвертер ОКВЭД→МКТУ, связанные классы, частые кейсы, калькулятор пошлин Роспатента.",
  keywords: [
    "сервисы МКТУ",
    "инструменты МКТУ",
    "определить класс МКТУ",
    "калькулятор пошлин",
    "ИИ МКТУ",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Все сервисы МКТУ — мкту.рус",
    description: "ИИ-помощник, мастер, ОКВЭД→МКТУ, калькулятор пошлин — всё на одной странице.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
