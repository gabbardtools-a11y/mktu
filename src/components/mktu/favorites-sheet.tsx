"use client";

import { Star, Trash2, ShoppingBag, Layers } from "lucide-react";
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
import { useLanguage } from "@/lib/i18n/useLanguage";
import {
  tClassName,
  tClassDesc,
  tItems,
  tClassesInFav,
} from "@/lib/i18n/translations";

interface FavoritesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favorites: number[];
  onToggleFavorite: (classId: number) => void;
  onClearFavorites: () => void;
  onAddToCart: (classId: number) => void;
  isInCart: (classId: number) => boolean;
  onOpenClass: (classId: number) => void;
  cart: CartClass[];
  onOpenCart: () => void;
}

export function FavoritesSheet({
  open,
  onOpenChange,
  favorites,
  onToggleFavorite,
  onClearFavorites,
  onAddToCart,
  isInCart,
  onOpenClass,
  onOpenCart,
}: FavoritesSheetProps) {
  const favClasses = mktuClasses.filter((c) => favorites.includes(c.id));
  const { lang, t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-background border-l border-gold/10 flex flex-col p-0"
      >
        <SheetHeader className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="size-5 text-gold fill-current" />
              <SheetTitle className="text-foreground">{t("header.favorites")}</SheetTitle>
            </div>
            {favorites.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFavorites}
                className="text-foreground/40 hover:text-red-400 hover:bg-red-400/5 text-xs"
              >
                <Trash2 className="size-3.5 mr-1.5" />
                {t("common.clear")}
              </Button>
            )}
          </div>
          <SheetDescription className="text-foreground/40 text-sm">
            {favorites.length === 0
              ? t("fs.listEmpty")
              : tClassesInFav(lang, favorites.length)}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          {favClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                <Star className="size-8 text-foreground/20" />
              </div>
              <p className="text-foreground/40 text-sm mb-2">
                {t("fs.empty")}
              </p>
              <p className="text-foreground/30 text-xs max-w-xs">
                {t("fs.emptyHint")}
              </p>
            </div>
          ) : (
            <div className="space-y-2 pt-2 pb-4">
              {favClasses.map((cls) => {
                const inCart = isInCart(cls.id);
                return (
                  <div
                    key={cls.id}
                    className="rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-start gap-2 mb-2">
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
                      <button
                        onClick={() => {
                          onOpenChange(false);
                          onOpenClass(cls.id);
                        }}
                        className="flex-1 text-left min-w-0"
                      >
                        <div className="font-medium text-foreground text-sm">
                          {tClassName(lang, cls.id)}
                        </div>
                        <div className="text-xs text-foreground/40">
                          {tItems(lang, cls.itemsCount)}
                        </div>
                      </button>
                      <button
                        onClick={() => onToggleFavorite(cls.id)}
                        className="p-1.5 rounded-md text-gold hover:bg-gold/10 transition-colors flex-shrink-0"
                      >
                        <Star className="size-4 fill-current" />
                      </button>
                    </div>

                    <p className="text-xs text-foreground/50 leading-relaxed mb-3 line-clamp-2">
                      {tClassDesc(lang, cls.id, cls.description)}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onOpenChange(false);
                          onOpenClass(cls.id);
                        }}
                        className="text-gold hover:bg-gold/5 text-xs h-7"
                      >
                        {t("fs.openItems")}
                      </Button>
                      <div className="flex-1" />
                      <Button
                        variant={inCart ? "ghost" : "outline"}
                        size="sm"
                        disabled={inCart}
                        onClick={() => onAddToCart(cls.id)}
                        className={`text-xs h-7 ${
                          inCart
                            ? "text-gold"
                            : "border-gold/30 text-gold hover:bg-gold/5"
                        }`}
                      >
                        <ShoppingBag
                          className={`size-3.5 mr-1 ${inCart ? "fill-current" : ""}`}
                        />
                        {inCart ? t("common.cartOn") : t("common.cartAdd")}
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onOpenCart();
                }}
                className="w-full border-gold/30 text-gold hover:bg-gold/5 mt-2"
              >
                <ShoppingBag className="size-4 mr-2" />
                {t("fs.toCartPage")}
              </Button>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
