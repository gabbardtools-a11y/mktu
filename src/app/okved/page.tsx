import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";
import { OkvedClient } from "./okved-client";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.okved.title", lang),
    description: t("meta.okved.desc", lang),
  };
}

export default async function OkvedPage() {
  const lang = await getLang();

  return <OkvedClient initialLang={lang} />;
}