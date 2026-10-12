import type { Metadata } from "next";
import { HomeClient } from "./home-client";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.home.title", lang),
    description: t("meta.home.desc", lang),
  };
}

export default async function Home() {
  const lang = await getLang();

  return <HomeClient initialLang={lang} />;
}
