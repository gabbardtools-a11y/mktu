"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  X,
  LayoutGrid,
  Package,
  Briefcase,
  Trash2,
  Star,
  Sparkles,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiChatDialog } from "@/components/mktu/ai-chat-dialog";

export type FilterType = "all" | "goods" | "services";

interface SearchSectionProps {
  query: string;
  onQueryChange: (q: string) => void;
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  favoritesCount: number;
  cartCount: number;
  onClearFavorites: () => void;
  onClearCart: () => void;
  isInCart: (classId: number) => boolean;
  addToCart: (classId: number) => void;
  isItemSelectedInCart: (classId: number, item: string) => boolean;
  toggleItemInCart: (classId: number, item: string) => void;
}

export function SearchSection({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  favoritesCount,
  cartCount,
  onClearFavorites,
  onClearCart,
}: SearchSectionProps) {
  const router = useRouter();
  const [aiOpen, setAiOpen] = useState(false);

  // Если в URL есть ?q=..., синхронизируем поле при первом монтировании
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q && !query) {
        onQueryChange(q);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterButtons: { key: FilterType; label: string; Icon: typeof Package }[] =
    [
      { key: "all", label: "Список", Icon: List },
      { key: "goods", label: "Товары", Icon: Package },
      { key: "services", label: "Услуги", Icon: Briefcase },
    ];

  const buildPrompt = () => {
    const q = query.trim();
    return q ? `Определить МКТУ: ${q}` : "Определить МКТУ";
  };

  const handleSearch = () => {
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div id="search-section" className="mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-foreground/30 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  handleSearch();
                }
              }}
              placeholder="Поиск по классам и позициям — например: косметика, программное обеспечение, кофе..."
              className="pl-9 pr-9 h-9 text-sm bg-card border-border focus-visible:border-gold/40 focus-visible:ring-gold/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {query ? (
                <button
                  type="button"
                  onClick={() => onQueryChange("")}
                  className="pointer-events-auto text-foreground/40 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-foreground/20">
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded border border-current/30">
                    /
                  </kbd>
                </div>
              )}
            </div>
          </div>

          {/* Найти button — opens search results page */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-md bg-gold text-background hover:bg-gold-dark font-semibold text-sm transition-all flex-shrink-0"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Найти</span>
          </button>

          <motion.button
            type="button"
            onClick={() => setAiOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            title="Поиск с помощью ИИ"
            aria-label="Поиск с помощью ИИ"
            className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-9 sm:px-3 rounded-md bg-gradient-to-br from-blue-500/15 to-emerald-500/15 border border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 transition-all group flex-shrink-0"
          >
            <Sparkles
              className="size-4 group-hover:scale-110 transition-transform"
              strokeWidth={2.2}
            />
            <span className="hidden sm:inline ml-1.5 text-sm font-semibold tracking-wide">
              ИИ
            </span>
          </motion.button>
        </div>
      </div>

      {/* AI chat modal */}
      <AiChatDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        initialPrompt={buildPrompt()}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 mb-6 mt-4 flex-wrap"
      >
        <div className="flex items-center gap-2">
          {filterButtons.map(({ key, label, Icon }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange(key)}
              className={
                filter === key
                  ? "bg-gold text-background hover:bg-gold-dark h-8 px-3 text-xs"
                  : "text-foreground/60 hover:text-foreground hover:bg-muted h-8 px-3 text-xs"
              }
            >
              <Icon className="size-3.5" />
              {label}
            </Button>
          ))}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFavorites}
            disabled={favoritesCount === 0}
            className={`border transition-colors h-8 px-3 text-xs ${
              favoritesCount > 0
                ? "text-gold hover:text-gold-light bg-gold/10 hover:bg-gold/15 border-gold/20 hover:border-gold/30"
                : "text-foreground/30 hover:text-foreground/50 border-transparent hover:border-border"
            }`}
          >
            <Star className="size-3.5 mr-1" />
            Очистить
            {favoritesCount > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-gold/10 text-gold">
                {favoritesCount}
              </span>
            )}
          </Button>
        </motion.div>

        <div className="w-px h-5 bg-border mx-1" />

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            disabled={cartCount === 0}
            className={`border transition-colors h-8 px-3 text-xs ${
              cartCount > 0
                ? "text-red-400 hover:text-red-500 bg-red-500/10 hover:bg-red-500/15 border-red-500/20 hover:border-red-500/30"
                : "text-foreground/30 hover:text-foreground/50 border-transparent hover:border-border"
            }`}
          >
            <Trash2 className="size-3.5 mr-1" />
            Очистить
            {cartCount > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400">
                {cartCount}
              </span>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
