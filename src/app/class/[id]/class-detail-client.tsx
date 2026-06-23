"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Search,
  X,
  Package,
  Briefcase,
  Check,
  ArrowLeft,
  ArrowRight,
  Download,
  SquareCheck,
  Info,
  ChevronDown,
  Maximize2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mktuClasses } from "@/data/mktu-data";
import { ClassNotes } from "@/components/mktu/class-notes";
import { useFavoritesCart } from "@/components/mktu/favorites-cart-context";
import { downloadRtf } from "@/lib/rtf-export";

interface ClassDetailClientProps {
  classId: number;
}

export function ClassDetailClient({ classId }: ClassDetailClientProps) {
  const router = useRouter();

  const {
    isFavorite,
    toggleFavorite,
    isInCart,
    addToCart,
    isItemSelectedInCart,
    toggleItemInCart,
    openCart,
    cart,
  } = useFavoritesCart();

  const [query, setQuery] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  // Скролл наверх при смене класса
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [classId]);

  if (!cls) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <p className="text-foreground/60 text-lg mb-4">Класс не найден</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="size-4 mr-1.5" />
            На главную
          </Button>
        </div>
      </div>
    );
  }

  const isGoods = cls.type === "goods";
  const Icon = isGoods ? Package : Briefcase;
  const fav = isFavorite(cls.id);
  const inCart = isInCart(cls.id);
  const selectedCount = cls.items.filter((it) =>
    isItemSelectedInCart(cls.id, it),
  ).length;

  // Соседние классы для навигации
  const prevClass = mktuClasses.find((c) => c.id === cls.id - 1);
  const nextClass = mktuClasses.find((c) => c.id === cls.id + 1);

  const handleSelectAllVisible = () => {
    const visible = filteredItems;
    const allSelected = visible.every((it) =>
      isItemSelectedInCart(cls.id, it),
    );
    if (allSelected) {
      visible.forEach((it) => {
        if (isItemSelectedInCart(cls.id, it))
          toggleItemInCart(cls.id, it);
      });
    } else {
      if (!inCart) addToCart(cls.id);
      visible.forEach((it) => {
        if (!isItemSelectedInCart(cls.id, it))
          toggleItemInCart(cls.id, it);
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pt-16">
      {/* Header (page-local, скроллится вместе с контентом — не перекрывает кнопку Подсказка) */}
      <div className="pt-2 pb-3 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-2 mb-2">
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

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(cls.id)}
                className={
                  fav
                    ? "text-gold hover:bg-gold/10"
                    : "text-foreground/40 hover:text-gold hover:bg-gold/5"
                }
                title={fav ? "Убрать из избранного" : "В избранное"}
              >
                <Star className={`size-4 ${fav ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addToCart(cls.id)}
                disabled={inCart}
                className={
                  inCart
                    ? "text-gold hover:bg-gold/10"
                    : "text-foreground/40 hover:text-gold hover:bg-gold/5"
                }
                title={inCart ? "Уже в корзине" : "В корзину"}
              >
                <ShoppingBag
                  className={`size-4 ${inCart ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHeaderCollapsed(true)}
                className="text-foreground/40 hover:text-foreground hover:bg-muted"
                title="Свернуть заголовок класса"
              >
                <X className="size-4" />
                <span className="ml-1.5 hidden sm:inline">Закрыть</span>
              </Button>
            </div>
          </div>

          {/* Скрытый заголовок — кнопка для разворота обратно */}
          <AnimatePresence initial={false}>
            {headerCollapsed && (
              <motion.button
                type="button"
                onClick={() => setHeaderCollapsed(false)}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full overflow-hidden flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-border hover:border-gold/40 hover:bg-gold/5 transition-colors text-left"
                title="Показать заголовок класса"
              >
                <Maximize2 className="size-4 text-gold flex-shrink-0" />
                <span className="text-sm text-foreground/70 truncate">
                  Класс {cls.id} — {cls.name}
                </span>
                <ChevronDown className="size-3.5 text-foreground/40 ml-auto rotate-180 flex-shrink-0" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Полный заголовок класса — скрыт по кнопке «Закрыть» */}
          <AnimatePresence initial={false}>
            {!headerCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0 ${
                      isGoods ? "bg-gold/10" : "bg-blue-500/10"
                    }`}
                  >
                    <Icon
                      className={`size-5 ${isGoods ? "text-gold" : "text-blue-400"}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-xs uppercase tracking-wider font-medium ${
                        isGoods ? "text-gold/70" : "text-blue-400/70"
                      }`}
                    >
                      Класс {cls.id} · {isGoods ? "Товары" : "Услуги"} ·{" "}
                      {cls.items.length} позиций
                    </h4>
                    <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight mt-0.5">
                      {cls.name}
                    </h1>
                  </div>
                </div>

                <p className="text-foreground/60 text-sm leading-relaxed mt-2">
                  {cls.description}
                </p>

                {selectedCount > 0 && (
                  <div className="mt-3 px-3 py-1.5 rounded-md bg-gold/5 border border-gold/20 text-xs text-gold">
                    Выбрано позиций: {selectedCount} из {cls.items.length}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Кнопка-тогглер «Подсказка» → раскрывает Пояснения / Относятся / Не относятся */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-3">
        <button
          type="button"
          onClick={() => setShowNotes((v) => !v)}
          aria-expanded={showNotes}
          className="group w-full flex items-center gap-3 p-3 rounded-lg border bg-card/50 border-border hover:border-gold/30 hover:bg-gold/5 transition-colors"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0 bg-blue-500/10">
            <Info className="size-4 text-blue-400" />
          </div>
          <span className="flex-1 text-left font-medium text-foreground text-sm">
            Подсказка
            <span className="block text-xs text-foreground/40 font-normal mt-0.5">
              Пояснения · что относится к классу · что не относится
            </span>
          </span>
          <ChevronDown
            className={`size-4 text-foreground/40 transition-transform flex-shrink-0 ${
              showNotes ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {showNotes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                <ClassNotes classId={cls.id} expanded={showNotes} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Поиск по позициям */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/30 pointer-events-none" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по позициям класса..."
            className="pl-10 pr-10 bg-card border-border"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {filteredItems.length > 0 && (
          <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-foreground/40">
              Показано {filteredItems.length} из {cls.items.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllVisible}
              className="text-xs text-gold hover:text-gold hover:bg-gold/5 h-7 px-2"
            >
              <SquareCheck className="size-3.5 mr-1" />
              {filteredItems.every((it) =>
                isItemSelectedInCart(cls.id, it),
              ) && inCart
                ? "Снять все"
                : "Выбрать все"}
            </Button>
          </div>
        )}
      </div>

      {/* Список позиций — нативный скролл страницы */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-6 flex-1">
        <div className="space-y-0.5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-foreground/40 text-sm">
              Ничего не найдено по запросу «{query}»
            </div>
          ) : (
            filteredItems.map((item) => {
              const checked = isItemSelectedInCart(cls.id, item);
              return (
                <div
                  key={item}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!inCart) addToCart(cls.id);
                    toggleItemInCart(cls.id, item);
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
                      <Check className="size-3.5" strokeWidth={3} />
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
            })
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md px-4 sm:px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-foreground/50">
              <span className="text-gold font-medium">{cart.length}</span>{" "}
              классов в корзине
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openCart}
                className="border-gold/30 text-gold hover:bg-gold/5"
              >
                <ShoppingBag className="size-4 mr-1.5" />
                Открыть корзину
              </Button>
              <Button
                size="sm"
                onClick={() => downloadRtf(cart, mktuClasses)}
                className="bg-gold text-background hover:bg-gold-dark"
              >
                <Download className="size-4 mr-1.5" />
                <span className="hidden sm:inline">Скачать Rtf</span>
                <span className="sm:hidden">Rtf</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Prev / Next navigation */}
      <div className="border-t border-border bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          {prevClass ? (
            <Link
              href={`/class/${prevClass.id}`}
              className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors min-w-0"
            >
              <ArrowLeft className="size-4 flex-shrink-0" />
              <span className="truncate">
                <span className="text-foreground/40 mr-1">
                  {prevClass.id}.
                </span>
                {prevClass.name}
              </span>
            </Link>
          ) : (
            <span className="text-xs text-foreground/30">Это первый класс</span>
          )}

          {nextClass ? (
            <Link
              href={`/class/${nextClass.id}`}
              className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors min-w-0 justify-end"
            >
              <span className="truncate text-right">
                {nextClass.name}
                <span className="text-foreground/40 ml-1">
                  .{nextClass.id}
                </span>
              </span>
              <ArrowRight className="size-4 flex-shrink-0" />
            </Link>
          ) : (
            <span className="text-xs text-foreground/30">
              Это последний класс
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
