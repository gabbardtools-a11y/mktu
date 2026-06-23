"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  X,
  LayoutGrid,
  Package,
  Briefcase,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiChatDialog } from "@/components/mktu/ai-chat-dialog";
import { SearchResultsDialog } from "@/components/mktu/search-results-dialog";

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
  onOpenClass?: (classId: number) => void;
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
  onOpenClass,
  isInCart,
  addToCart,
  isItemSelectedInCart,
  toggleItemInCart,
}: SearchSectionProps) {
  const [aiOpen, setAiOpen] = useState(false);
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  const filterButtons: { key: FilterType; label: string; Icon: typeof Package }[] =
    [
      { key: "all", label: "Кнопки", Icon: LayoutGrid },
      { key: "goods", label: "Товары", Icon: Package },
      { key: "services", label: "Услуги", Icon: Briefcase },
    ];

  const buildPrompt = () => {
    const q = query.trim();
    return q ? `Определить МКТУ: ${q}` : "Определить МКТУ";
  };

  const handleSearch = () => {
    if (query.trim()) {
      setSearchResultsOpen(true);
    }
  };

  return (
    <div id="search-section" className="mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/30 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  handleSearch();
                }
              }}
              placeholder="Поиск по классам и позициям — например: косметика, программное обеспечение, кофе..."
              className="pl-12 pr-12 h-14 text-base bg-card border-border focus-visible:border-gold/40 focus-visible:ring-gold/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {query ? (
                <button
                  onClick={() => onQueryChange("")}
                  className="pointer-events-auto text-foreground/40 hover:text-foreground"
                >
                  <X className="size-5" />
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

          {/* Найти button — opens search results dialog */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 h-14 px-6 rounded-md bg-gold text-background hover:bg-gold-dark font-semibold text-sm transition-all flex-shrink-0"
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
            className="flex items-center justify-center w-14 h-14 sm:w-auto sm:h-14 sm:px-4 rounded-md bg-gradient-to-br from-blue-500/15 to-emerald-500/15 border border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 transition-all group flex-shrink-0"
          >
            <Sparkles className="size-5 sm:size-4 group-hover:scale-110 transition-transform" strokeWidth={2.2} />
            <span className="hidden sm:inline ml-2 text-sm font-semibold tracking-wide">
              ИИ
            </span>
          </motion.button>
        </div>
      </div>

      {/* Search results dialog */}
      <SearchResultsDialog
        open={searchResultsOpen}
        onOpenChange={setSearchResultsOpen}
        query={query}
        isInCart={isInCart}
        addToCart={addToCart}
        isItemSelectedInCart={isItemSelectedInCart}
        toggleItemInCart={toggleItemInCart}
      />

      {/* AI chat modal */}
      <AiChatDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        initialPrompt={buildPrompt()}
        onOpenClass={onOpenClass}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 mb-8 mt-6 flex-wrap"
      >
        <div className="flex items-center gap-2">
          {filterButtons.map(({ key, label, Icon }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "ghost"}
              size="lg"
              onClick={() => onFilterChange(key)}
              className={
                filter === key
                  ? "bg-gold text-background hover:bg-gold-dark"
                  : "text-foreground/60 hover:text-foreground hover:bg-muted"
              }
            >
              <Icon className="size-4" />
              {label}
            </Button>
          ))}
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="lg"
            onClick={onClearFavorites}
            disabled={favoritesCount === 0}
            className={`border transition-colors ${
              favoritesCount > 0
                ? "text-yellow-400 hover:text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/15 border-yellow-500/20 hover:border-yellow-500/30"
                : "text-foreground/30 hover:text-foreground/50 border-transparent hover:border-border"
            }`}
          >
            <Trash2 className="size-4 mr-1.5" />
            Очистить
            {favoritesCount > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">
                {favoritesCount}
              </span>
            )}
          </Button>
        </motion.div>

        <div className="w-px h-6 bg-border mx-1" />

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="lg"
            onClick={onClearCart}
            disabled={cartCount === 0}
            className={`border transition-colors ${
              cartCount > 0
                ? "text-red-400 hover:text-red-500 bg-red-500/10 hover:bg-red-500/15 border-red-500/20 hover:border-red-500/30"
                : "text-foreground/30 hover:text-foreground/50 border-transparent hover:border-border"
            }`}
          >
            <Trash2 className="size-4 mr-1.5" />
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
