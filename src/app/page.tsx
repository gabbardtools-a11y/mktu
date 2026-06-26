"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Briefcase, Sparkles, ChevronDown, Star, ShoppingBag } from "lucide-react";
import { SearchSection, type FilterType } from "@/components/mktu/search-section";
import { ClassCard } from "@/components/mktu/class-card";
import { mktuClasses } from "@/data/mktu-data";
import { getClassIcon } from "@/data/class-icons";
import { useFavoritesCart } from "@/components/mktu/favorites-cart-context";

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [hintOpen, setHintOpen] = useState(false);
  const router = useRouter();
  const {
    favorites,
    cart,
    mounted,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    isInCart,
    addToCart,
    clearCart,
  } = useFavoritesCart();

  // Keyboard shortcut for search focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(
          "#search-section input",
        );
        input?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Filtered classes based on query and filter
  const filteredGoods = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mktuClasses.filter((c) => {
      if (c.type !== "goods") return false;
      if (filter === "services") return false;
      if (!q) return true;
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.description.toLowerCase().includes(q)) return true;
      return c.items.some((it) => it.toLowerCase().includes(q));
    });
  }, [query, filter]);

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mktuClasses.filter((c) => {
      if (c.type !== "services") return false;
      if (filter === "goods") return false;
      if (!q) return true;
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.description.toLowerCase().includes(q)) return true;
      return c.items.some((it) => it.toLowerCase().includes(q));
    });
  }, [query, filter]);

  const showGoods = filter !== "services";
  const showServices = filter !== "goods";

  return (
    <section
      id="class-grid"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 scroll-mt-16"
    >
      {/* Hero — одна строка */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-base sm:text-lg font-semibold text-foreground/80 mb-3"
      >
        Онлайн-сервис без рекламы и услуг
      </motion.h1>

      {/* Hint banner — кликабельный, разворачивает подробную подсказку */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-4 flex items-center justify-center"
      >
        <button
          type="button"
          onClick={() => setHintOpen((v) => !v)}
          aria-expanded={hintOpen}
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/5 border border-gold/15 hover:bg-gold/10 hover:border-gold/30 transition-colors"
        >
          <Sparkles className="size-3.5 text-gold" />
          <span className="text-xs text-foreground/70">
            <span className="text-gold">⭐ Избранное</span> →{" "}
            <span className="text-gold">🛒 Корзина</span> →{" "}
            <span className="text-gold">⬇ Rtf</span>
          </span>
          <ChevronDown
            className={`size-3.5 text-foreground/40 transition-transform ${
              hintOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </motion.div>

      <AnimatePresence initial={false}>
        {hintOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden mb-4"
          >
            <p className="text-center text-foreground/50 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto px-4">
              Подсказка: найдите нужные классы → добавьте в избранное ⭐ → из
              избранного выберите товары чекбоксами → скачайте Rtf
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchSection
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        favoritesCount={mounted ? favorites.length : 0}
        cartCount={mounted ? cart.length : 0}
        onClearFavorites={clearFavorites}
        onClearCart={clearCart}
        isInCart={isInCart}
        addToCart={addToCart}
        isItemSelectedInCart={() => false}
        toggleItemInCart={() => {}}
      />

      {/* List mode — all classes in compact list */}
      {filter === "all" && (
        <div id="all-classes-list" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Все классы МКТУ — 1–45
            </h2>
            <span className="text-sm text-foreground/40 ml-auto">
              {mktuClasses.length} классов
            </span>
          </div>
          <div className="space-y-1">
            {mktuClasses
              .filter((cls) => {
                const q = query.trim().toLowerCase();
                if (!q) return true;
                if (cls.name.toLowerCase().includes(q)) return true;
                if (cls.description.toLowerCase().includes(q)) return true;
                return cls.items.some((it) => it.toLowerCase().includes(q));
              })
              .map((cls, idx) => {
                const { icon: Icon, label: iconLabel } = getClassIcon(cls.id);
                const isGoods = cls.type === "goods";
                const fav = mounted && isFavorite(cls.id);
                const inCart = mounted && isInCart(cls.id);
                return (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: Math.min(idx * 0.01, 0.3) }}
                    onClick={() => router.push(`/class/${cls.id}`)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                      fav
                        ? "bg-gold/5 border-gold/30 hover:border-gold/50"
                        : "bg-card/50 border-border hover:border-gold/20 hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 ${
                        isGoods ? "bg-gold/10" : "bg-blue-500/10"
                      }`}
                    >
                      <Icon className={`size-4 ${isGoods ? "text-gold" : "text-blue-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isGoods ? "text-gold" : "text-blue-400"}`}>
                          {cls.id}
                        </span>
                        <span className="text-sm sm:text-base font-medium text-foreground truncate">
                          {cls.name}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground/40 truncate">
                        {iconLabel} · {cls.items.length} позиций
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(cls.id);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          fav ? "text-gold hover:bg-gold/10" : "text-foreground/30 hover:text-gold hover:bg-gold/5"
                        }`}
                        title={fav ? "В избранном" : "В избранное"}
                      >
                        <Star className={`size-3.5 ${fav ? "fill-current" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!inCart) addToCart(cls.id);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          inCart ? "text-gold hover:bg-gold/10" : "text-foreground/30 hover:text-gold hover:bg-gold/5"
                        }`}
                        title={inCart ? "В корзине" : "В корзину"}
                      >
                        <ShoppingBag className={`size-3.5 ${inCart ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}

      {/* Goods section — grid mode */}
      {showGoods && filter !== "all" && filteredGoods.length > 0 && (
        <div id="goods-section" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10">
              <Package className="size-5 text-gold" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Товары — классы 1–34
            </h2>
            <span className="text-sm text-foreground/40 ml-auto">
              {filteredGoods.length} из 34
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoods.map((cls, idx) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                index={idx}
                isFavorite={mounted && isFavorite(cls.id)}
                isInCart={mounted && isInCart(cls.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Services section — grid mode */}
      {showServices && filter !== "all" && filteredServices.length > 0 && (
        <div id="services-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
              <Briefcase className="size-5 text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Услуги — классы 35–45
            </h2>
            <span className="text-sm text-foreground/40 ml-auto">
              {filteredServices.length} из 11
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((cls, idx) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                index={idx}
                isFavorite={mounted && isFavorite(cls.id)}
                isInCart={mounted && isInCart(cls.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {((showGoods && filteredGoods.length === 0) ||
        (showServices && filteredServices.length === 0)) &&
        query && (
          <div className="text-center py-16">
            <p className="text-foreground/40 text-lg mb-2">
              Ничего не найдено
            </p>
            <p className="text-foreground/30 text-sm">
              Попробуйте изменить запрос или сбросить фильтры
            </p>
          </div>
        )}
    </section>
  );
}
