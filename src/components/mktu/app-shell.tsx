"use client";

import { useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/mktu/header";
import { Footer } from "@/components/mktu/footer";
import { FavoritesSheet } from "@/components/mktu/favorites-sheet";
import { CartSheet } from "@/components/mktu/cart-sheet";
import { useFavoritesCart } from "@/components/mktu/favorites-cart-context";

/**
 * AppShell — общая обёртка для всех страниц.
 * Рендерит Header, FavoritesSheet, CartSheet, Footer.
 * State избранного/корзины живёт в контексте (FavoritesCartProvider в layout),
 * поэтому при навигации между страницами счётчики и данные не теряются.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    favorites,
    cart,
    mounted,
    favOpen,
    cartOpen,
    setFavOpen,
    setCartOpen,
    isFavorite,
    isInCart,
    isItemSelectedInCart,
    toggleFavorite,
    clearFavorites,
    addToCart,
    removeFromCart,
    toggleItemInCart,
    clearCart,
  } = useFavoritesCart();

  // Универсальный переход на страницу класса
  const openClass = (classId: number) => {
    // Закрываем оба sheet-а перед навигацией, чтобы не зависли поверх новой страницы
    setFavOpen(false);
    setCartOpen(false);
    router.push(`/class/${classId}`);
  };

  // На странице деталей класса не показываем Footer (там свой layout контента)
  const isClassDetail = pathname?.startsWith("/class/");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        favoritesCount={mounted ? favorites.length : 0}
        cartCount={mounted ? cart.length : 0}
        onOpenFavorites={() => setFavOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1">{children}</main>

      {!isClassDetail && <Footer />}

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
        onOpenCart={() => {
          setFavOpen(false);
          setCartOpen(true);
        }}
      />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        onRemoveFromCart={removeFromCart}
        onToggleItemInCart={toggleItemInCart}
        onIsItemSelectedInCart={isItemSelectedInCart}
        onClearCart={clearCart}
        onOpenFavorites={() => {
          setCartOpen(false);
          setFavOpen(true);
        }}
        onOpenClass={openClass}
      />
    </div>
  );
}
