import type { Metadata } from "next";
import { AssistantClient } from "./assistant-client";

export const metadata: Metadata = {
  title: "ИИ-помощник по классам МКТУ",
  description:
    "Бесплатный ИИ-помощник определит подходящие классы МКТУ для вашего товарного знака. Объяснит почему именно эти классы, подскажет дополнительные и даст практический совет.",
  keywords: [
    "ИИ МКТУ",
    "определить класс МКТУ",
    "какой класс МКТУ выбрать",
    "помощник МКТУ",
    "AI классификация товарных знаков",
  ],
  alternates: { canonical: "/assistant" },
  openGraph: {
    title: "ИИ-помощник по классам МКТУ — мкту.рус",
    description:
      "Бесплатный ИИ-помощник определит подходящие классы МКТУ и объяснит почему именно они.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function AssistantPage() {
  return <AssistantClient />;
}
