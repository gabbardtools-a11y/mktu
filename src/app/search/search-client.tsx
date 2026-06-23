"use client";

import { useMemo, useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, X, Check, ChevronDown, ChevronUp, ArrowLeft, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mktuClasses } from "@/data/mktu-data";
import { useFavoritesCart } from "@/components/mktu/favorites-cart-context";
import { AiChatDialog } from "@/components/mktu/ai-chat-dialog";

interface ClassSearchResult {
  classId: number;
  className: string;
  classType: "goods" | "services";
  matchedItems: string[];
}

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [expandedClasses, setExpandedClasses] = useState<Set<number>>(new Set());
  const [aiOpen, setAiOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    isInCart,
    addToCart,
    isItemSelectedInCart,
    toggleItemInCart,
  } = useFavoritesCart();

  // Sync URL when user types (replaceState — без перерендера)
  useEffect(() => {
    const q = query.trim();
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
  }, [query]);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo<ClassSearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matched: ClassSearchResult[] = [];

    for (const cls of mktuClasses) {
      const nameMatch = cls.name.toLowerCase().includes(q);
      const descMatch = cls.description.toLowerCase().includes(q);
      const matchedItems = cls.items.filter((item) =>
        item.toLowerCase().includes(q),
      );

      if (nameMatch || descMatch || matchedItems.length > 0) {
        const itemsToShow =
          matchedItems.length > 0 ? matchedItems : cls.items.slice(0, 10);
        matched.push({
          classId: cls.id,
          className: cls.name,
          classType: cls.type,
          matchedItems: itemsToShow,
        });
      }
    }

    return matched;
  }, [query]);

  const toggleExpand = (classId: number) => {
    setExpandedClasses((prev) => {
      const next = new Set(prev);
      if (next.has(classId)) next.delete(classId);
      else next.add(classId);
      return next;
    });
  };

  const buildPrompt = () => {
    const q = query.trim();
    return q ? `Определить МКТУ: ${q}` : "Определить МКТУ";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Local header (below global) */}
      <div className="pt-20 pb-4 border-b border-border bg-background/95 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-foreground/60 hover:text-foreground hover:bg-muted"
              title="На главную"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline ml-1.5">Главная</span>
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold/10 border border-gold/30 flex-shrink-0">
                <Search className="size-4 text-gold" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-foreground">
                  Результаты поиска
                </h1>
                <div className="text-xs text-foreground/50">
                  Найдено классов:{" "}
                  <span className="text-gold font-medium">{results.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/30 pointer-events-none" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по классам и позициям..."
                className="pl-12 pr-12 h-12 text-base bg-card border-border focus-visible:border-gold/40 focus-visible:ring-gold/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
            <motion.button
              type="button"
              onClick={() => setAiOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              title="Поиск с помощью ИИ"
              className="flex items-center justify-center w-12 h-12 sm:w-auto sm:px-4 rounded-md bg-gradient-to-br from-blue-500/15 to-emerald-500/15 border border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 transition-all flex-shrink-0"
            >
              <Sparkles className="size-5 sm:size-4" strokeWidth={2.2} />
              <span className="hidden sm:inline ml-2 text-sm font-semibold">
                ИИ
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Results — нативный скролл страницы */}
      <div className="flex-1 overscroll-contain">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-16">
          {results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-foreground/40 text-lg mb-2">
                Ничего не найдено
              </p>
              <p className="text-foreground/30 text-sm mb-6">
                Попробуйте изменить запрос или используйте ИИ-поиск
              </p>
              <Button
                onClick={() => setAiOpen(true)}
                className="bg-gradient-to-br from-blue-500/15 to-emerald-500/15 border border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-500/50"
              >
                <Sparkles className="size-4 mr-1.5" />
                Поиск с ИИ
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => {
                const isExpanded = expandedClasses.has(result.classId);
                const inCart = isInCart(result.classId);
                const selectedCount = result.matchedItems.filter((it) =>
                  isItemSelectedInCart(result.classId, it),
                ).length;

                return (
                  <div
                    key={result.classId}
                    className={`rounded-xl border overflow-hidden transition-colors ${
                      isExpanded
                        ? "bg-card border-gold/30"
                        : "bg-card/50 border-border hover:border-border/80"
                    }`}
                  >
                    {/* Class header — click to expand */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(result.classId)}
                      className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30"
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${
                          result.classType === "goods"
                            ? "bg-gold/10"
                            : "bg-blue-500/10"
                        }`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            result.classType === "goods"
                              ? "text-gold"
                              : "text-blue-400"
                          }`}
                        >
                          {result.classId}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground text-sm">
                          {result.className}
                        </div>
                        <div className="text-xs text-foreground/40 mt-0.5">
                          {result.classType === "goods" ? "Товары" : "Услуги"} ·{" "}
                          {result.matchedItems.length} позиций
                          {selectedCount > 0 && (
                            <span className="text-gold ml-1">
                              · выбрано {selectedCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-colors ${
                          isExpanded
                            ? "bg-gold/10 text-gold"
                            : "text-foreground/40"
                        }`}
                      >
                        {isExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </div>
                    </button>

                    {/* Expanded items with checkboxes */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-border/50">
                          <div
                            className="max-h-[60vh] overflow-y-auto mt-2 space-y-0.5 overscroll-contain rounded-md"
                            style={{ WebkitOverflowScrolling: "touch" }}
                          >
                            {result.matchedItems.map((item) => {
                              const checked = isItemSelectedInCart(
                                result.classId,
                                item,
                              );
                              return (
                                <div
                                  key={item}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!inCart) addToCart(result.classId);
                                    toggleItemInCart(result.classId, item);
                                  }}
                                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                                    checked ? "bg-gold/5" : "hover:bg-muted"
                                  }`}
                                >
                                  <div
                                    className={`size-4 shrink-0 rounded-[4px] border flex items-center justify-center transition-colors ${
                                      checked
                                        ? "bg-gold border-gold text-background"
                                        : "border-input"
                                    }`}
                                  >
                                    {checked && (
                                      <Check
                                        className="size-3.5"
                                        strokeWidth={3}
                                      />
                                    )}
                                  </div>
                                  <span
                                    className={`text-sm transition-colors select-none ${
                                      checked
                                        ? "text-foreground"
                                        : "text-foreground/60"
                                    }`}
                                  >
                                    {item}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Select all / open full class page */}
                          <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-border/30 flex-wrap">
                            <span className="text-xs text-foreground/30">
                              {selectedCount} из {result.matchedItems.length}{" "}
                              выбрано
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const allSelected =
                                    result.matchedItems.every((it) =>
                                      isItemSelectedInCart(result.classId, it),
                                    );
                                  if (allSelected) {
                                    result.matchedItems.forEach((it) => {
                                      if (
                                        isItemSelectedInCart(result.classId, it)
                                      )
                                        toggleItemInCart(result.classId, it);
                                    });
                                  } else {
                                    if (!inCart) addToCart(result.classId);
                                    result.matchedItems.forEach((it) => {
                                      if (
                                        !isItemSelectedInCart(result.classId, it)
                                      )
                                        toggleItemInCart(result.classId, it);
                                    });
                                  }
                                }}
                                className="text-xs text-gold hover:text-gold hover:bg-gold/5 h-7 px-2"
                              >
                                {result.matchedItems.every((it) =>
                                  isItemSelectedInCart(result.classId, it),
                                )
                                  ? "Снять все"
                                  : "Выбрать все"}
                              </Button>
                              <Link
                                href={`/class/${result.classId}`}
                                className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-7 px-2 rounded-md inline-flex items-center"
                              >
                                Весь класс →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AiChatDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        initialPrompt={buildPrompt()}
      />
    </div>
  );
}

export default function SearchClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 flex items-center justify-center text-foreground/40">
          Загрузка…
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
