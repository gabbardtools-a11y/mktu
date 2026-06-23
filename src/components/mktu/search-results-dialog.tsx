"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { mktuClasses } from "@/data/mktu-data";

interface SearchResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  isInCart: (classId: number) => boolean;
  addToCart: (classId: number) => void;
  isItemSelectedInCart: (classId: number, item: string) => boolean;
  toggleItemInCart: (classId: number, item: string) => void;
}

interface ClassSearchResult {
  classId: number;
  className: string;
  classType: "goods" | "services";
  matchedItems: string[];
}

export function SearchResultsDialog({
  open,
  onOpenChange,
  query,
  isInCart,
  addToCart,
  isItemSelectedInCart,
  toggleItemInCart,
}: SearchResultsDialogProps) {
  const [expandedClasses, setExpandedClasses] = useState<Set<number>>(new Set());

  const results = useMemo<ClassSearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matched: ClassSearchResult[] = [];

    for (const cls of mktuClasses) {
      // Check if query matches class name or description
      const nameMatch = cls.name.toLowerCase().includes(q);
      const descMatch = cls.description.toLowerCase().includes(q);

      // Find matching items
      const nameMatch = cls.name.toLowerCase().includes(q);
      const descMatch = cls.description.toLowerCase().includes(q);
      const matchedItems = cls.items.filter((item) =>
        item.toLowerCase().includes(q),
      );

      if (nameMatch || descMatch || matchedItems.length > 0) {
        // If only name/desc matches (no items), show first 10 items
        const itemsToShow = matchedItems.length > 0 ? matchedItems : cls.items.slice(0, 10);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-none !w-screen !h-screen !max-h-none !rounded-none !translate-x-0 !translate-y-0 !left-0 !top-0 flex flex-col p-0 gap-0 bg-background border-gold/20 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-gold/10 border border-gold/30 flex-shrink-0">
                <Search className="size-5 text-gold" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
                  Результаты поиска
                </DialogTitle>
                <div className="text-xs text-foreground/50 mt-0.5">
                  Запрос: «{query}» · Найдено классов: {results.length}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-foreground/60 hover:text-foreground hover:bg-muted flex-shrink-0"
              title="Закрыть"
            >
              <X className="size-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="max-w-4xl mx-auto space-y-3">
            {results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-foreground/40 text-lg mb-2">
                  Ничего не найдено
                </p>
                <p className="text-foreground/30 text-sm">
                  Попробуйте изменить запрос или используйте ИИ-поиск
                </p>
              </div>
            ) : (
              results.map((result) => {
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
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-border/50">
                          <div className="max-h-96 overflow-y-auto mt-2 space-y-0.5">
                          <div className="max-h-96 overflow-y-auto mt-2 space-y-0.5 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
                            {result.matchedItems.map((item, i) => {
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

                          {/* Select all / deselect all */}
                          <div className="mt-2 flex items-center justify-between pt-2 border-t border-border/30">
                            <span className="text-xs text-foreground/30">
                              {selectedCount} из {result.matchedItems.length}{" "}
                              выбрано
                            </span>
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
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  )
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-border px-4 sm:px-6 py-3 bg-background">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-xs text-foreground/40">
              Нажмите на класс, чтобы развернуть позиции
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-gold/30 text-gold hover:bg-gold/5"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
