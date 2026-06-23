"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light" | "grayscale";

const STORAGE_KEY = "mktu-theme";

// Порядок переключения по клику
const THEME_CYCLE: Theme[] = ["dark", "light", "grayscale"];

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark" || stored === "grayscale") {
        setThemeState(stored);
      }
    } catch {
      // ignore — default dark
    }
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    // Снимаем все theme-классы
    root.classList.remove("dark", "grayscale");
    // Ставим нужный (light — без класса, на :root)
    if (next === "dark") {
      root.classList.add("dark");
    } else if (next === "grayscale") {
      root.classList.add("grayscale");
    }
    // light — без класса
    root.style.colorScheme = next === "light" ? "light" : "dark";
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      applyTheme(next);
    },
    [applyTheme],
  );

  const toggleTheme = useCallback(() => {
    const idx = THEME_CYCLE.indexOf(theme);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    setTheme(next);
  }, [theme, setTheme]);

  return { theme, toggleTheme, setTheme, mounted };
}
