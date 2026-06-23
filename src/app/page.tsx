"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Briefcase, Sparkles } from "lucide-react";
import { Header } from "@/components/mktu/header";
// Hero removed — user requested permanent removal
import { SearchSection, type FilterType } from "@/components/mktu/search-section";
import { ClassCard } from "@/components/mktu/class-card";
import { ClassDetailDialog } from "@/components/mktu/class-detail-dialog";
import { CartSheet } from "@/components/mktu/cart-sheet";
import { FavoritesSheet } from "@/components/mktu/favorites-sheet";
import { FaqDialog } from "@/components/mktu/faq-dialog";
import { Footer } from "@/components/mktu/footer";
import { mktuClasses } from "@/data/mktu-data";
import { useFavoritesAndCart } from "@/hooks/use-favorites-cart";

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [openClassId, setOpenClassId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  const {
    favorites,
    cart,
    mounted,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    isInCart,
    addToCart,
    removeFromCart,
    toggleItemInCart,
    isItemSelectedInCart,
    clearCart,
  } = useFavoritesAndCart();

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

  const openClass = (classId: number) => {
    setOpenClassId(classId);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        favoritesCount={mounted ? favorites.length : 0}
        cartCount={mounted ? cart.length : 0}
        onOpenFavorites={() => setFavOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onOpenFaq={() => setFaqOpen(true)}
      />

      <main className="flex-1">
        <section
          id="class-grid"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 scroll-mt-16"
        >
          {/* Hint banner */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/5 border border-gold/15">
              <Sparkles className="size-3.5 text-gold" />
              <span className="text-xs text-foreground/60">
                <span className="text-gold">⭐ Избранное</span> →{" "}
                <span className="text-gold">🛒 Корзина</span> →{" "}
                <span className="text-gold">⬇ RTF</span>
              </span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center text-foreground/40 text-xs sm:text-sm mt-2 mb-6 leading-relaxed max-w-2xl mx-auto"
          >
            Подсказка: найдите нужные классы → добавьте в избранное ⭐ → из
            избранного выберите товары чекбоксами → скачайте RTF
          </motion.p>

          <SearchSection
            query={query}
            onQueryChange={setQuery}
            filter={filter}
            onFilterChange={setFilter}
            favoritesCount={mounted ? favorites.length : 0}
            cartCount={mounted ? cart.length : 0}
            onClearFavorites={clearFavorites}
            onClearCart={clearCart}
            onOpenClass={openClass}
            isInCart={isInCart}
            addToCart={addToCart}
            isItemSelectedInCart={isItemSelectedInCart}
            toggleItemInCart={toggleItemInCart}
          />

          {/* Goods section */}
          {showGoods && filteredGoods.length > 0 && (
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
                    onOpenDetail={openClass}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Services section */}
          {showServices && filteredServices.length > 0 && (
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
                    onOpenDetail={openClass}
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
      </main>

      <Footer />

      {/* Modals */}
      <ClassDetailDialog
        classId={openClassId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        isInCart={isInCart}
        addToCart={addToCart}
        isItemSelectedInCart={isItemSelectedInCart}
        toggleItemInCart={toggleItemInCart}
      />

      <FavoritesSheet
        open={favOpen}
        onOpenChange={setFavOpen}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onClearFavorites={clearFavorites}
        onAddToCart={addToCart}
        isInCart={isInCart}
        onOpenClass={openClass}
        cart={cart}
        onOpenCart={() => setCartOpen(true)}
      />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        onRemoveFromCart={removeFromCart}
        onToggleItemInCart={toggleItemInCart}
        onIsItemSelectedInCart={isItemSelectedInCart}
        onClearCart={clearCart}
        onOpenFavorites={() => setFavOpen(true)}
        onOpenClass={openClass}
      />

      <FaqDialog open={faqOpen} onOpenChange={setFaqOpen} />
    </div>
  );
}
