"use client";

import { useEffect, useState, useCallback } from "react";

export type Theme = "dark" | "light" | "navy";

const STORAGE_KEY = "mktu-theme";

const DEFAULT_THEME: Theme = "light";

const THEME_CYCLE: Theme[] = ["dark", "light", "navy"];

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark" || stored === "navy") {
        setThemeState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.remove("dark", "navy");
    if (next === "dark") {
      root.classList.add("dark");
    } else if (next === "navy") {
      root.classList.add("navy");
    }
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
