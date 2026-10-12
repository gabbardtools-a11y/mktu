import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";
import FaqClient from "./faq-client";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.faq.title", lang),
    description: t("meta.faq.desc", lang),
  };
}

export default async function FaqPage() {
  const lang = await getLang();

  return <FaqClient initialLang={lang} />;
}