"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Sun,
  Moon,
  MoonStar,
  SunMoon,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, type Theme } from "@/hooks/use-theme";

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
                  className="absolute -top-1 -right-1 sm:static sm:ml-1.5 min-w-5 h-5 px-1.5 rounded-full bg-gold text-background text-[10px] font-bold flex items-center justify-center"
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
