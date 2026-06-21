"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  SquareCheck,
  Layers,
  Check,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mktuClasses } from "@/data/mktu-data";
import type { CartClass } from "@/hooks/use-favorites-cart";
import { downloadRtf } from "@/lib/rtf-export";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartClass[];
  onRemoveFromCart: (classId: number) => void;
  onToggleItemInCart: (classId: number, item: string) => void;
  onIsItemSelectedInCart: (classId: number, item: string) => boolean;
  onClearCart: () => void;
  onOpenFavorites: () => void;
  onOpenClass: (classId: number) => void;
}

function pluralRu(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export function CartSheet({
  open,
  onOpenChange,
  cart,
  onRemoveFromCart,
  onToggleItemInCart,
  onIsItemSelectedInCart,
  onClearCart,
  onOpenFavorites,
  onOpenClass,
}: CartSheetProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const totalItems = cart.reduce(
    (acc, c) => acc + c.selectedItems.length,
    0,
  );

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-background border-l border-gold/10 flex flex-col p-0"
      >
        <SheetHeader className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-gold" />
              <SheetTitle className="text-foreground">
                Корзина для заявки
              </SheetTitle>
            </div>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearCart}
                className="text-foreground/40 hover:text-red-400 hover:bg-red-400/5 text-xs"
              >
                <Trash2 className="size-3.5 mr-1.5" />
                Очистить
              </Button>
            )}
          </div>
          <SheetDescription className="text-foreground/40 text-sm">
            {cart.length === 0
              ? "Корзина пуста"
              : `${cart.length} ${pluralRu(cart.length, ["класс", "класса", "классов"])}, ${totalItems} ${pluralRu(totalItems, ["позиция", "позиции", "позиций"])} выбрано`}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                <ShoppingBag className="size-8 text-foreground/20" />
              </div>
              <p className="text-foreground/40 text-sm mb-2">
                Корзина пуста
              </p>
              <p className="text-foreground/30 text-xs mb-6 max-w-xs">
                Добавляйте классы кнопкой-сумкой в карточке, а затем выбирайте
                конкретные товары чекбоксами.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onOpenFavorites();
                }}
                className="border-gold/30 text-gold hover:bg-gold/5"
              >
                <Star className="size-4 mr-1.5" />
                Открыть избранное
              </Button>
            </div>
          ) : (
            <div className="space-y-2 pt-2 pb-4">
              {cart.map((entry) => {
                const cls = mktuClasses.find((c) => c.id === entry.classId);
                if (!cls) return null;
                const isOpen = expanded.has(cls.id);
                const selectedCount = cls.items.filter((it) =>
                  onIsItemSelectedInCart(cls.id, it),
                ).length;

                return (
                  <div
                    key={cls.id}
                    className="rounded-lg border border-border bg-card overflow-hidden"
                  >
                    <div className="flex items-center gap-2 p-3">
                      <button
                        onClick={() => toggleExpand(cls.id)}
                        className="flex items-center gap-2 flex-1 text-left min-w-0"
                      >
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-md flex-shrink-0 ${
                            cls.type === "goods"
                              ? "bg-gold/10"
                              : "bg-blue-500/10"
                          }`}
                        >
                          <Layers
                            className={`size-4 ${
                              cls.type === "goods"
                                ? "text-gold"
                                : "text-blue-400"
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground text-sm truncate">
                            {cls.name}
                          </div>
                          <div className="text-xs text-foreground/40">
                            {selectedCount} из {cls.items.length} выбрано
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => toggleExpand(cls.id)}
                        className="p-1.5 rounded-md text-foreground/40 hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                      >
                        {isOpen ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onRemoveFromCart(cls.id)}
                        className="p-1.5 rounded-md text-foreground/30 hover:text-red-400 hover:bg-red-400/5 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 border-t border-border/50">
                            <div className="max-h-72 overflow-y-auto mt-2 space-y-0.5">
                              {cls.items.map((item) => {
                                const checked = onIsItemSelectedInCart(
                                  cls.id,
                                  item,
                                );
                                return (
                                  <div
                                    key={item}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleItemInCart(cls.id, item);
                                    }}
                                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
                                      checked
                                        ? "bg-gold/5"
                                        : "hover:bg-muted"
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
                                      className={`text-xs transition-colors select-none ${
                                        checked
                                          ? "text-foreground"
                                          : "text-foreground/50"
                                      }`}
                                    >
                                      {item}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-foreground/30">
                                {selectedCount} из {cls.items.length} выбрано
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const allSelected =
                                    cls.items.every((it) =>
                                      onIsItemSelectedInCart(cls.id, it),
                                    );
                                  if (allSelected) {
                                    cls.items.forEach((it) => {
                                      if (onIsItemSelectedInCart(cls.id, it))
                                        onToggleItemInCart(cls.id, it);
                                    });
                                  } else {
                                    cls.items.forEach((it) => {
                                      if (
                                        !onIsItemSelectedInCart(cls.id, it)
                                      )
                                        onToggleItemInCart(cls.id, it);
                                    });
                                  }
                                }}
                                className="text-xs text-gold hover:text-gold hover:bg-gold/5 h-7 px-2"
                              >
                                <SquareCheck className="size-3.5 mr-1" />
                                {cls.items.every((it) =>
                                  onIsItemSelectedInCart(cls.id, it),
                                )
                                  ? "Снять все"
                                  : "Выбрать все"}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <button
                onClick={() => {
                  onOpenChange(false);
                }}
                className="hidden"
                aria-hidden
              />
            </div>
          )}
        </ScrollArea>

        {cart.length > 0 && (
          <div className="flex-shrink-0 p-4 border-t border-border bg-background">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-foreground/50">
                <span className="text-gold font-medium">{cart.length}</span>{" "}
                {pluralRu(cart.length, ["класс", "класса", "классов"])},{" "}
                <span className="text-gold font-medium">{totalItems}</span>{" "}
                {pluralRu(totalItems, ["позиция", "позиции", "позиций"])}
              </div>
              <Button
                onClick={() => downloadRtf(cart, mktuClasses)}
                className="bg-gold text-background hover:bg-gold-dark gap-1.5 text-sm"
              >
                <Download className="size-4" />
                Скачать список
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
