import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";
import { RelatedClient } from "./related-client";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.related.title", lang),
    description: t("meta.related.desc", lang),
  };
}

export default async function RelatedPage() {
  const lang = await getLang();

  return <RelatedClient initialLang={lang} />;
}