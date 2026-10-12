"use client";

import { BookOpen } from "lucide-react";
import { t, type Lang } from "@/lib/i18n/translations";

export function Footer({ lang = "ru" }: { lang?: Lang }) {
  return (
    <footer className="mt-auto border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold/10">
                <BookOpen className="size-4 text-gold" />
              </div>
              <span className="text-gold font-bold tracking-wider">
                МКТУ-13 <span className="text-foreground/40">2026</span>
              </span>
            </div>
            <p className="text-foreground/50 text-sm leading-relaxed">
              {t("footer.aboutText", lang)}
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">{t("footer.aboutTitle", lang)}</h3>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li>{t("footer.f1", lang)}</li>
              <li>{t("footer.f2", lang)}</li>
              <li>{t("footer.f3", lang)}</li>
              <li>{t("footer.f4", lang)}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">{t("footer.editions", lang)}</h3>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                {t("footer.ed13", lang)}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                {t("footer.ed12", lang)}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                {t("footer.ed11", lang)}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                {t("footer.ed10", lang)}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-center">
          <p className="text-foreground/40 text-xs">
            {t("footer.copyright", lang)}
          </p>
          <p className="text-foreground/30 text-xs mt-1">
            {t("footer.disclaimer", lang)}
          </p>
        </div>
      </div>
    </footer>
  );
}
