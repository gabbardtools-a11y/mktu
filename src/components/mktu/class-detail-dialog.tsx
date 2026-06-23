"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Search,
  X,
  Package,
  Briefcase,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mktuClasses } from "@/data/mktu-data";

interface ClassDetailDialogProps {
  classId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorite: (classId: number) => boolean;
  toggleFavorite: (classId: number) => void;
  isInCart: (classId: number) => boolean;
  addToCart: (classId: number) => void;
  isItemSelectedInCart: (classId: number, item: string) => boolean;
  toggleItemInCart: (classId: number, item: string) => void;
}

export function ClassDetailDialog({
  classId,
  open,
  onOpenChange,
  isFavorite,
  toggleFavorite,
  isInCart,
  addToCart,
  isItemSelectedInCart,
  toggleItemInCart,
}: ClassDetailDialogProps) {
  const [query, setQuery] = useState("");

  const cls = useMemo(
    () => mktuClasses.find((c) => c.id === classId) ?? null,
    [classId],
  );

  const filteredItems = useMemo(() => {
    if (!cls) return [];
    const q = query.trim().toLowerCase();
    if (!q) return cls.items;
    return cls.items.filter((it) => it.toLowerCase().includes(q));
  }, [cls, query]);

  if (!cls) return null;

  const isGoods = cls.type === "goods";
  const Icon = isGoods ? Package : Briefcase;
  const fav = isFavorite(cls.id);
  const inCart = isInCart(cls.id);
  const selectedCount = cls.items.filter((it) =>
    isItemSelectedInCart(cls.id, it),
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-none !w-screen !h-screen !max-h-none !rounded-none !translate-x-0 !translate-y-0 !left-0 !top-0 flex flex-col p-0 gap-0 bg-background border-gold/20"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 ${
                  isGoods ? "bg-gold/10" : "bg-blue-500/10"
                }`}
              >
                <Icon
                  className={`size-6 ${isGoods ? "text-gold" : "text-blue-400"}`}
                />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {cls.name}
                </DialogTitle>
                <div
                  className={`text-xs uppercase tracking-wider font-medium mt-0.5 ${
                    isGoods ? "text-gold/70" : "text-blue-400/70"
                  }`}
                >
                  {isGoods ? "Товары" : "Услуги"} • {cls.items.length} позиций
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(cls.id)}
                className={`${
                  fav
                    ? "text-gold hover:bg-gold/10"
                    : "text-foreground/40 hover:text-gold hover:bg-gold/5"
                }`}
                title={fav ? "Убрать из избранного" : "В избранное"}
              >
                <Star className={`size-4 ${fav ? "fill-current" : ""}`} />
                <span className="ml-1.5 hidden sm:inline">
                  {fav ? "В избранном" : "В избранное"}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addToCart(cls.id)}
                disabled={inCart}
                className={`${
                  inCart
                    ? "text-gold hover:bg-gold/10"
                    : "text-foreground/40 hover:text-gold hover:bg-gold/5"
                }`}
                title={inCart ? "Уже в корзине" : "В корзину"}
              >
                <ShoppingBag
                  className={`size-4 ${inCart ? "fill-current" : ""}`}
                />
                <span className="ml-1.5 hidden sm:inline">
                  {inCart ? "В корзине" : "В корзину"}
                </span>
              </Button>
            </div>
          </div>

          <p className="text-foreground/60 text-sm leading-relaxed mt-3">
            {cls.description}
          </p>

          {selectedCount > 0 && (
            <div className="mt-3 px-3 py-1.5 rounded-md bg-gold/5 border border-gold/20 text-xs text-gold">
              Выбрано позиций: {selectedCount} из {cls.items.length}
            </div>
          )}
        </DialogHeader>

        <div className="px-6 pt-4 pb-3 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/30 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по позициям класса..."
              className="pl-10 pr-10 bg-card border-border"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {filteredItems.length > 0 && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-foreground/40">
                Показано {filteredItems.length} из {cls.items.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const allSelected =
                    cls.items.every((it) =>
                      isItemSelectedInCart(cls.id, it),
                    ) && inCart;
                  if (allSelected) {
                    cls.items.forEach((it) => {
                      if (isItemSelectedInCart(cls.id, it))
                        toggleItemInCart(cls.id, it);
                    });
                  } else {
                    if (!inCart) addToCart(cls.id);
                    cls.items.forEach((it) => {
                      if (!isItemSelectedInCart(cls.id, it))
                        toggleItemInCart(cls.id, it);
                    });
                  }
                }}
                className="text-xs text-gold hover:text-gold hover:bg-gold/5 h-7 px-2"
              >
                {cls.items.every((it) => isItemSelectedInCart(cls.id, it)) &&
                inCart
                  ? "Снять все"
                  : "Выбрать все"}
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-0.5 pt-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 text-foreground/40 text-sm">
                Ничего не найдено по запросу «{query}»
              </div>
            ) : (
              filteredItems.map((item, i) => {
                const checked = isItemSelectedInCart(cls.id, item);
                const handleToggle = () => {
                  if (!inCart) addToCart(cls.id);
                  toggleItemInCart(cls.id, item);
                };
                return (
                  <div
                    key={item}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle();
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
                      {checked && <Check className="size-3.5" strokeWidth={3} />}
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
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
