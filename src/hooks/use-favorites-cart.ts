"use client";

import { useEffect, useState, useCallback } from "react";

export interface CartClass {
  classId: number;
  selectedItems: string[];
}

const FAVORITES_KEY = "mktu-favorites";
const CART_KEY = "mktu-cart";

function readFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n) => typeof n === "number");
  } catch {
    return [];
  }
}

function readCart(): CartClass[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (c) =>
          c &&
          typeof c.classId === "number" &&
          Array.isArray(c.selectedItems) &&
          c.selectedItems.every((s: unknown) => typeof s === "string"),
      )
      .map((c) => ({ classId: c.classId, selectedItems: c.selectedItems }));
  } catch {
    return [];
  }
}

export function useFavoritesAndCart() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartClass[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavorites(readFavorites());
    setCart(readCart());
  }, []);

  // Persist favorites
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites, mounted]);

  // Persist cart
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, mounted]);

  const isFavorite = useCallback(
    (classId: number) => favorites.includes(classId),
    [favorites],
  );

  const toggleFavorite = useCallback((classId: number) => {
    setFavorites((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId],
    );
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const isInCart = useCallback(
    (classId: number) => cart.some((c) => c.classId === classId),
    [cart],
  );

  const addToCart = useCallback((classId: number) => {
    setCart((prev) => {
      if (prev.some((c) => c.classId === classId)) return prev;
      return [...prev, { classId, selectedItems: [] }];
    });
  }, []);

  const removeFromCart = useCallback((classId: number) => {
    setCart((prev) => prev.filter((c) => c.classId !== classId));
  }, []);

  const toggleItemInCart = useCallback((classId: number, item: string) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.classId !== classId) return c;
        const has = c.selectedItems.includes(item);
        return {
          ...c,
          selectedItems: has
            ? c.selectedItems.filter((i) => i !== item)
            : [...c.selectedItems, item],
        };
      }),
    );
  }, []);

  const isItemSelectedInCart = useCallback(
    (classId: number, item: string) =>
      cart.find((c) => c.classId === classId)?.selectedItems.includes(item) ??
      false,
    [cart],
  );

  const clearCart = useCallback(() => setCart([]), []);

  return {
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
  };
}
