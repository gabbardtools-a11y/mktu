"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Sun,
  Moon,
  MoonStar,
  HelpCircle,
  Grid3x3,
  Calculator,
  Sparkles,
  Compass,
  Link2,
  FileSearch,
  Lightbulb,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { mktuClasses } from "@/data/mktu-data";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { t as tt, tClassName, type Lang, type TranslationKey } from "@/lib/i18n/translations";

interface HeaderProps {
  lang?: Lang;
  favoritesCount: number;
  cartCount: number;
  onOpenFavorites: () => void;
  onOpenCart: () => void;
}

// Конфигурация 4 кнопок тем
const THEME_BUTTONS: {
  theme: Theme;
  icon: typeof Moon;
  key: TranslationKey;
}[] = [
  { theme: "dark", icon: Moon, key: "theme.dark" },
  { theme: "light", icon: Sun, key: "theme.light" },
  { theme: "navy", icon: MoonStar, key: "theme.navy" },
];

export function Header({
  lang: initialLang = "ru",
  favoritesCount,
  cartCount,
  onOpenFavorites,
  onOpenCart,
}: HeaderProps) {
  const { theme, setTheme, mounted } = useTheme();
  const { lang, t, switchLang } = useLanguage(initialLang);
  const router = useRouter();
  const [gridOpen, setGridOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setGridOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    if (gridOpen || servicesOpen) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [gridOpen, servicesOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-gold/10 shadow-lg shadow-foreground/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex flex-col hover:opacity-80 transition-opacity"
          >
            <span className="text-gold font-normal text-base sm:text-lg tracking-wider leading-tight">
              МКТУ.рус
            </span>
            <span className="text-foreground/40 font-normal text-[10px] sm:text-xs sm:ml-0 leading-tight">
              ред. 13 2026
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Кнопка-сетка классов 1-45 */}
            <div className="relative" ref={gridRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGridOpen((v) => !v)}
                className="text-foreground/70 hover:text-gold hover:bg-gold/5"
                title={t("header.allClasses")}
                aria-label={t("header.allClasses")}
                aria-expanded={gridOpen}
              >
                <Grid3x3 className="size-4" />
                <span className="hidden sm:inline ml-1.5">{t("header.classes")}</span>
              </Button>

              <AnimatePresence>
                {gridOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="fixed left-2 right-2 top-16 p-3 rounded-xl border border-border bg-card shadow-xl shadow-foreground/10 z-50"
                  >
                    <div className="text-xs text-foreground/40 mb-2 px-1">
                      {t("header.gridHint")}
                    </div>
                    <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-0.5">
                      {mktuClasses.map((cls) => {
                        const isGoods = cls.type === "goods";
                        return (
                          <button
                            key={cls.id}
                            type="button"
                            onClick={() => {
                              setGridOpen(false);
                              router.push(`/class/${cls.id}`);
                            }}
                            title={tClassName(lang, cls.id)}
                            className={`flex items-center justify-center aspect-square rounded text-sm font-bold transition-all hover:scale-110 ${
                              isGoods
                                ? "bg-gold/10 text-gold/90 hover:bg-gold hover:text-background"
                                : "bg-blue-500/30 text-blue-200 hover:bg-blue-500 hover:text-background"
                            }`}
                          >
                            {cls.id}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border/50 text-[10px] text-foreground/40">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-gold/30" />
                        {t("header.goodsLegend")}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/30" />
                        {t("header.servicesLegend")}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown: Сервисы — неоновая обводка на тёмном фоне */}
            <div className="relative" ref={servicesRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setServicesOpen((v) => !v)}
                className="bg-card text-gold hover:text-gold-light border border-gold shadow-[0_0_6px_rgba(255,210,77,0.4)] hover:shadow-[0_0_10px_rgba(255,210,77,0.7)] font-medium transition-all"
                title={t("header.allServices")}
                aria-expanded={servicesOpen}
              >
                <Sparkles className="size-4 text-gold" strokeWidth={2.5} />
                <span className="hidden sm:inline ml-1.5 font-bold tracking-wide">{t("header.services")}</span>
                <ChevronDown
                  className={`size-3 ml-0.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                />
              </Button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-64 p-2 rounded-xl border border-border bg-card shadow-xl shadow-foreground/10 z-50"
                  >
                    <Link
                      href="/assistant"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <Sparkles className="size-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{t("header.ai")}</div>
                        <div className="text-[11px] text-foreground/50">{t("header.aiDesc")}</div>
                      </div>
                    </Link>
                    <Link
                      href="/wizard"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <Compass className="size-4 text-gold mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{t("header.wizard")}</div>
                        <div className="text-[11px] text-foreground/50">{t("header.wizardDesc")}</div>
                      </div>
                    </Link>
                    <Link
                      href="/okved"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <FileSearch className="size-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">ОКВЭД → МКТУ</div>
                        <div className="text-[11px] text-foreground/50">{t("header.okvedDesc")}</div>
                      </div>
                    </Link>
                    <Link
                      href="/related"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <Link2 className="size-4 text-gold mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{t("header.related")}</div>
                        <div className="text-[11px] text-foreground/50">{t("header.relatedDesc")}</div>
                      </div>
                    </Link>
                    <Link
                      href="/faq-cases"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <Lightbulb className="size-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{t("header.cases")}</div>
                        <div className="text-[11px] text-foreground/50">{t("header.casesDesc")}</div>
                      </div>
                    </Link>
                    <div className="border-t border-border/50 my-1" />
                    <Link
                      href="/calculator"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <Calculator className="size-4 text-gold mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{t("header.fees")}</div>
                        <div className="text-[11px] text-foreground/50">{t("header.feesDesc")}</div>
                      </div>
                    </Link>
                    <a
                      href="https://naytea.ru"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <Search className="size-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{t("header.check")}</div>
                        <div className="text-[11px] text-foreground/50">{t("header.checkDesc")}</div>
                      </div>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Переключатель языков [ RU ][ EN ][ 中 ] — эталон aipat/iznaki */}
            <div
              className="inline-flex items-center overflow-hidden rounded-full border border-border/60"
              title={t("lang.switch")}
            >
              {(["ru", "en", "zh"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => switchLang(l)}
                  className={`px-1.5 sm:px-2 py-1.5 text-[11px] font-bold transition-colors ${
                    lang === l
                      ? l === "ru"
                        ? "bg-blue-600 text-white"
                        : l === "en"
                          ? "bg-emerald-600 text-white"
                          : "bg-red-600 text-white"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                  title={l === "ru" ? "Русский" : l === "en" ? "English" : "中文 — Chinese"}
                >
                  {l === "ru" ? "RU" : l === "en" ? "EN" : "中"}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-foreground/70 hover:text-gold hover:bg-gold/5"
              title="FAQ"
            >
              <Link href="/faq">
                <HelpCircle className="size-4" />
              </Link>
            </Button>

            {/* A+ / A- font size controls */}
            <div className="flex items-center gap-0.5 px-1 py-1 rounded-md bg-muted/40 border border-border/50">
              <button
                type="button"
                onClick={() => {
                  const root = document.documentElement;
                  const current = parseFloat(root.style.fontSize || "16");
                  const next = Math.max(12, current - 1);
                  root.style.fontSize = `${next}px`;
                  localStorage.setItem("mktu-fontsize", String(next));
                }}
                title={t("header.fontDown")}
                className="flex items-center justify-center w-7 h-7 rounded text-foreground/60 hover:text-foreground hover:bg-muted transition-colors text-sm font-bold"
              >
                A−
              </button>
              <button
                type="button"
                onClick={() => {
                  const root = document.documentElement;
                  const current = parseFloat(root.style.fontSize || "16");
                  const next = Math.min(24, current + 1);
                  root.style.fontSize = `${next}px`;
                  localStorage.setItem("mktu-fontsize", String(next));
                }}
                title={t("header.fontUp")}
                className="flex items-center justify-center w-7 h-7 rounded text-foreground/60 hover:text-foreground hover:bg-muted transition-colors text-base font-bold"
              >
                A+
              </button>
            </div>

            {/* 4 отдельных кнопки тем */}
            <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-1 rounded-md bg-muted/40 border border-border/50">
              {THEME_BUTTONS.map(({ theme: t, icon: Icon, key }) => {
                const label = tt(key, lang);
                const isActive = mounted && theme === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    aria-label={`${tt("header.themePrefix", lang)}${label}`}
                    title={label}
                    className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md transition-all ${
                      isActive
                        ? "bg-gold text-background shadow-sm"
                        : "text-foreground/50 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="size-3.5 sm:size-4" />
                  </button>
                );
              })}
            </div>

            <div className="w-px h-6 bg-blue-400/50 mx-1 shadow-[0_0_4px_rgba(96,165,250,0.4)]" />

            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenFavorites}
              className="relative text-foreground/70 hover:text-gold hover:bg-gold/5"
              title={t("header.favorites")}
            >
              <Star className="size-4" />
              {favoritesCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 sm:static sm:ml-1.5 min-w-5 h-5 px-1.5 rounded-full bg-gold text-background text-[10px] font-bold flex items-center justify-center"
                >
                  {favoritesCount}
                </motion.span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenCart}
              className="relative text-foreground/70 hover:text-gold hover:bg-gold/5"
              title={t("header.cart")}
            >
              <ShoppingBag className="size-4" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 sm:static sm:ml-1.5 min-w-5 h-1.5 px-1.5 rounded-full bg-gold text-background text-[10px] font-bold flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
