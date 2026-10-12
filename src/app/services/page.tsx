import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";
import { ServicesClient } from "./services-client";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.services.title", lang),
    description: t("meta.services.desc", lang),
  };
}

export default async function ServicesPage() {
  const lang = await getLang();

  return <ServicesClient initialLang={lang} />;
}