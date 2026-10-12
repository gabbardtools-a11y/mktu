import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";
import { WizardClient } from "./wizard-client";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("meta.wizard.title", lang),
    description: t("meta.wizard.desc", lang),
  };
}

export default async function WizardPage() {
  const lang = await getLang();

  return <WizardClient initialLang={lang} />;
}