"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Sun, Moon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  favoritesCount: number;
  cartCount: number;
  onOpenFavorites: () => void;
  onOpenCart: () => void;
}

export function Header({
  favoritesCount,
  cartCount,
  onOpenFavorites,
  onOpenCart,
}: HeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme();

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

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-foreground/70 hover:text-gold hover:bg-gold/5"
              title="Сменить тему"
            >
              {mounted && theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>

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
