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
  SunMoon,
  HelpCircle,
  Grid3x3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { mktuClasses } from "@/data/mktu-data";

interface HeaderProps {
  favoritesCount: number;
  cartCount: number;
  onOpenFavorites: () => void;
  onOpenCart: () => void;
}

// Конфигурация 4 кнопок тем
const THEME_BUTTONS: {
  theme: Theme;
  icon: typeof Moon;
  label: string;
}[] = [
  { theme: "dark", icon: Moon, label: "Тёмная" },
  { theme: "light", icon: Sun, label: "Светлая" },
  { theme: "grayscale", icon: MoonStar, label: "Серая" },
  { theme: "grayscale-light", icon: SunMoon, label: "Светло-серая" },
];

export function Header({
  favoritesCount,
  cartCount,
  onOpenFavorites,
  onOpenCart,
}: HeaderProps) {
  const { theme, setTheme, mounted } = useTheme();
  const router = useRouter();
  const [gridOpen, setGridOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setGridOpen(false);
      }
    };
    if (gridOpen) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [gridOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-gold/10 shadow-lg shadow-foreground/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-gold font-bold text-base sm:text-lg tracking-wider">
              МКТУ.рус
              <span className="text-foreground/40 font-normal text-xs sm:text-sm ml-1.5">
                ред. 13 2026
              </span>
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
                title="Все классы 1–45"
                aria-label="Все классы 1–45"
                aria-expanded={gridOpen}
              >
                <Grid3x3 className="size-4" />
                <span className="hidden sm:inline ml-1.5">Классы</span>
              </Button>

              <AnimatePresence>
                {gridOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 p-3 rounded-xl border border-border bg-card shadow-xl shadow-foreground/10 z-50"
                    style={{ width: "min(90vw, 420px)" }}
                  >
                    <div className="text-xs text-foreground/40 mb-2 px-1">
                      Все классы МКТУ — нажмите для перехода
                    </div>
                    <div className="grid grid-cols-9 gap-1">
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
                            title={`Класс ${cls.id} — ${cls.name}`}
                            className={`flex items-center justify-center aspect-square rounded-md text-xs font-bold transition-all hover:scale-110 ${
                              isGoods
                                ? "bg-gold/10 text-gold hover:bg-gold hover:text-background"
                                : "bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-background"
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
                        Товары (1–34)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/30" />
                        Услуги (35–45)
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                <span className="hidden sm:inline ml-1.5">FAQ</span>
              </Link>
            </Button>

            {/* 4 отдельных кнопки тем */}
            <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-1 rounded-md bg-muted/40 border border-border/50">
              {THEME_BUTTONS.map(({ theme: t, icon: Icon, label }) => {
                const isActive = mounted && theme === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    aria-label={`Тема: ${label}`}
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

            <div className="w-px h-6 bg-border mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenFavorites}
              className="relative text-foreground/70 hover:text-gold hover:bg-gold/5"
              title="Избранное"
            >
              <Star className="size-4" />
              <span className="hidden sm:inline ml-1.5">Избранное</span>
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
              title="Корзина"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline ml-1.5">Корзина</span>
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
