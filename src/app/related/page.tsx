import type { Metadata } from "next";
import { RelatedClient } from "./related-client";

export const metadata: Metadata = {
  title: "Связанные классы МКТУ: что ещё нужно",
  description:
    "Кросс-ссылки между классами МКТУ. Если выбрали класс — посмотрите какие классы часто идут вместе. Помогает собрать полную заявку на регистрацию товарного знака.",
  keywords: [
    "связанные классы МКТУ",
    "соседние классы МКТУ",
    "дополнительные классы",
    "какие классы ещё нужны",
    "кросс-ссылки МКТУ",
  ],
  alternates: { canonical: "/related" },
  openGraph: {
    title: "Связанные классы МКТУ — мкту.рус",
    description: "Если выбрали класс — посмотрите какие классы часто идут вместе.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RelatedPage() {
  return <RelatedClient />;
}
