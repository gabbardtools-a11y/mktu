import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";
import { FaqCasesClient } from "./faq-cases-client";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.faqcases.title", lang),
    description: t("meta.faqcases.desc", lang),
  };
}

export default async function FaqCasesPage() {
  const lang = await getLang();

  return <FaqCasesClient initialLang={lang} />;
}