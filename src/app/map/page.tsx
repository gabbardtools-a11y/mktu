import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";
import { MapClient } from "./map-client";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.map.title", lang),
    description: t("meta.map.desc", lang),
  };
}

export default async function MapPage() {
  const lang = await getLang();

  return <MapClient initialLang={lang} />;
}