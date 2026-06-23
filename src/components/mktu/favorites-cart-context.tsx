"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useFavoritesAndCart } from "@/hooks/use-favorites-cart";

interface FavoritesCartContextValue {
  // state
  favorites: number[];
  cart: import("@/hooks/use-favorites-cart").CartClass[];
  mounted: boolean;
  favOpen: boolean;
  cartOpen: boolean;
  // selectors
  isFavorite: (classId: number) => boolean;
  isInCart: (classId: number) => boolean;
  isItemSelectedInCart: (classId: number, item: string) => boolean;
  // actions
  toggleFavorite: (classId: number) => void;
  clearFavorites: () => void;
  addToCart: (classId: number) => void;
  removeFromCart: (classId: number) => void;
  toggleItemInCart: (classId: number, item: string) => void;
  clearCart: () => void;
  // ui
  openFavorites: () => void;
  closeFavorites: () => void;
  setFavOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
}

const FavoritesCartContext = createContext<FavoritesCartContextValue | null>(
  null,
);

export function FavoritesCartProvider({ children }: { children: ReactNode }) {
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

  const [favOpen, setFavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const value = useMemo<FavoritesCartContextValue>(
    () => ({
      favorites,
      cart,
      mounted,
      favOpen,
      cartOpen,
      isFavorite,
      isInCart,
      isItemSelectedInCart,
      toggleFavorite,
      clearFavorites,
      addToCart,
      removeFromCart,
      toggleItemInCart,
      clearCart,
      openFavorites: () => setFavOpen(true),
      closeFavorites: () => setFavOpen(false),
      setFavOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      setCartOpen,
    }),
    [
      favorites,
      cart,
      mounted,
      favOpen,
      cartOpen,
      isFavorite,
      isInCart,
      isItemSelectedInCart,
      toggleFavorite,
      clearFavorites,
      addToCart,
      removeFromCart,
      toggleItemInCart,
      clearCart,
    ],
  );

  return (
    <FavoritesCartContext.Provider value={value}>
      {children}
    </FavoritesCartContext.Provider>
  );
}

export function useFavoritesCart() {
  const ctx = useContext(FavoritesCartContext);
  if (!ctx) {
    throw new Error(
      "useFavoritesCart must be used within a FavoritesCartProvider",
    );
  }
  return ctx;
}
