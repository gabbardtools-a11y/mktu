import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";
import { AssistantClient } from "./assistant-client";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.assistant.title", lang),
    description: t("meta.assistant.desc", lang),
  };
}

export default async function AssistantPage() {
  const lang = await getLang();

  return <AssistantClient initialLang={lang} />;
}