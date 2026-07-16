"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, BookOpen, Briefcase, X } from "lucide-react";

const HERO_CLOSED_KEY = "mktu-hero-closed";
const COUNTDOWN_SECONDS = 10;

const stats = [
  {
    value: "34",
    label: "Классов товаров",
    color: "text-gold",
    bg: "bg-gold/10",
    Icon: Package,
  },
  {
    value: "11",
    label: "Классов услуг",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    Icon: Briefcase,
  },
  {
    value: "13-я",
    label: "Редакция МКТУ",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    Icon: BookOpen,
  },
];

export function Hero() {
  const [closed, setClosed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load closed state from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(HERO_CLOSED_KEY);
      if (stored === "1") setClosed(true);
    } catch {
      // ignore
    }
  }, []);

  // Start countdown when hero is visible
  useEffect(() => {
    if (!mounted || closed) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto-close when countdown reaches 0
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mounted, closed]);

  const handleClose = () => {
    setClosed(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    try {
      localStorage.setItem(HERO_CLOSED_KEY, "1");
    } catch {
      // ignore
    }
  };

  const scrollToSearch = () => {
    document
      .getElementById("class-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (mounted && closed) return null;

  // Circular progress for countdown
  const progress = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 360;
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 360) * circumference;

  return (
    <AnimatePresence>
      <motion.section
        id="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden flex flex-col items-center justify-start pt-20 pb-12 sm:pt-24 sm:pb-16"
      >
        {/* Close button with countdown — top-right corner */}
        <div className="absolute top-20 right-4 sm:right-6 z-20">
          <button
            type="button"
            onClick={handleClose}
            title="Закрыть блок"
            aria-label="Закрыть блок"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border-2 border-border hover:border-gold/50 text-foreground/50 hover:text-foreground transition-all shadow-sm"
          >
            {/* Countdown ring (SVG) */}
            <svg
              className="absolute inset-0 -rotate-90 pointer-events-none"
              width="40"
              height="40"
              viewBox="0 0 40 40"
            >
              <circle
                cx="20"
                cy="20"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-border/30"
              />
              <circle
                cx="20"
                cy="20"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-gold transition-all duration-1000 ease-linear"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                }}
              />
            </svg>
            {/* X icon */}
            <X
              className="size-4 group-hover:rotate-90 transition-transform duration-300"
              strokeWidth={2.5}
            />
            {/* Countdown number */}
            {countdown > 0 && (
              <span className="absolute -bottom-5 text-[9px] font-medium text-foreground/30 tabular-nums">
                {countdown}s
              </span>
            )}
          </button>
        </div>

        {/* Background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[128px]" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gold/3 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/2 rounded-full blur-[150px]" />

          {/* Floating particles */}
          {Array.from({ length: 14 }).map((_, i) => {
            const left = `${(i * 7.1) % 100}%`;
            const top = `${(i * 11.3) % 100}%`;
            const delay = (i * 0.3) % 3;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-gold/30"
                style={{ left, top }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block"
          >
            <span className="px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs sm:text-sm font-medium tracking-wide">
              13-я редакция • 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
          >
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              МКТУ-13
            </span>
            <span className="text-foreground/40 text-lg sm:text-xl md:text-2xl font-light">
              {" "}
              2026
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-foreground/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-2 leading-relaxed"
          >
            Международная классификация товаров и услуг для регистрации товарных
            знаков. Полный справочник всех 45 классов МКТУ.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-foreground/50 text-sm sm:text-base md:text-lg mb-8 font-light"
          >
            Бесплатный онлайн сервис для определения МКТУ. Без рекламы и услуг.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8"
          >
            {stats.map(({ value, label, color, bg, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div
                  className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${bg}`}
                >
                  <Icon className={`size-4 sm:size-5 ${color}`} />
                </div>
                <div className="text-left">
                  <div className={`text-lg sm:text-xl font-bold ${color}`}>
                    {value}
                  </div>
                  <div className="text-foreground/50 text-[10px] sm:text-xs">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToSearch}
            className="bg-gold text-background hover:bg-gold-dark font-semibold text-base px-8 h-12 rounded-lg shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all"
          >
            Найти классы
          </motion.button>
        </div>

        <motion.button
          type="button"
          onClick={scrollToSearch}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 mt-10 sm:mt-12 flex flex-col items-center gap-1.5 cursor-pointer"
          aria-label="Прокрутите вниз"
        >
          <span className="text-foreground/40 text-[10px] sm:text-xs tracking-widest">
            Прокрутите вниз
          </span>
          <div className="flex flex-col items-center gap-0">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.25 * i,
                  times: [0, 0.5, 1],
                }}
                className="w-1 h-2.5 bg-gold/60 rounded-full"
              />
            ))}
          </div>
        </motion.button>
      </motion.section>
    </AnimatePresence>
  );
}
