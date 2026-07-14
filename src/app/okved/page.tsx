import type { Metadata } from "next";
import { OkvedClient } from "./okved-client";

export const metadata: Metadata = {
  title: "ОКВЭД → МКТУ: соответствие кодов",
  description:
    "Конвертер ОКВЭД в классы МКТУ. Введите ваш код ОКВЭД — получите подходящие классы МКТУ для регистрации товарного знака. Таблица соответствий для популярных видов деятельности.",
  keywords: [
    "ОКВЭД МКТУ",
    "соответствие ОКВЭД и МКТУ",
    "конвертер ОКВЭД в МКТУ",
    "какой класс МКТУ по ОКВЭД",
    "таблица соответствий ОКВЭД МКТУ",
  ],
  alternates: { canonical: "/okved" },
  openGraph: {
    title: "ОКВЭД → МКТУ: конвертер кодов — мкту.рус",
    description: "Введите код ОКВЭД — получите подходящие классы МКТУ.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function OkvedPage() {
  return <OkvedClient />;
}
